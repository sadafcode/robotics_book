# Data Model: Integrated RAG Chatbot

**Feature**: 002-integrated-rag-chatbot
**Status**: Phase 1 Complete

## Overview

This document defines the content entities, metadata schemas, and database structures for the RAG chatbot integration. It covers both the Vector database (Qdrant) and the Relational database (Neon Postgres).

---

## 1. Vector Store Entities (Qdrant)

Used for semantic retrieval of book content.

### Collection: `physical_ai_book_chunks`

| Field | Type | Description |
|-------|------|-------------|
| **vector** | float[384] | Hugging Face `all-MiniLM-L6-v2` representation |
| **payload.content** | string | The actual text or code snippet from the markdown |
| **payload.metadata.chapter_id** | string | Kebab-case chapter ID (from frontmatter) |
| **payload.metadata.section_title** | string | Heading title where the chunk originated |
| **payload.metadata.breadcrumb** | string | Hierarchical path (e.g., "Fundamentals > ROS2 > Publisher") |
| **payload.metadata.url** | string | Relative URL to the section in Docusaurus |
| **payload.metadata.is_code** | boolean | Flag for code-specific chunks |

---

## 2. Relational Entities (Neon Postgres)

Used for session tracking, logging, and analytics.

### table: `chat_sessions`
| Column | Type | Description |
|--------|------|-------------|
| **session_id** | UUID (PK) | Unique identifier for the browser session |
| **created_at** | timestamp | When the session started |
| **updated_at** | timestamp | Last interaction time |

### table: `chat_messages`
| Column | Type | Description |
|--------|------|-------------|
| **message_id** | UUID (PK) | Unique identifier for the message |
| **session_id** | UUID (FK) | Reference to `chat_sessions` |
| **role** | string | 'user' or 'assistant' |
| **content** | text | The message text |
| **selected_text** | text (Nullable) | User-selected context from the page |
| **created_at** | timestamp | Send time |

### table: `message_sources`
| Column | Type | Description |
|--------|------|-------------|
| **source_id** | UUID (PK) | Unique identifier for the citation |
| **message_id** | UUID (FK) | Reference to the assistant's message |
| **chapter_id** | string | Cited chapter |
| **relevance_score** | float | Similarity score from Qdrant |

---

## 3. Validation Rules

1. **Chunk Size**: Standardized between 500-1000 characters to ensure consistent vector quality.
2. **Metadata Consistency**: `chapter_id` must match the actual file name in the `docs/` directory.
3. **Citation Integrity**: Every AI response must include at least one reference link if the knowledge was retrieved from Qdrant.

---

## 4. State Transitions

1. **INDEXING**: Markdown file → Chunking → Embedding → Qdrant Upsert.
2. **QUERYING**: User Input (+ Selection) → Query Embedding → Vector Search → LLM Generation → Response.
3. **LOGGING**: Request/Response → Atomic commit to Neon Postgres.

---

**Design Status**: ✅ COMPLETE - Proceed to Contracts.
