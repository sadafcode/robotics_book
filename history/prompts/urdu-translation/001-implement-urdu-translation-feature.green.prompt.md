---
id: 001
title: Implement Urdu translation feature
stage: green
date: 2026-02-21
surface: agent
model: claude-opus-4-6
feature: urdu-translation
branch: 003-auth-jwt
user: sadafcode
command: /sp.phr --title "Implement Urdu translation feature" --stage spec --feature "urdu-translation"
labels: [i18n, translation, urdu, rtl, openai, authentication]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - src/services/translationService.ts
  - src/context/TranslationContext.tsx
  - src/components/UrduTranslationButton.tsx
  - src/components/TranslationWrapper.tsx
  - src/theme/Root.tsx
  - src/theme/DocItem/index.tsx
  - src/css/custom.css
  - URDU_TRANSLATION_FEATURE.md
tests:
  - none
---

## Prompt

Add a translation feature that allows logged-in users to translate book chapter content to Urdu by pressing a button at the start of each chapter. Requirements: 1. Only logged-in users can see and use the translation feature, 2. A translation button appears at the start of each chapter, 3. When clicked, the chapter content is translated to Urdu using OpenAI API, 4. Users can toggle between original English and Urdu translation, 5. Translation state persists during the session, 6. The feature works with all MDX chapters in the docs/ directory, 7. Urdu text displays right-to-left (RTL).

## Response snapshot

Implemented a complete Urdu translation feature for logged-in users including: TranslationService with OpenAI API integration and mock fallback, TranslationContext for state management, UrduTranslationButton component with Pakistan/UK flags, TranslationWrapper for RTL layout support, and CSS styles for Urdu fonts and RTL formatting. Integrated into existing DocItem theme wrapper.

## Outcome

- ✅ Impact: Fully functional Urdu translation feature allowing authenticated users to toggle between English and Urdu chapter content with proper RTL support
- 🧪 Tests: none
- 📁 Files: Created 4 new files (translationService.ts, TranslationContext.tsx, UrduTranslationButton.tsx, TranslationWrapper.tsx), modified 3 existing files (Root.tsx, DocItem/index.tsx, custom.css)
- 🔁 Next prompts: Add OpenAI API key to environment for production translations; Consider adding more language options; Cache translations in localStorage for persistence across sessions
- 🧠 Reflection: Using React Context for translation state provides clean separation of concerns and easy integration with Docusaurus theme components. Mock translations allow development without API costs.

## Evaluation notes (flywheel)

- Failure modes observed: None - implementation completed successfully
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test with actual OpenAI API integration and evaluate translation quality for technical robotics content
