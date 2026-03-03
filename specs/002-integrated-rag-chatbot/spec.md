# Feature Specification: Integrated RAG Chatbot

**Feature Branch**: `002-integrated-rag-chatbot`
**Created**: 2026-01-02
**Status**: Draft
**Input**: User description: "Integrated RAG Chatbot Development: Build and embed a Retrieval-Augmented Generation (RAG) chatbot within the published book. This chatbot must be able to answer user questions about the book's content, including answering questions based only on text selected by the user."

## Clarifications

### Session 2026-01-02

- Q: Should the chatbot remember previous turns in a conversation (long-term memory across page refreshes), or is history ephemeral to the current tab/session? → A: Ephemeral (Session Storage): History lost on tab close/refresh.
- Q: When text is selected, should the chatbot ONLY use that selection as context, or should it use the selection as a "priority" while still having access to the rest of the book for related details? → A: Selection-First RAG: Prioritize selection but supplement with retrieved book chunks.
- Q: Should we implement the RAG chatbot as a standalone service (FastAPI) that Docusaurus calls, or try to integrate/embed the RAG logic directly into the Docusaurus frontend? → A: Backend-Oriented: Docusaurus (React) ↔ FastAPI ↔ Qdrant/OpenAI.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conversational Book Assistant (Priority: P1)

As a reader of the Physical AI book, I want to ask questions about the book's content in natural language so that I can quickly clarify complex concepts without manual searching.

**Why this priority**: This is the core functionality. Providing instant, accurate answers based on the book is the primary value of the RAG integration.

**Independent Test**: Can be fully tested by posing a question related to a specific chapter and verifying that the chatbot provides a grounded response sourced from that chapter.

**Acceptance Scenarios**:

1. **Given** the book contains a chapter on "ROS 2 Fundamentals", **When** a user asks "How do I create a publisher in ROS 2?", **Then** the chatbot should provide a summary and code example derived from that chapter.
2. **Given** a user question that is NOT covered in the book, **When** the question is asked, **Then** the chatbot should politely state that the information is not in the current book.

---

### User Story 2 - Contextual Selection Explanation (Priority: P2)

As a student studying technical details, I want to select a specific segment of text or code and ask the chatbot to explain it so that I can get deep context on the exact part I'm struggling with.

**Why this priority**: This addresses the specific user requirement for "answering questions based only on text selected by the user," enhancing the educational experience for specific difficult segments.

**Independent Test**: Can be fully tested by highlighting a paragraph, triggering the chatbot "Explain" feature, and verifying the explanation is specific to the selected text.

**Acceptance Scenarios**:

1. **Given** a reader has selected a complex URDF code snippet, **When** they click "Explain Selection", **Then** the chatbot should provide a line-by-line breakdown of that specific snippet.
2. **Given** a reader selects a paragraph about "Kalman Filters", **When** they ask "Can you simplify this?", **Then** the chatbot should use the selected text as the primary context for its simplification.

---

### User Story 3 - Instant Chapter Summary (Priority: P3)

As a busy professional browsing the book, I want to request a quick summary of a long chapter so that I can decide if it's relevant to my current task.

**Why this priority**: This leverages the existing RAG infrastructure to provide an executive overview, saving time for the user.

**Independent Test**: Can be fully tested by clicking a "Summarize" button on a chapter page and verifying the output reflects the key learning objectives.

**Acceptance Scenarios**:

1. **Given** a 20-page chapter on "Manifold Learning", **When** a user requests a summary, **Then** the chatbot should return 3-5 key takeaways and a one-paragraph overview.

---

### Edge Cases

- **Empty Selection**: What happens when a user triggers "Explain Selection" with no text highlighted? (System should prompt to select text or ask a general question).
- **Out-of-Book Queries**: How does the system handle off-topic questions (e.g., "What is the weather?")? (System should remain in-character as a book assistant and refuse non-book-related queries).
- **Ambiguous Text**: How does the system handle selected text that is too short to be meaningful (e.g., a single word)? (System should ask for more context or explain the word in the context of the current chapter).
- **Service Downtime**: What happens if the backend or vector database is unavailable? (System should show a graceful error message indicating the assistant is temporarily offline).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST split all markdown book chapters into semantic chunks for vector indexing.
- **FR-002**: System MUST provide a chatbot interface embedded within the Docusaurus site UI.
- **FR-003**: System MUST identify and retrieve the most relevant book content based on user query similarity.
- **FR-004**: System MUST combine user-selected text (primary context) with retrieved book chunks (supplementary context) for generative responses.
- **FR-005**: System MUST cite the specific chapter and section used to generate an answer.
- **FR-006**: System MUST persist conversation history in-memory for the duration of the browser session (ephemeral).
- **FR-007**: System MUST provide a "Explain this" feature triggered by text selection.

### Key Entities *(include if feature involves data)*

- **Content Chunk**: A semantically coherent segment of a chapter (text + metadata like chapter ID and section).
- **Vector Embedding**: The mathematical representation of a chunk for similarity search.
- **Conversation Session**: A record of user queries and chatbot responses within a single visit.
- **Context Source**: Metadata linking a response back to the original chapter source.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of user queries result in an answer that cites at least one valid chapter source.
- **SC-002**: Chatbot initial response time (TTFT) is under 2 seconds for 95% of queries.
- **SC-003**: "Explain Selection" feature successfully captures and processes text up to 5000 characters.
- **SC-004**: System correctly refuses at least 95% of off-topic (non-robotics/non-book) queries.
- **SC-005**: Chapter summaries are generated in under 3 seconds after the request.
