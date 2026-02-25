from openai import OpenAI
from config import settings

_client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """You are an expert assistant for the "Physical AI & Humanoid Robotics" book.
Answer questions using ONLY the provided context from the book.
If the context doesn't contain enough information, say so honestly.
Always cite which chapter/section your answer comes from.
Keep answers concise but thorough. Use markdown formatting."""


def generate_response(
    query: str,
    retrieved_chunks: list[dict],
    selected_text: str | None = None,
) -> tuple[str, list[dict]]:
    """Generate a RAG response using GPT-4o.

    Returns (answer_text, deduplicated_sources).
    """
    # Build context block
    context_parts = []

    if selected_text:
        context_parts.append(
            f"=== Selected Text from Page ===\n{selected_text}\n"
        )

    for i, chunk in enumerate(retrieved_chunks, 1):
        breadcrumb = chunk["metadata"].get("breadcrumb", "Unknown")
        context_parts.append(
            f"=== Source {i}: {breadcrumb} ===\n{chunk['text']}\n"
        )

    context = "\n".join(context_parts)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {query}",
        },
    ]

    resp = _client.chat.completions.create(
        model=settings.CHAT_MODEL,
        messages=messages,
        temperature=0.3,
        max_tokens=1024,
    )
    answer = resp.choices[0].message.content

    # Deduplicate sources by title+heading
    seen = set()
    sources = []
    for chunk in retrieved_chunks:
        key = (chunk["metadata"]["title"], chunk["metadata"]["heading"])
        if key not in seen:
            seen.add(key)
            sources.append({
                "title": chunk["metadata"]["title"],
                "heading": chunk["metadata"]["heading"],
                "source_file": chunk["metadata"]["source_file"],
                "score": round(chunk["score"], 3),
            })

    return answer, sources
