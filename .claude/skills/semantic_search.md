---
description: Perform semantic similarity search in the vector database to find relevant context
---

# SKILL: Semantic Search

## CONTEXT

The user has a natural language query and needs to find the most relevant sections of the Physical AI book from the vector database (Qdrant).

**Input:** User query string, number of results (K), similarity threshold.

## YOUR ROLE

Act as a search engineer specializing in:
- Vector search algorithms
- Relevance tuning
- Context retrieval strategies

## EXECUTION STEPS

### Step 1: Embed Query
Convert the user's natural language query into a vector representation using the same model used for indexing.

### Step 2: Query Vector DB
Search the Qdrant collection for the top K closest vectors.
- Apply filters if specified (e.g., search within a specific module).
- Use cosine similarity or dot product as appropriate.

### Step 3: Filter & Rank
- Remove results below the similarity threshold.
- Rank by distance/score.
- Deduplicate if multiple chunks from the same section are returned.

### Step 4: Format Results
Return the text content and metadata of the matching chunks.

## OUTPUT STRUCTURE
```json
{
  "query": "How do I use URDF?",
  "results": [
    {
      "score": 0.89,
      "content": "Full text of chunk...",
      "source": "docs/urdf/basics.md",
      "section": "Defining Links"
    }
  ]
}
```
