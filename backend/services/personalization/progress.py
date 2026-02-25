"""Progress tracking service."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.personalization import UserProgress


async def upsert_progress(
    db: AsyncSession,
    user_id: str,
    chapter_id: str,
    time_spent_seconds: int,
    completed: bool,
) -> UserProgress:
    result = await db.execute(
        select(UserProgress).where(
            UserProgress.user_id == user_id,
            UserProgress.chapter_id == chapter_id,
        )
    )
    record = result.scalar_one_or_none()

    if record:
        record.time_spent_seconds += time_spent_seconds
        if completed:
            record.completed = True
    else:
        record = UserProgress(
            user_id=user_id,
            chapter_id=chapter_id,
            time_spent_seconds=time_spent_seconds,
            completed=completed,
        )
        db.add(record)

    await db.commit()
    await db.refresh(record)
    return record
