# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `/specs/002-integrated-rag-chatbot/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base environment.

- [X] T001 [P] Initialize FastAPI backend with `pyproject.toml` or `requirements.txt` in backend/
- [X] T002 Configure environment variables (OpenRouter, Qdrant, Neon) in backend/.env
- [ ] T003 Setup Neon Serverless Postgres project and get connection string
- [ ] T004 Setup Qdrant Cloud Cluster and get API key

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [X] T005 [P] Implement SQLAlchemy models base and DB connection in backend/src/models/base.py
- [X] T006 [P] Initialize FastAPI application structure in backend/src/main.py
- [X] T007 Implement Qdrant client utility in backend/src/services/qdrant_client.py
- [X] T008 Implement OpenRouter/OpenAI client orchestration in backend/src/services/ai_client.py
- [X] T009 Implement base RAG types and schemas in backend/src/core/schemas.py

---

## Phase 3: User Story 1 - Conversational Book Assistant (Priority: P1) 🎯 MVP

**Goal**: Natural language Q&A grounded in chapter content.

**Independent Test**: Verify `/api/v1/chat/completions` returns grounded answers after indexing a sample chapter.

### Implementation for User Story 1
- [X] T010 [P] [US1] Implement semantic markdown chunking logic in backend/src/services/chunker.py
- [X] T011 [US1] Create indexing script/logic for bulk chunk upsert to Qdrant in backend/src/services/indexer.py
- [X] T012 [US1] Implement retrieval service (vector search) in backend/src/services/retriever.py
- [X] T013 [US1] Implement grounded generation logic in backend/src/services/generator.py
- [X] T014 [US1] Implement `/api/v1/chat/completions` endpoint in backend/src/api/chat.py
- [X] T015 [US1] Create the primary ChatWidget React component using ChatKit (stream-chat-react library) in frontend/src/components/ChatWidget.tsx
- [X] T016 [US1] Integrate ChatWidget into Docusaurus globally via frontend/src/theme/Root.tsx

---

## Phase 4: User Story 2 - Contextual Selection Explanation (Priority: P2)

**Goal**: Answering questions based on specific text selected by the user.

**Independent Test**: Select a paragraph in Docusaurus, trigger "Explain Selection", and verify backend uses the snippet as primary context.

### Implementation for User Story 2
- [X] T017 [US2] Create selection capture hook `useSelection` in frontend/src/hooks/useSelection.ts
- [X] T018 [US2] Update ChatWidget to handle selection state and pass to API in frontend/src/components/ChatWidget.tsx
- [X] T019 [US2] Update backend generator service to prioritize `selected_text` context in backend/src/services/generator.py
- [X] T020 [US2] Add "Explain this" contextual menu/trigger to the book UI in frontend/src/hooks/ui_trigger.ts

---

## Phase 5: User Story 3 - Instant Chapter Summary (Priority: P3)

**Goal**: Executive overview of entire chapters.

**Independent Test**: Hit `/api/v1/chat/summarize` and verify it returns a valid summary and key takeaways.

### Implementation for User Story 3
- [X] T021 [P] [US3] Implement summarization prompt and logic in backend/src/services/summarizer.py
- [X] T022 [US3] Create `/api/v1/chat/summarize` endpoint in backend/src/api/chat.py
- [X] T023 [US3] Add "Summarize Chapter" button to Docusaurus sidebar/page layout in frontend/src/components/SummaryButton.tsx

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Persistence, logging, and security.

- [X] T024 [P] Implement chat session logging to Neon Postgres in backend/src/models/chat_log.py
- [X] T025 [P] Implement citation formatting skill in backend/src/services/citator.py
- [X] T026 Add error boundary and loading states to ChatWidget
- [X] T027 Run full indexing for all published book chapters

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Phase 1 & 2** are strictly required before US1.
2. **US1 (MVP)** must be functional before US2 (Selection) is added.
3. **US3 (Summaries)** depends on the generative pipeline but not on selection logic.

### Parallel Opportunities
- T001, T005, T006 can run in parallel (Backend setup).
- T010 (Chunker) can be developed independently of the backend API structure.
- US2 and US3 can be worked on in parallel once US1 core API is stable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Initialize FastAPI, Qdrant, and Neon.
2. Build basic Indexer and Chunker.
3. Pulse-check: Run a test query against indexed content.
4. Build minimal ChatWidget.

### Incremental Delivery
1. Index the first chapter.
2. Deploy US1 (Basic Q&A).
3. Layer on US2 (Text Selection logic).
4. Finish with US3 (Chapter Summarization).
