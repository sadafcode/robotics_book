"""
OpenAI-powered translation service for Urdu translations.
Uses GPT-4o-mini with batch translation for fast response.
"""

import logging
from openai import OpenAI
from config import settings

logger = logging.getLogger(__name__)

_client: OpenAI | None = None


def _get_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


SYSTEM_PROMPT = (
    "You are a professional English to Urdu translator. "
    "Rules:\n"
    "- Preserve technical terms, code snippets, and proper nouns in English\n"
    "- Keep numbers, URLs, and file paths as-is\n"
    "- Use natural, readable Urdu (Nastaliq script)\n"
    "- Return ONLY the translated text, no explanations"
)

BATCH_SYSTEM_PROMPT = (
    "You are a professional English to Urdu translator. "
    "You will receive a numbered list of English text items. "
    "Translate each one to Urdu and return them as a numbered list in the EXACT same format.\n"
    "Rules:\n"
    "- Preserve technical terms, code snippets, and proper nouns in English\n"
    "- Keep numbers, URLs, and file paths as-is\n"
    "- Use natural, readable Urdu (Nastaliq script)\n"
    "- Return ONLY the numbered list, no extra text\n"
    "- Format: '1. translation\\n2. translation\\n...'"
)


def translate_text(text: str, target_language: str = "ur") -> str:
    """Translate a single text using GPT-4o-mini."""
    if not text.strip() or target_language == "en":
        return text

    try:
        response = _get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
            temperature=0.1,
            max_tokens=2048,
        )
        return response.choices[0].message.content or text
    except Exception as e:
        logger.error(f"OpenAI translation error: {e}")
        return text


def translate_texts_batch(texts: list[str], target_language: str = "ur") -> list[str]:
    """
    Translate multiple texts in a SINGLE API call.
    Much faster than calling translate_text() N times.
    """
    if not texts:
        return texts

    if target_language == "en":
        return texts

    # Filter out empty strings but keep track of indices
    non_empty = [(i, t) for i, t in enumerate(texts) if t.strip()]
    if not non_empty:
        return texts

    numbered_input = "\n".join(f"{i + 1}. {text}" for i, (_, text) in enumerate(non_empty))

    try:
        response = _get_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": BATCH_SYSTEM_PROMPT},
                {"role": "user", "content": numbered_input},
            ],
            temperature=0.1,
            max_tokens=4096,
        )
        raw = response.choices[0].message.content or ""

        # Parse "1. translation\n2. translation\n..." back into a list
        parsed: dict[int, str] = {}
        for line in raw.strip().splitlines():
            line = line.strip()
            if not line:
                continue
            if ". " in line:
                num_part, translation = line.split(". ", 1)
                try:
                    parsed[int(num_part) - 1] = translation.strip()
                except ValueError:
                    pass

        # Build result array, falling back to original if parse failed
        result = list(texts)
        for list_idx, (orig_idx, original) in enumerate(non_empty):
            result[orig_idx] = parsed.get(list_idx, original)

        return result

    except Exception as e:
        logger.error(f"OpenAI batch translation error: {e}")
        return texts


def check_translation_available() -> dict:
    """Check if translation service is available."""
    try:
        _get_client()
        return {
            "available": True,
            "provider": "openai",
            "model": "gpt-4o-mini",
        }
    except Exception as e:
        return {
            "available": False,
            "provider": "openai",
            "error": str(e),
        }
