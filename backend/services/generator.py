from openai import OpenAI
from config import settings

_client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """You are an expert assistant for the "Physical AI & Humanoid Robotics" book.

Rules:
- ALWAYS answer directly using the provided context. Never ask the user to clarify unless the context is completely empty.
- If the query is vague (e.g. "explain", "tell me more"), summarize the most relevant content from ALL provided context chunks.
- If multiple topics are in the context, give a brief overview of each — do not ask the user to pick one.
- Only say "I don't have information on that" if the context truly contains nothing relevant.
- Always cite which chapter/section your answer comes from.
- Keep answers concise but thorough. Use markdown formatting."""


def generate_response(
    query: str,
    retrieved_chunks: list[dict],
    selected_text: str | None = None,
    history: list[dict] | None = None,
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

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Inject prior conversation turns (last 10 messages max)
    if history:
        for turn in history[-10:]:
            if turn.get("role") in ("user", "assistant") and turn.get("content"):
                messages.append({"role": turn["role"], "content": turn["content"]})

    messages.append({
        "role": "user",
        "content": f"Context:\n{context}\n\nQuestion: {query}",
    })

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
