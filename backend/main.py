from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from models.database import init_db, get_session
from models.chat_log import ChatSession, ChatMessage, MessageSource, MessageRole
from services.embedder import embed_query
from services.retriever import search
from services.generator import generate_response
from routes.personalization import router as personalization_router
from services.translation import translate_text, translate_texts_batch, check_translation_available


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="Physical AI Book RAG API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://sadafcode.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personalization_router)


class ChatRequest(BaseModel):
    message: str
    selected_text: str | None = None
    session_id: str = "default"


class SourceResponse(BaseModel):
    title: str
    heading: str
    source_file: str
    score: float


class ChatResponse(BaseModel):
    content: str
    sources: list[SourceResponse]
    session_id: str


@app.get("/health")
async def health():
    return {"status": "ok"}


# Translation endpoints
class TranslationRequest(BaseModel):
    text: str
    target_language: str = "ur"


class TranslationResponse(BaseModel):
    translated_text: str
    original_text: str
    target_language: str


class BatchTranslationRequest(BaseModel):
    texts: list[str]
    target_language: str = "ur"


class BatchTranslationResponse(BaseModel):
    translated_texts: list[str]
    target_language: str


@app.get("/api/v1/translation/status")
async def translation_status():
    """Check if translation service is available."""
    return check_translation_available()


@app.post("/api/v1/translation/translate", response_model=TranslationResponse)
async def translate(req: TranslationRequest):
    """Translate text to target language using OpenAI GPT-4o-mini."""
    translated = translate_text(req.text, req.target_language)
    return TranslationResponse(
        translated_text=translated,
        original_text=req.text,
        target_language=req.target_language,
    )


@app.post("/api/v1/translation/translate-batch", response_model=BatchTranslationResponse)
async def translate_batch(req: BatchTranslationRequest):
    """Translate multiple texts in a single OpenAI call (fast batch mode)."""
    translated = translate_texts_batch(req.texts, req.target_language)
    return BatchTranslationResponse(
        translated_texts=translated,
        target_language=req.target_language,
    )


@app.post("/api/v1/chat/completions", response_model=ChatResponse)
async def chat_completions(
    req: ChatRequest,
    db: AsyncSession = Depends(get_session),
):
    # 1. Embed the query
    query_vec = embed_query(req.message)

    # 2. Retrieve relevant chunks from Qdrant
    hits = search(query_vec)

    # 3. Generate response with GPT-4o
    answer, sources = generate_response(
        query=req.message,
        retrieved_chunks=hits,
        selected_text=req.selected_text,
    )

    # 4. Log to database
    existing = await db.get(ChatSession, req.session_id)
    if not existing:
        db.add(ChatSession(id=req.session_id))

    user_msg = ChatMessage(
        session_id=req.session_id,
        role=MessageRole.USER,
        content=req.message,
    )
    db.add(user_msg)

    assistant_msg = ChatMessage(
        session_id=req.session_id,
        role=MessageRole.ASSISTANT,
        content=answer,
    )
    db.add(assistant_msg)
    await db.flush()

    for src in sources:
        chunk_text = ""
        for hit in hits:
            if hit["metadata"]["title"] == src["title"] and hit["metadata"]["heading"] == src["heading"]:
                chunk_text = hit["text"][:500]
                break
        db.add(MessageSource(
            message_id=assistant_msg.id,
            title=f"{src['title']} > {src['heading']}",
            chunk_text=chunk_text,
            score=src["score"],
        ))

    await db.commit()

    return ChatResponse(
        content=answer,
        sources=[SourceResponse(**s) for s in sources],
        session_id=req.session_id,
    )
