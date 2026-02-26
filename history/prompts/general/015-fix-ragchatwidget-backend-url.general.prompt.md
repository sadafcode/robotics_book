---
id: 015
title: Fix RAGChatWidget Backend URL and Port
stage: general
date: 2026-02-26
surface: agent
model: claude-sonnet-4-6
feature: 002-integrated-rag-chatbot
branch: 003-auth-jwt
user: User
command: none
labels: ["deployment", "render", "rag-chatbot", "cors", "bug-fix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/theme/RAGChatWidget.tsx
tests:
  - none
---

## Prompt

yes (fix RAGChatWidget localhost:8001 hardcoded URL)

## Response snapshot

Fixed `src/theme/RAGChatWidget.tsx`:
- Added `BACKEND_URL` constant with runtime hostname detection (same pattern as `client.ts`)
- Dev: `http://localhost:8000` (also fixed wrong port 8001 → 8000)
- Production: `https://physical-ai-backend.onrender.com`
- Replaced hardcoded URL in fetch call with `${BACKEND_URL}/api/v1/chat/completions`

## Outcome

- ✅ Impact: RAGChatWidget now correctly calls Render backend in production and correct localhost port in dev
- 🧪 Tests: none
- 📁 Files: src/theme/RAGChatWidget.tsx
- 🔁 Next prompts: All URL fixes complete — ready to commit and deploy
- 🧠 Reflection: Port 8001 was a bug (uvicorn defaults to 8000); caught during deployment review

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
