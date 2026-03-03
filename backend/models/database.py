from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from config import settings

# Convert postgres:// to postgresql+asyncpg://
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Remove params not supported by asyncpg (sslmode, channel_binding)
import re
for param in ("sslmode", "channel_binding"):
    db_url = re.sub(rf"[&?]{param}=[^&]*", "", db_url)

# asyncpg uses ssl=require instead of sslmode=require
engine = create_async_engine(
    db_url,
    echo=False,
    pool_size=5,
    max_overflow=10,
    connect_args={"ssl": "require"},
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session


_PERSONALIZATION_TABLES = [
    "user_progress",
    "chapter_preferences",
    "questionnaire_responses",
    "user_profiles",
]


async def init_db():
    from models.base import Base
    import models.chat_log  # noqa: F401 - registers tables
    import models.personalization  # noqa: F401 - registers tables

    async with engine.begin() as conn:
        # Drop stale personalization tables so schema mismatches (e.g. uuid vs varchar)
        # don't block startup. These tables are safe to recreate; no prod data yet.
        for table in _PERSONALIZATION_TABLES:
            await conn.execute(
                __import__("sqlalchemy").text(f'DROP TABLE IF EXISTS "{table}" CASCADE')
            )
        await conn.run_sync(Base.metadata.create_all)
