---
id: 013
title: Fix CORS Auth Server Production Origins
stage: general
date: 2026-02-26
surface: agent
model: claude-sonnet-4-6
feature: 003-auth-jwt
branch: 003-auth-jwt
user: User
command: none
labels: ["cors", "auth-server", "better-auth", "deployment", "github-pages"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - auth-server.js
tests:
  - none
---

## Prompt

haan, CORS bhi fix karo

## Response snapshot

Updated `auth-server.js` to allow both `http://localhost:3000` (dev) and `https://sadafcode.github.io` (production GitHub Pages) in:
1. Express CORS middleware `origin` array
2. BetterAuth `trustedOrigins` array

GitHub Pages URL sourced from `docusaurus.config.ts` (`url: 'https://sadafcode.github.io'`).

## Outcome

- ✅ Impact: Auth server will accept requests from production frontend on GitHub Pages
- 🧪 Tests: none
- 📁 Files: auth-server.js (CORS + trustedOrigins updated)
- 🔁 Next prompts: Frontend mein auth API URL env var set karna hoga (BETTER_AUTH_URL pointing to Render service)
- 🧠 Reflection: Both CORS middleware AND BetterAuth trustedOrigins must be updated — missing either causes auth failures

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
