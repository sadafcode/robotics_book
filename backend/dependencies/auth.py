import time
from typing import Any

import httpx
from fastapi import Depends, HTTPException, Request

from config import settings

# Simple in-memory session cache: cache_key -> (user_dict, expire_ts)
_session_cache: dict[str, tuple[dict, float]] = {}
_CACHE_TTL = 30.0  # seconds


def _get_http_client():
    """Provide a shared httpx client per request cycle."""
    return httpx.AsyncClient(timeout=5.0)


async def get_current_user(
    request: Request,
    http_client: httpx.AsyncClient = Depends(_get_http_client),
) -> dict[str, Any]:
    """Validate session by proxying Bearer token or cookies to the BetterAuth server.

    Raises 401 if no valid session is found.
    """
    # Prefer Authorization: Bearer <token> (works cross-origin without cookies)
    auth_header = request.headers.get("authorization", "")
    cookie_header = request.headers.get("cookie", "")
    cache_key = auth_header or cookie_header

    # Check cache first
    cached = _session_cache.get(cache_key)
    if cached:
        user_data, expires_at = cached
        if time.monotonic() < expires_at:
            return user_data

    forward_headers: dict[str, str] = {}
    if auth_header:
        forward_headers["authorization"] = auth_header
    else:
        forward_headers["cookie"] = cookie_header

    try:
        response = await http_client.get(
            f"{settings.AUTH_SERVER_URL}/api/auth/get-session",
            headers=forward_headers,
        )
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth server unavailable")

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    data = response.json()
    if not data or "user" not in data or not data["user"]:
        raise HTTPException(status_code=401, detail="No active session")

    user = data["user"]

    # Store in cache
    _session_cache[cache_key] = (user, time.monotonic() + _CACHE_TTL)

    return user


async def get_optional_user(
    request: Request,
    http_client: httpx.AsyncClient = Depends(_get_http_client),
) -> dict[str, Any] | None:
    """Like get_current_user but returns None instead of raising 401."""
    try:
        return await get_current_user(request, http_client)
    except HTTPException:
        return None
