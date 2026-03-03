"""One-shot script: chunk all book docs → embed → upsert to Qdrant.

Usage:
    cd backend
    python -m scripts.index_book
"""
import hashlib
from pathlib import Path

# Ensure config loads from correct .env
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from config import settings
from services.chunker import chunk_markdown_file
from services.embedder import embed_texts
from services.retriever import ensure_collection, upsert_chunks

DOCS_DIR = Path(__file__).resolve().parent.parent.parent / "docs"


def make_id(text: str, metadata: dict) -> str:
    """Deterministic ID from content hash so re-runs are idempotent."""
    raw = f"{metadata.get('source_file', '')}:{metadata.get('heading', '')}:{text[:100]}"
    return hashlib.md5(raw.encode()).hexdigest()


def main():
    print(f"Indexing docs from: {DOCS_DIR}")
    md_files = sorted(DOCS_DIR.rglob("*.md"))
    print(f"Found {len(md_files)} markdown files")

    all_chunks = []
    for fpath in md_files:
        chunks = chunk_markdown_file(fpath)
        print(f"  {fpath.relative_to(DOCS_DIR)}: {len(chunks)} chunks")
        all_chunks.extend(chunks)

    print(f"\nTotal chunks: {len(all_chunks)}")
    if not all_chunks:
        print("No chunks to index. Exiting.")
        return

    # Ensure Qdrant collection exists
    ensure_collection()

    # Embed in batches of 50
    batch_size = 50
    all_ids = []
    all_vectors = []
    all_payloads = []

    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i : i + batch_size]
        texts = [c.text for c in batch]
        print(f"Embedding batch {i // batch_size + 1}/{(len(all_chunks) - 1) // batch_size + 1} ({len(texts)} chunks)...")
        vectors = embed_texts(texts)

        for chunk, vec in zip(batch, vectors):
            cid = make_id(chunk.text, chunk.metadata)
            all_ids.append(cid)
            all_vectors.append(vec)
            all_payloads.append({
                "text": chunk.text,
                **chunk.metadata,
            })

    # Upsert to Qdrant
    print(f"Upserting {len(all_ids)} vectors to Qdrant collection '{settings.QDRANT_COLLECTION}'...")
    upsert_chunks(all_ids, all_vectors, all_payloads)
    print("Done! Book content indexed successfully.")


if __name__ == "__main__":
    main()
