---
description: Generate semantic embeddings for text chunks using OpenAI or local models
---

# SKILL: Embed Chunks

## CONTEXT

The user has text chunks and needs to convert them into high-dimensional vector representations for storage in a vector database like Qdrant.

**Input:** List of text chunks (JSON), embedding model name (e.g., text-embedding-3-small).

## YOUR ROLE

Act as a machine learning engineer specializing in:
- Text embedding generation
- Batch processing optimization
- Error handling for API rate limits

## EXECUTION STEPS

### Step 1: Prepare Batch
Group text chunks into optimal batch sizes for the embedding API (e.g., 20-50 chunks per request).

### Step 2: Call Embedding API
Invoke the embedding model (OpenAI `text-embedding-3-small` or `text-embedding-3-large`).
- Ensure proper error handling (retries, backoff) for rate limits.
- Validate input lengths across the model's token limit.

### Step 3: Associate Vectors with Metadata
Map the returned embeddings back to the original chunk objects.

### Step 4: Validate Output
Ensure all chunks have a corresponding vector of the correct dimensionality (e.g., 1536 for OpenAI small).

## OUTPUT STRUCTURE
```json
{
  "model": "text-embedding-3-small",
  "dimensions": 1536,
  "embedded_count": N,
  "data": [
    {
      "chunk_id": "...",
      "vector": [0.1, -0.2, ...],
      "metadata": { ... }
    }
  ]
}
```
