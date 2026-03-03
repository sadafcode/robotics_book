import uuid
from datetime import datetime, timezone
from typing import Literal

from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from models.base import Base


class ExpertiseLevel(str, enum.Enum):
    NON_TECHNICAL = "non_technical"
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    PROFESSIONAL = "professional"


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)  # = BetterAuth user.id
    expertise_level: Mapped[str] = mapped_column(
        SAEnum(ExpertiseLevel, name="expertise_level"), default="beginner"
    )
    questionnaire_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    raw_score: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    responses: Mapped[list["QuestionnaireResponse"]] = relationship(
        back_populates="profile", cascade="all, delete-orphan"
    )
    chapter_preferences: Mapped[list["ChapterPreference"]] = relationship(
        back_populates="profile", cascade="all, delete-orphan"
    )
    progress: Mapped[list["UserProgress"]] = relationship(
        back_populates="profile", cascade="all, delete-orphan"
    )


class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_responses"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id", ondelete="CASCADE"))
    question_key: Mapped[str] = mapped_column(String(64))
    answer_value: Mapped[int] = mapped_column(Integer)
    score: Mapped[int] = mapped_column(Integer)

    profile: Mapped["UserProfile"] = relationship(back_populates="responses")


class ChapterPreference(Base):
    __tablename__ = "chapter_preferences"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id", ondelete="CASCADE"))
    chapter_id: Mapped[str] = mapped_column(String(128))
    override_level: Mapped[str] = mapped_column(
        SAEnum(ExpertiseLevel, name="expertise_level_chapter"), nullable=True
    )

    __table_args__ = (UniqueConstraint("user_id", "chapter_id", name="uq_chapter_pref"),)

    profile: Mapped["UserProfile"] = relationship(back_populates="chapter_preferences")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.id", ondelete="CASCADE"))
    chapter_id: Mapped[str] = mapped_column(String(128))
    time_spent_seconds: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (UniqueConstraint("user_id", "chapter_id", name="uq_user_progress"),)

    profile: Mapped["UserProfile"] = relationship(back_populates="progress")
