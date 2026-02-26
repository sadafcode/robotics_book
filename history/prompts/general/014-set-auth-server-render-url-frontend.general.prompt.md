---
id: 014
title: Set Auth Server Render URL in Frontend
stage: general
date: 2026-02-26
surface: agent
model: claude-sonnet-4-6
feature: 003-auth-jwt
branch: 003-auth-jwt
user: User
command: none
labels: ["deployment", "render", "auth-client", "better-auth", "frontend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/auth/client.ts
tests:
  - none
---

## Prompt

Frontend mein bhi auth server ka Render URL set karna hoga — kya woh bhi check karein? yeah bhi kerdo

## Response snapshot

Updated `src/auth/client.ts` baseURL to auto-detect environment at runtime:
- localhost → `http://localhost:3001` (dev)
- production → `https://physical-ai-auth-server.onrender.com`

Used `window.location.hostname` check (with SSR guard) instead of hardcoding, following the project's existing pattern seen in ChatWidget.tsx and translationService.ts.

## Outcome

- ✅ Impact: Frontend auth client will correctly call Render auth server in production and localhost in dev
- 🧪 Tests: none
- 📁 Files: src/auth/client.ts
- 🔁 Next prompts: RAGChatWidget.tsx has localhost:8001 hardcoded (wrong port, should be 8000 or Render URL) — may need fixing
- 🧠 Reflection: Runtime hostname check is cleaner than build-time env vars for a static Docusaurus site; avoids needing GitHub Actions secrets for this value

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
