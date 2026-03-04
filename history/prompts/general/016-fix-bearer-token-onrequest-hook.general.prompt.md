---
id: "016"
title: "Fix Bearer Token onRequest Hook"
stage: general
date: "2026-03-04"
surface: agent
model: claude-sonnet-4-6
feature: "003-auth-jwt"
branch: master
user: sadafcode
command: debug signin not working
labels: ["auth", "bug-fix", "bearer-token", "better-auth"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files:
  - src/auth/client.ts
tests: []
---

## Prompt

abhi bhi signin kaam nahi ker raha — signin still not working after bearer token changes.

## Response

**Root Cause Found:** `ctx.options.headers` in the `onRequest` hook was the bug.

In `@better-fetch/fetch`, the `ctx` object passed to `onRequest` is the request context directly — spread from the options with `url`, `headers` (a `Headers` instance), `body`, `method`, `signal`. There is **no** `ctx.options` property.

Timeline of failure:
1. Sign-in itself worked (no token in localStorage yet → `if (token)` = false → no error)
2. After redirect, `/get-session` was called with the token in localStorage
3. `ctx.options.headers = {...}` threw `TypeError: Cannot set properties of undefined`
4. `@better-fetch/fetch` caught the error, set session atom to `{ data: null, error }`
5. User appeared not logged in despite successful sign-in

**Fix:** `ctx.options.headers = { ...ctx.options.headers, Authorization: \`Bearer \${token}\` }` → `ctx.headers.set("Authorization", \`Bearer \${token}\`)`

Committed as `02b1428f` and pushed to master → GitHub Actions will redeploy to GitHub Pages.

## Outcome

- Bug identified through deep source-code analysis of `@better-fetch/fetch` internal context structure
- One-line fix in `src/auth/client.ts`
- Build passes, pushed to master
