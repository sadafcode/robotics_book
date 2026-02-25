---
id: 013
title: Implement Fresh BetterAuth Login/Signup
stage: green
date: 2026-02-17
surface: agent
model: claude-opus-4-6
feature: 003-auth-jwt
branch: 003-auth-jwt
user: User
command: implement
labels: ["auth", "betterauth", "express", "login", "signup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - auth-server.js
  - src/auth/client.ts
  - src/components/AuthProvider.tsx
  - src/pages/login.tsx
  - src/pages/signup.tsx
  - src/theme/Root.tsx
  - docusaurus.config.ts
  - package.json
  - .env
tests:
  - Docusaurus build passes (npm run build)
  - Auth server starts without parse errors (node auth-server.js)
---

## Prompt

Implement the following plan:

# Plan: Fresh BetterAuth Login/Signup Implementation

## Context
The hackathon project (Docusaurus robotics book site) has two conflicting auth systems - a FastAPI JWT backend and an incomplete BetterAuth setup. User wants a clean, fresh BetterAuth-only implementation for login/signup. This replaces all existing auth code.

## Architecture
- **Server**: Express.js + BetterAuth (Node.js) on port 3001
- **Database**: Neon Serverless Postgres via direct URL
- **Client**: `better-auth/react` with `createAuthClient` + `useSession` hook
- **Frontend**: Docusaurus React pages (login, signup)

## Response snapshot

Implemented all 10 steps from the plan:
1. Installed express, cors, dotenv; removed fastify; added auth-server script
2. Created .env with generated secret and placeholder DB URL
3. Rewrote auth-server.js with Express + BetterAuth using toNodeHandler, CORS, email+password
4. Rewrote src/auth/client.ts with createAuthClient from better-auth/react
5. Rewrote AuthProvider with authClient.useSession() hook - no manual token management
6. Rewrote login.tsx with clean form using authClient.signIn.email()
7. Rewrote signup.tsx with clean form using authClient.signUp.email()
8. Added Login/Signup nav links to docusaurus.config.ts navbar
9. Deleted old files: auth-config.ts, api/auth.ts, auth-test.tsx, backend/, LoginForm, SignupForm, test files
10. Updated Root.tsx to use simplified AuthProvider (removed AuthModal)

## Outcome

- Impact: Replaced dual auth system (FastAPI JWT + incomplete BetterAuth) with clean BetterAuth-only implementation
- Tests: Docusaurus build passes, auth-server starts correctly
- Files: 8 files modified/created, 7 files deleted, 1 directory removed
- Next prompts: Set NEON_DATABASE_URL in .env, test signup/login flow end-to-end
- Reflection: Used BetterAuth's built-in cookie-based session management instead of manual JWT/localStorage handling

## Evaluation notes (flywheel)

- Failure modes observed: Express v5 installed (not v4) - required *splat route syntax per BetterAuth docs
- Graders run and results (PASS/FAIL): Build PASS, server start PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test with real Neon DB URL to verify full auth flow
