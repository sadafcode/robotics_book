from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
)
from config import settings

client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY, timeout=60)


def ensure_collection():
    """Create the Qdrant collection if it doesn't exist."""
    collections = [c.name for c in client.get_collections().collections]
    if settings.QDRANT_COLLECTION not in collections:
        client.create_collection(
            collection_name=settings.QDRANT_COLLECTION,
            vectors_config=VectorParams(
                size=settings.EMBEDDING_DIM,
                distance=Distance.COSINE,
            ),
        )


def upsert_chunks(ids: list[str], vectors: list[list[float]], payloads: list[dict]):
    """Upsert chunk vectors with metadata payloads into Qdrant."""
    points = [
        PointStruct(id=idx, vector=vec, payload=pay)
        for idx, vec, pay in zip(ids, vectors, payloads)
    ]
    # Batch in groups of 20 (small batches for cloud free tier)
    batch_size = 20
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        print(f"  Upserting batch {i // batch_size + 1} ({len(batch)} points)...")
        client.upsert(
            collection_name=settings.QDRANT_COLLECTION,
            points=batch,
        )


def search(query_vector: list[float], top_k: int = None) -> list[dict]:
    """Search Qdrant for the most similar chunks. Returns list of {text, metadata, score}."""
    top_k = top_k or settings.TOP_K
    results = client.query_points(
        collection_name=settings.QDRANT_COLLECTION,
        query=query_vector,
        limit=top_k,
        with_payload=True,
    )
    hits = []
    for point in results.points:
        hits.append({
            "text": point.payload.get("text", ""),
            "metadata": {
                "title": point.payload.get("title", ""),
                "source_file": point.payload.get("source_file", ""),
                "heading": point.payload.get("heading", ""),
                "breadcrumb": point.payload.get("breadcrumb", ""),
            },
            "score": point.score,
        })
    return hits
