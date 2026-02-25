# Implementation Plan: Integrated RAG Chatbot

**Branch**: `002-integrated-rag-chatbot` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-integrated-rag-chatbot/spec.md`

## Summary

Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the "Physical AI & Humanoid Robotics" book. The system will allow users to ask questions about chapter content and get detailed explanations for selected text. The implementation uses a FastAPI backend, Qdrant Cloud for vector storage, Neon Serverless Postgres for interaction logging, and OpenAI for both embeddings and generative responses.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), Node.js v18+ (Frontend)
**Primary Dependencies**: FastAPI, Qdrant-Client, Sentence Transformers (Hugging Face), SQLAlchemy, Vercel AI SDK (React), react-markdown
**Storage**: Qdrant Cloud (Vector), Neon Serverless Postgres (Relational)
**Testing**: pytest (Backend), Jest/React Testing Library (Frontend)
**Target Platform**: FastAPI service, Docusaurus (GitHub Pages)
**Project Type**: Hybrid (Backend API + Web Frontend Integration)
**Performance Goals**: TTFT < 1.5s, Vector Search < 200ms
**Constraints**: Ephemeral session storage, OpenAI usage limits, mobile-responsive UI
**Scale/Scope**: ~15-50 chapters, session-based persistence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Agent-Orchestrated Workflow ✅ PASS
- **Check**: RAG operations delegated via `RAGChatbotSubAgent`.
- **Status**: COMPLIANT.

### II. Skills-First Architecture ✅ PASS
- **Check**: Minimal 19 skills including 7 new RAG skills in `.claude/skills/`.
- **Status**: COMPLIANT.

### III. Documentation-Driven Development ✅ PASS
- **Check**: Chapters are source of truth for RAG indexing.
- **Status**: COMPLIANT.

### IV. Research-Backed Content ✅ PASS
- **Check**: AI responses cite specific chapter sources.
- **Status**: COMPLIANT.

## Project Structure

### Documentation (this feature)

```text
specs/002-integrated-rag-chatbot/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (run /sp.tasks)
```

### Source Code

```text
backend/
├── src/
│   ├── api/             # FastAPI routes
│   ├── models/          # SQLAlchemy schemas
│   ├── services/        # RAG Logic, Qdrant, OpenAI
│   └── main.py          # Entry point
└── tests/

frontend/
├── src/
│   ├── components/      # ChatWidget.tsx
│   ├── hooks/           # useSelection.ts
│   └── services/        # ChatAPI.ts
└── [Docusaurus...]
```

**Structure Decision**: Web application with backend. Docusaurus calls the FastAPI RAG service.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

---

## Phase 0: Research & Technical Decisions (COMPLETE)
See [research.md](./research.md) for strategy on chunking and selection-based retrieval.

## Phase 1: Design & Contracts (COMPLETE)
See [data-model.md](./data-model.md) and [contracts/openapi.md](./contracts/openapi.md) for schema and API protocol.

## Phase 2: Implementation Strategy
Proceed to `/sp.tasks` to generate actionable implementation steps.
