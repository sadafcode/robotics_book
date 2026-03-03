"""Personalization API routes."""

from typing import Literal, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from models.database import get_session
from models.personalization import UserProfile, QuestionnaireResponse, ChapterPreference, ExpertiseLevel
from dependencies.auth import get_current_user
from services.personalization.classifier import QUESTIONS, compute_score
from services.personalization.learning_path import get_learning_path
from services.personalization.recommendations import get_recommendations
from services.personalization.progress import upsert_progress

router = APIRouter(prefix="/api/v1/personalization", tags=["personalization"])

VALID_LEVELS = {"non_technical", "beginner", "intermediate", "professional"}


# ── Pydantic models ──────────────────────────────────────────────────────────

class QuestionnaireSubmit(BaseModel):
    answers: dict[str, int]  # {question_key: answer_index}


class ChapterOverride(BaseModel):
    chapter_id: str
    level: Literal["non_technical", "beginner", "intermediate", "professional"]


class ProgressRecord(BaseModel):
    chapter_id: str
    time_spent_seconds: int = 0
    completed: bool = False

    @field_validator("time_spent_seconds")
    @classmethod
    def clamp_time(cls, v: int) -> int:
        return max(0, min(v, 86400))  # cap at 24h


# ── Profile endpoints ─────────────────────────────────────────────────────────

@router.post("/profile")
async def submit_questionnaire(
    body: QuestionnaireSubmit,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Submit questionnaire answers, classify user, create/update profile."""
    user_id: str = user["id"]
    raw_score, level = compute_score(body.answers)

    # Upsert profile
    profile = await db.get(UserProfile, user_id)
    if profile:
        profile.expertise_level = level
        profile.questionnaire_completed = True
        profile.raw_score = raw_score
        # Delete old responses
        await db.execute(
            delete(QuestionnaireResponse).where(QuestionnaireResponse.user_id == user_id)
        )
    else:
        profile = UserProfile(
            id=user_id,
            expertise_level=level,
            questionnaire_completed=True,
            raw_score=raw_score,
        )
        db.add(profile)

    await db.flush()

    # Save individual responses
    for q in QUESTIONS:
        key = q["key"]
        idx = body.answers.get(key, 0)
        if 0 <= idx < len(q["options"]):
            score = q["options"][idx]["score"]
            db.add(QuestionnaireResponse(
                user_id=user_id,
                question_key=key,
                answer_value=idx,
                score=score,
            ))

    await db.commit()
    return {"expertise_level": level, "raw_score": raw_score, "user_id": user_id}


@router.get("/profile")
async def get_profile(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Get user profile including chapter preferences."""
    user_id: str = user["id"]
    profile = await db.get(UserProfile, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Load chapter preferences
    result = await db.execute(
        select(ChapterPreference).where(ChapterPreference.user_id == user_id)
    )
    prefs = result.scalars().all()

    return {
        "user_id": user_id,
        "expertise_level": profile.expertise_level,
        "questionnaire_completed": profile.questionnaire_completed,
        "raw_score": profile.raw_score,
        "chapter_preferences": {
            p.chapter_id: p.override_level for p in prefs
        },
    }


@router.delete("/profile")
async def delete_profile(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Delete all personalization data for the current user."""
    user_id: str = user["id"]
    profile = await db.get(UserProfile, user_id)
    if profile:
        await db.delete(profile)
        await db.commit()
    return {"deleted": True}


# ── Chapter endpoints ─────────────────────────────────────────────────────────

@router.post("/chapter")
async def save_chapter_override(
    body: ChapterOverride,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Save a chapter-level content override."""
    user_id: str = user["id"]

    # Ensure profile exists
    profile = await db.get(UserProfile, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found — complete the questionnaire first")

    result = await db.execute(
        select(ChapterPreference).where(
            ChapterPreference.user_id == user_id,
            ChapterPreference.chapter_id == body.chapter_id,
        )
    )
    pref = result.scalar_one_or_none()

    if pref:
        pref.override_level = body.level
    else:
        pref = ChapterPreference(
            user_id=user_id,
            chapter_id=body.chapter_id,
            override_level=body.level,
        )
        db.add(pref)

    await db.commit()
    return {"chapter_id": body.chapter_id, "level": body.level}


@router.delete("/chapter/{chapter_id}")
async def reset_chapter_override(
    chapter_id: str,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Remove chapter-level override, reverting to profile default."""
    user_id: str = user["id"]
    await db.execute(
        delete(ChapterPreference).where(
            ChapterPreference.user_id == user_id,
            ChapterPreference.chapter_id == chapter_id,
        )
    )
    await db.commit()
    return {"deleted": True, "chapter_id": chapter_id}


# ── Learning path & recommendations ──────────────────────────────────────────

@router.get("/learning-path")
async def learning_path(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Return ordered chapter list for the user's expertise level."""
    user_id: str = user["id"]
    profile = await db.get(UserProfile, user_id)
    level = profile.expertise_level if profile else "beginner"
    return {"level": level, "chapters": get_learning_path(level)}


@router.get("/recommendations")
async def recommendations(
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Return hardware/software recommendations for the user's level."""
    user_id: str = user["id"]
    profile = await db.get(UserProfile, user_id)
    level = profile.expertise_level if profile else "beginner"
    return {"level": level, **get_recommendations(level)}


# ── Progress ──────────────────────────────────────────────────────────────────

@router.post("/progress")
async def record_progress(
    body: ProgressRecord,
    user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_session),
):
    """Record reading progress for a chapter."""
    user_id: str = user["id"]

    # Ensure profile exists
    profile = await db.get(UserProfile, user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    record = await upsert_progress(
        db=db,
        user_id=user_id,
        chapter_id=body.chapter_id,
        time_spent_seconds=body.time_spent_seconds,
        completed=body.completed,
    )
    return {
        "chapter_id": record.chapter_id,
        "time_spent_seconds": record.time_spent_seconds,
        "completed": record.completed,
    }


# ── Questionnaire schema ───────────────────────────────────────────────────────

@router.get("/questionnaire-schema")
async def questionnaire_schema():
    """Return the questionnaire questions and answer options (public)."""
    return {"questions": QUESTIONS}
