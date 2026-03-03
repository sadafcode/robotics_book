---
id: 015
title: Implement Personalization Feature (All 5 User Stories)
stage: green
date: 2026-02-20
surface: agent
model: claude-sonnet-4-6
feature: 004-personalization-agent
branch: 003-auth-jwt
user: user
command: implement personalization plan
labels: ["personalization","backend","frontend","rag","auth","questionnaire","adaptive-content"]
links:
  spec: specs/004-personalization-agent/
  ticket: null
  adr: null
  pr: null
files:
  - backend/models/base.py
  - backend/models/chat_log.py
  - backend/models/personalization.py
  - backend/models/database.py
  - backend/config.py
  - backend/requirements.txt
  - backend/dependencies/__init__.py
  - backend/dependencies/auth.py
  - backend/routes/__init__.py
  - backend/routes/personalization.py
  - backend/services/personalization/__init__.py
  - backend/services/personalization/classifier.py
  - backend/services/personalization/learning_path.py
  - backend/services/personalization/recommendations.py
  - backend/services/personalization/progress.py
  - backend/main.py
  - src/services/personalizationApi.ts
  - src/context/PersonalizationContext.tsx
  - src/hooks/usePersonalization.ts
  - src/hooks/useProgressTracker.ts
  - src/theme/Root.tsx
  - src/components/PersonalizationButton.tsx
  - src/components/BackgroundQuestionnaire.tsx
  - src/components/ContentSection.tsx
  - src/components/PersonalizationBadge.tsx
  - src/components/PersonalizationBar.tsx
  - src/components/LearningPath.tsx
  - src/components/HardwareRecommendations.tsx
  - src/pages/questionnaire.tsx
  - src/pages/learning-path.tsx
  - src/pages/recommendations.tsx
  - src/pages/personalization-demo.tsx
  - src/pages/signup.tsx
  - src/theme/DocItem/index.tsx
  - src/css/custom.css
tests:
  - "Manual: auth bridge — GET /api/v1/personalization/profile with valid session returns 404 (no profile)"
  - "Manual: questionnaire — POST /api/v1/personalization/profile with 7 answers returns correct level"
  - "Manual: chapter override — POST /api/v1/personalization/chapter saves, GET /profile reflects it"
  - "Manual: learning-path — GET /api/v1/personalization/learning-path returns ordered chapters"
  - "Manual: recommendations — GET /api/v1/personalization/recommendations returns level-appropriate items"
  - "Manual: progress — POST /api/v1/personalization/progress increments time"
  - "Manual: delete — DELETE /api/v1/personalization/profile removes all data"
  - "Frontend: ContentSection renders correct sections per level"
  - "Frontend: PersonalizationBar appears on doc pages with badge + button"
---

## Prompt

Implement the following plan:

# Personalization Feature - Full Implementation Plan

[Full plan content — 7 phases, 43 tasks, 5 user stories covering questionnaire, adaptive content,
chapter personalization, learning path, hardware recommendations, and cross-cutting concerns.
Auth bridge: BetterAuth session proxy. DB: 4 new tables. API: 8 endpoints. CSS: level color coding.]

## Response snapshot

Implemented complete personalization system across 7 phases:

**Phase 1 (Infrastructure):**
- Extracted `Base` to `backend/models/base.py` (shared by chat_log + personalization)
- Created 4 DB models: `UserProfile`, `QuestionnaireResponse`, `ChapterPreference`, `UserProgress`
- `backend/dependencies/auth.py`: session proxy to BetterAuth at port 3001, 30s in-memory cache
- `backend/routes/personalization.py`: 8 endpoints under `/api/v1/personalization`
- Added `httpx` + `slowapi` to requirements.txt; `AUTH_SERVER_URL` to config
- Frontend: `PersonalizationContext`, `usePersonalization` hook, `personalizationApi` service
- Fixed `PersonalizationButton` (removed broken `token`, uses `credentials:'include'`)
- `Root.tsx` wrapped with `PersonalizationProvider`

**Phase 2 (Questionnaire):**
- `classifier.py`: 7 questions, weighted scoring (0-21), 4 thresholds
- `BackgroundQuestionnaire.tsx`: multi-step form with progress bar
- `/questionnaire` page; signup now redirects to questionnaire

**Phase 3 (Adaptive Content):**
- `ContentSection.tsx`: renders children only when `levels` includes current level
- `PersonalizationBadge.tsx`: colored badge per level
- `data-user-level` body attribute synced from context
- CSS fallback rules for hiding sections without JS

**Phase 4 (Chapter Personalization):**
- `PersonalizationBar.tsx`: badge + button injected above every doc page
- `src/theme/DocItem/index.tsx`: Docusaurus swizzle wrapping `@theme-original/DocItem`

**Phase 5 (Learning Path):**
- `learning_path.py`: 10-chapter catalog with `min_level` filtering
- `LearningPath.tsx` visual timeline; `/learning-path` page

**Phase 6 (Hardware Recommendations):**
- `recommendations.py`: static recommendations for all 4 levels
- `HardwareRecommendations.tsx` card grid; `/recommendations` page

**Phase 7 (Cross-Cutting):**
- `useProgressTracker.ts`: IntersectionObserver + scroll detection, flush on unmount
- CSS: level color coding (green/blue/orange/purple), questionnaire styles, bar styles
- Graceful fallback: no level → show all content; auth unavailable → 503

## Outcome

- ✅ Impact: Full personalization system — questionnaire, adaptive content, chapter overrides, learning path, recommendations, progress tracking, privacy delete
- 🧪 Tests: Manual verification plan documented above (8 test scenarios)
- 📁 Files: 35 files created/modified across backend and frontend
- 🔁 Next prompts: Add navbar links to questionnaire/learning-path/recommendations; write automated tests; add rate limiting enforcement
- 🧠 Reflection: Auth bridge pattern (cookie forwarding + 30s cache) avoids JWT complexity while keeping FastAPI independent of BetterAuth internals

## Evaluation notes (flywheel)

- Failure modes observed: None at implementation stage; auth bridge needs live testing with both servers running
- Graders run and results (PASS/FAIL): Not yet run (manual testing required)
- Prompt variant (if applicable): null
- Next experiment: Test auth bridge with real BetterAuth cookie; verify Docusaurus DocItem swizzle renders bar correctly
