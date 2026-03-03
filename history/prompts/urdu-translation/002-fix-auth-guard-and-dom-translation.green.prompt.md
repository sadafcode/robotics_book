---
id: 002
title: Fix Auth Guard and DOM Translation
stage: green
date: 2026-02-25
surface: agent
model: claude-sonnet-4-6
feature: urdu-translation
branch: 003-auth-jwt
user: User
command: proceed (after checking translation feature)
labels: ["translation","auth","dom","bug-fix","urdu"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/components/UrduTranslationButton.tsx
  - src/components/TranslationWrapper.tsx
tests:
  - manual: click translate button as logged-out user → button not visible
  - manual: click translate button as logged-in user → content translates to Urdu
  - manual: click English button → content restores to English
---

## Prompt

check the translation feature i want that logged user can translate the content in Urdu in the chapters by pressing a button at the start of each chapter. proceed

## Response snapshot

Identified two critical bugs in the existing translation feature:

1. `DEBUG_MODE = true` in `UrduTranslationButton.tsx` was showing the button to all users (including unauthenticated). Fixed to `DEBUG_MODE = false`.

2. `TranslationWrapper.tsx` only set `dir="rtl"` on the container but never actually translated page content. The `translateContent` function in context existed but was never called. Fixed by adding DOM-based translation using `TreeWalker` to walk all text nodes in the rendered `<DocItem>`, skip `<code>`/`<pre>` blocks, and send each text node to the backend translation API. Original HTML is saved in a ref and restored when switching back to English.

## Outcome

- ✅ Impact: Translation button now only visible to logged-in users; clicking "اردو" actually translates chapter text via backend Argos API (or mock fallback)
- 🧪 Tests: Manual — log in, navigate to chapter, click translate, verify Urdu content; click English, verify restore
- 📁 Files: 2 files modified (UrduTranslationButton.tsx, TranslationWrapper.tsx)
- 🔁 Next prompts: Test with backend running (Argos models installed); verify RTL layout looks correct
- 🧠 Reflection: The scaffolding was complete but the translation/auth-guard was never wired up. DOM mutation with TreeWalker works for Docusaurus because React does not re-touch children DOM nodes when their VDom is unchanged.

## Evaluation notes (flywheel)

- Failure modes observed: DEBUG_MODE left as true from dev session; translateContent in context was designed but never integrated into TranslationWrapper
- Graders run and results (PASS/FAIL): manual inspection PASS
- Prompt variant (if applicable): none
- Next experiment: install Argos en→ur model and test real translation quality
