---
id: 003
title: Implement RAG skills for RAGChatbotSubAgent
stage: general
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5
feature: none
branch: gh-pages
user: User
command: implement RAG skills
labels: ["rag", "skills", "chatbot", "constitution"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .claude/skills/chunk_chapter_content.md
 - .claude/skills/embed_chunks.md
 - .claude/skills/semantic_search.md
 - .claude/skills/generate_answer.md
 - .claude/skills/explain_selected_text.md
 - .claude/skills/generate_chapter_summary.md
 - .claude/skills/cite_sources.md
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

For RAGChatbotSubAgent:

chunk_chapter_content - Split into semantic chunks
embed_chunks - Generate embeddings
semantic_search - Find relevant chunks
generate_answer - Create response with context
explain_selected_text - Explain highlighted text
generate_chapter_summary - Summarize entire chapter
cite_sources - Add chapter references to answer (make these skills in .claude\skills for RAGChatbotSubAgent and update in constitution for this )

## Response snapshot

Created 7 new RAG-focused skills in `.claude/skills/` and updated the project constitution to include the `RAGChatbotSubAgent` and its associated skills.

## Outcome

- ✅ Impact: Established core RAG pipeline capabilities via reusable skills. Updated project governance to include RAG agent role.
- 📁 Files: Created 7 skill files and modified `.specify/memory/constitution.md`.
- 🔁 Next prompts: Implement the FastAPI endpoints for the RAG chatbot using these skills; Configure Qdrant collection for Physical AI book indexing.
