from openai import OpenAI
from config import settings

_client = OpenAI(api_key=settings.OPENAI_API_KEY)


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts. Returns list of embedding vectors."""
    resp = _client.embeddings.create(
        input=texts,
        model=settings.EMBEDDING_MODEL,
    )
    return [item.embedding for item in resp.data]


def embed_query(text: str) -> list[float]:
    """Embed a single query string."""
    return embed_texts([text])[0]
