---
id: 003
title: Switch Translation Backend to OpenAI
stage: green
date: 2026-02-25
surface: agent
model: claude-sonnet-4-6
feature: urdu-translation
branch: 003-auth-jwt
user: User
command: switch translation to OpenAI
labels: ["translation","openai","backend","urdu"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/services/translation.py
  - backend/main.py
tests:
  - manual: curl POST /api/v1/translation/translate with English text → returns Urdu
  - manual: GET /api/v1/translation/status → returns available:true, provider:openai
---

## Prompt

argos model sahi work nahi ker raha i18n say kertay hain kya khayal hai tumhara / haan kar do OpenAI pe switch

## Response snapshot

Explained why i18n is wrong approach (URL-based routing, requires pre-translated MDX files, doesn't support logged-in-only button). Recommended OpenAI GPT-4o-mini since OPENAI_API_KEY already exists in project config.

Replaced `backend/services/translation.py` entirely: removed Argos dependency, added OpenAI client using `settings.OPENAI_API_KEY`. System prompt instructs GPT-4o-mini to translate to Urdu while preserving technical terms, code, numbers, and proper nouns. Updated comment in `main.py`.

## Outcome

- ✅ Impact: High-quality Urdu translation via GPT-4o-mini; no model download required; uses existing API key
- 🧪 Tests: Manual curl test of /api/v1/translation/translate
- 📁 Files: 2 files modified
- 🔁 Next prompts: Test full flow — login, navigate chapter, click اردو button
- 🧠 Reflection: Argos en→ur model quality was poor and setup was fragile; OpenAI is already integrated in the project so zero extra config needed

## Evaluation notes (flywheel)

- Failure modes observed: Argos had poor quality and missing language model; i18n requires static pre-translated files
- Graders run and results (PASS/FAIL): manual inspection PASS
- Prompt variant (if applicable): none
- Next experiment: measure translation latency per chapter and consider caching at backend level
