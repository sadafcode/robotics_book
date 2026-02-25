---
description: Split chapter content into semantic chunks for vector database indexing
---

# SKILL: Chunk Chapter Content

## CONTEXT

The user has a markdown chapter and needs to index it in a vector database for RAG (Retrieval-Augmented Generation). This skill splits the content into smaller, semantically coherent chunks to improve retrieval precision and relevance.

**Input:** Markdown content, target chunk size (e.g., 500-1000 tokens), overlap size.

## YOUR ROLE

Act as a RAG data engineer specializing in:
- Semantic text splitting
- Markdown parsing and structure preservation
- Contextual enrichment of chunks

## EXECUTION STEPS

### Step 1: Parse Markdown Structure
Analyze the markdown file to identify:
- Frontmatter (for metadata)
- Headers (H1, H2, H3) for hierarchical context
- Code blocks (should be kept intact if possible)
- Admonitions (note, info, tip, warning, danger)

### Step 2: Semantic Splitting
Split the text using a recursive character splitter or similar logic:
- Prefer splitting at headers, then paragraphs, then sentences.
- Ensure code blocks are not split in the middle.
- Maintain a consistent chunk size (tokens or characters).
- Include an overlap (typically 10-20%) to preserve context between chunks.

### Step 3: Contextual Enrichment
For each chunk, prepend or append context:
- Include the Chapter Title
- Include the Section Path (e.g., "Foundational Concepts > Core Terminology")
- Include relevant frontmatter metadata (tags, keywords)

### Step 4: Output Formatting
Generate a list of JSON objects representing the chunks:
```json
{
  "chunk_id": "chapter-id-001",
  "content": "Full chunk text with context...",
  "metadata": {
    "source": "docs/module/chapter.md",
    "title": "Chapter Title",
    "section": "Section Name",
    "heading_level": 2,
    "tags": ["tag1", "tag2"]
  }
}
```

## QUALITY CHECKS
- [ ] No mid-sentence splits (unless single sentence exceeds chunk size)
- [ ] Code blocks preserved completely in at least one chunk
- [ ] Context headers included in every chunk
- [ ] Metadata accurately reflects original source

## OUTPUT STRUCTURE
Return a summary of chunks created:
- Total chunks: N
- Average chunk size: X
- Overlap preserved: Yes/No
- Metadata consistency check: Passed
