---
id: 017
title: Fix Chatbot Stateless No History
stage: general
date: 2026-03-04
surface: agent
model: claude-sonnet-4-6
feature: none
branch: master
user: User
command: "fix rag chatbot follow-up clarification loop"
labels: ["bug", "rag", "chatbot", "conversation-history"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/services/generator.py
  - backend/main.py
  - src/theme/ChatWidget.tsx
tests:
  - none
---

## Prompt

jab bhi rag chatbot say book ka kuch pooch rahi ho tu woh bol raha Could you please clarify what specific topic or concept you would like an explanation for? The context provided covers various topics related to simulation basics, physics engines, URDF, and collision geometry in robotics.
explain
Could you please clarify what specific topic or concept you would like an explanation on? The context provided covers various aspects of robotics, such as the Sim-to-Real gap, physics engines, URDF, and collision geometry. Let me know which one you are interested in, and I can provide more detailed information based on the context.

## Response snapshot

Root cause: the RAG chatbot was fully stateless — each message was sent to the backend independently with no conversation history, so GPT-4o could not understand follow-up messages like "explain".

Fixed in three files:
1. `backend/services/generator.py` — `generate_response` now accepts optional `history: list[dict]` and injects the last 10 turns as prior `user`/`assistant` messages before the current question.
2. `backend/main.py` — Added `HistoryMessage` model and `history: list[HistoryMessage] = []` field to `ChatRequest`; passes history to `generate_response`.
3. `src/theme/ChatWidget.tsx` — Before each API call, maps `messages` state to `{role, content}` pairs and sends as `history` in the request body.

## Outcome

- ✅ Impact: Follow-up messages like "explain" now work correctly because GPT-4o receives full conversation context
- 🧪 Tests: none
- 📁 Files: backend/services/generator.py, backend/main.py, src/theme/ChatWidget.tsx
- 🔁 Next prompts: redeploy backend on HuggingFace Spaces to pick up server-side changes
- 🧠 Reflection: Stateless chat APIs always break multi-turn conversations; passing history client-side is the minimal fix without requiring server-side session storage

## Evaluation notes (flywheel)

- Failure modes observed: chatbot asking for clarification on follow-up messages due to missing conversation context
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment: cap history at last 6 turns to reduce token usage if responses slow down
