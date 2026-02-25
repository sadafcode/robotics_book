# ADR-002: RAG Pipeline and Chatbot Architecture for Physical AI Book

> **Scope**: Document the architectural decisions for the integrated RAG chatbot, including the data pipeline, backend infrastructure, and frontend integration.

- **Status:** Accepted
- **Date:** 2026-01-02
- **Feature:** RAG Chatbot Integration
- **Context:** The Physical AI documentation site needs an interactive way for users to query book content. This requires a Retrieval-Augmented Generation (RAG) system that can process markdown chapters, store them in a vector database, and provide a chatbot interface that answers questions based on the book's content and user-selected text. The system must operate within the constraints of free-tier cloud services (Qdrant Cloud, Neon Postgres) while providing high-quality, grounded responses.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Yes - Long-term architectural decision for data retrieval and user interaction.
     2) Alternatives: Yes - Multiple RAG architectures and database combinations considered.
     3) Scope: Yes - Cross-cutting concern affecting content processing, backend API, and frontend UI.
-->

## Decision

We will implement an **Integrated RAG Pipeline and Chatbot Architecture**:

### 1. Data Pipeline (The "Retriever")
- **Chunking Strategy**: Semantic markdown splitting via `RAGChatbotSubAgent` with header-aware context preservation.
- **Embedding Model**: OpenAI `text-embedding-3-small` for a balance of performance and cost.
- **Vector Database**: **Qdrant Cloud (Free Tier)** for storing and searching high-dimensional vectors.

### 2. Backend Infrastructure
- **Framework**: **FastAPI** (Python 3.11+) for high-performance asynchronous API endpoints.
- **Relational Database**: **Neon Serverless Postgres** via SQLAlchemy 2.0+ for storing conversation history, user feedback, and metadata.
- **Orchestration**: Specialized `RAGChatbotSubAgent` to handle chunking, embedding, and query processing using encapsulated skills.

### 3. AI & LLM Orchestration
- **Generation Model**: OpenAI **GPT-4o / GPT-4 Turbo** for grounded response generation using retrieved context.
- **SDKs**: OpenAI Agents SDK and ChatKit for standardized chatbot interactions.
- **Prompting Strategy**: System prompts enforced via skills (`generate_answer`, `cite_sources`) to ensure responses are strictly grounded in book content.

### 4. Frontend Integration
- **UI Components**: React-based ChatKit UI embedded within the Docusaurus site.
- **Interactivity**: Support for "explain selected text" by passing UI selection context to the RAG backend.
- **Streaming**: Implementation of Server-Sent Events (SSE) or WebSockets for real-time response streaming.

## Consequences

### Positive
1. **High Relevance**: Semantic search ensures users find exact information even with natural language queries.
2. **Reduced Hallucination**: Grounding the LLM in specific book chapters (RAG) ensures technical accuracy.
3. **Scalability**: Decoupled backend (FastAPI) and vector store (Qdrant) allow for independent scaling as content grows.
4. **Developer Experience**: Using established SDKs (ChatKit, Agents SDK) speeds up implementation of standard chatbot features.
5. **Traceability**: Neon Postgres integration ensures all interactions are logged for quality improvement.

### Negative
1. **Operational Complexity**: Managing multiple cloud services (Qdrant, Neon, OpenAI) increases the surface area for failure.
2. **Latency**: Multiple hops (Search -> Retrieve -> LLM Generation) can impact user experience without aggressive streaming.
3. **Cost Sensitivity**: High-volume usage of OpenAI credits and potential free-tier limits on Qdrant/Neon.
4. **Privacy/Security**: Need to ensure user queries and history are handled securely in accordance with project standards.

## Alternatives Considered

### Alternative A: Client-Side Search (Fuse.js/MiniSearch)
- **Pros**: Zero cost, privacy-preserving, no backend needed.
- **Cons**: Poor semantic understanding, limited to keyword matching, cannot generate natural language answers.
- **Why rejected**: Insufficient for complex technical queries prevalent in Physical AI education.

### Alternative B: Integrated Search (Algolia DocSearch only)
- **Pros**: Easy to set up, standard for documentation.
- **Cons**: No generative capability, limited to finding pages rather than answering specific questions.
- **Why rejected**: Doesn't meet the requirement for a conversational assistant that understands the context of the book.

### Alternative C: Single-Database Solution (pgvector in Neon)
- **Pros**: Simpler architecture (one database for both metadata and vectors).
- **Cons**: Neon free tier limits might be hit sooner, less specialized vector search features compared to Qdrant.
- **Why rejected**: Qdrant provides a better developer experience for dedicated vector operations and superior filtering capabilities.

## References

- Feature Spec: `specs/001-physical-ai-book-site/spec.md`
- Implementation Plan: `specs/001-physical-ai-book-site/plan.md`
- Related ADRs: `history/adr/001-multi-agent-orchestration-pattern.md`
- Evaluator Evidence: `history/prompts/general/003-implement-rag-skills.general.prompt.md`
