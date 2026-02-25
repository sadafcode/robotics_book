# Research: Integrated RAG Chatbot

**Feature**: 002-integrated-rag-chatbot
**Date**: 2026-01-02
**Status**: Phase 0 Complete

## Overview

This document resolves technical unknowns for implementing an integrated RAG (Retrieval-Augmented Generation) chatbot for the Physical AI documentation site. Research covers backend infrastructure, vector database management, frontend integration, and contextual selection logic.

---

## Research Task 1: RAG Pipeline Infrastructure (FastAPI + Qdrant + OpenAI)

### Decision: FastAPI Backend with specialized RAG sub-agents

**Chosen Approach**: Implement a standalone FastAPI service that orchestrates the RAG pipeline using OpenAI for embeddings/generation and Qdrant Cloud for vector storage.

**Rationale**:
- **Separation of Concerns**: Keeps heavy computation and sensitive API keys off the Docusaurus static site.
- **Performance**: FastAPI's asynchronous nature is ideal for handling concurrent LLM and database requests.
- **Expertise**: Leverages the `rag-chatbot-expert` and `vector-db-manager` agents as defined in the environment.

**Alternatives Considered**:
1. **Serverless Functions (Next.js/Vercel)** - Rejected: Doesn't fit the existing Docusaurus static site structure on GitHub Pages.
2. **Client-Side RAG** - Rejected: Security risk (API keys exposed) and performance bottlenecks.

---

## Research Task 2: Chunking Strategy and Extraction

### Decision: Recursive Markdown Splitting with Contextual Prepending

**Chosen Approach**: Use recursive character splitting that respects Markdown headers, preserving an overlap of 10-15%.

**Rationale**:
- **Semantic Integrity**: Preserves the relationship between headers and their content.
- **Context Injection**: Prepending breadcrumbs (e.g., `Module > Chapter > Section`) to each chunk ensures the LLM understands the global context of a small snippet.
- **Code Blocks**: Handled as atomic units to prevent breaking runnable examples (ROS 2/URDF).

---

## Research Task 3: Neon Postgres Integration for Logs and Metadata

### Decision: SQL-based Interaction Logging

**Chosen Approach**: Use Neon Serverless Postgres via SQLAlchemy to log user queries, selected text, AI responses, and source citations.

**Rationale**:
- **Continuous Improvement**: Logs allow for future fine-tuning and evaluation of RAG performance.
- **Scalability**: Neon's serverless nature matches the project's flexible deployment strategy.
- **Analytics**: Enables tracking of most-queried chapters and common user pain points.

---

## Research Task 4: Content Selection and Frontend Integration

### Decision: Global Chat Widget with Selection Listener

**Chosen Approach**: Embed a React chat widget globally via Docusaurus `Root` component, utilizing `window.getSelection()` to capture and pass context.

**Rationale**:
- **Seamless UX**: Users can select text anywhere in the book and immediately trigger an "Explain" query.
- **Vercel AI SDK**: Provides the best patterns for streaming responses and state management in React.
- **React-Markdown**: Ensures code snippets and math in AI responses render correctly.

---

## Summary of Decisions

| Research Task | Decision | Rationale |
|---------------|----------|-----------|
| **1. Infrastructure** | FastAPI + Qdrant Cloud | Secure key management, excellent performance, specialized agent support. |
| **2. Data Pipeline** | Recursive MD Splitting | High semantic precision for technical content. |
| **3. Persistence** | Neon Postgres (SQLAlchemy) | Interaction logging, session metadata storage. |
| **4. Frontend** | React ChatKit + Selection Listener | Optimized UX for "Explain Selection" requirement. |
| **5. AI Model** | OpenRouter (GPT-4o/Claude) | Aggregated access to top models, unified billing, and API flexibility. |

---

**Research Status**: ✅ COMPLETE - All technical unknowns resolved. Proceed to Phase 1 (Design).
