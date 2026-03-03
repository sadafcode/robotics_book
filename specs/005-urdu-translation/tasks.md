# Tasks: 005 — Urdu Translation

**Input**: `specs/005-urdu-translation/spec.md`, `specs/005-urdu-translation/plan.md`
**Status**: ✅ Implemented (2026-02-25)

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create `specs/005-urdu-translation/` directory and scaffold spec/plan/tasks files
- [x] T002 [P] Add `TranslationProvider` to `src/theme/Root.tsx`
- [x] T003 [P] Create `src/context/TranslationContext.tsx` with `currentLanguage`, `toggleLanguage`, `setLanguage`

---

## Phase 2: Foundational (Blocking Prerequisites)

**⚠️ Must complete before user story work**

- [x] T004 Create `src/services/translationService.ts` with `translateTexts()` batch function and `translateText()` single function
- [x] T005 [P] Create `backend/services/translation.py` with OpenAI GPT-4o-mini `translate_texts_batch()` using numbered-list prompt format
- [x] T006 [P] Add `POST /api/v1/translation/translate-batch` endpoint to `backend/main.py`
- [x] T007 [P] Add `GET /api/v1/translation/status` endpoint to `backend/main.py`
- [x] T008 Verify `OPENAI_API_KEY` available via `backend/config.py` pydantic-settings

**Checkpoint**: Backend translation API running and returning Urdu text ✅

---

## Phase 3: User Story 1 — Auth-Gated Button (Priority: P1) 🎯 MVP

**Goal**: Button visible only to logged-in users at top of each chapter.

**Independent Test**: Log in → see button. Log out → no button. ✅

- [x] T009 Create `src/components/UrduTranslationButton.tsx` with `useAuth()` guard (`DEBUG_MODE = false`)
- [x] T010 Create `src/components/TranslationWrapper.tsx` rendering button in header div
- [x] T011 Swizzle `src/theme/DocItem/index.tsx` to wrap `<DocItem>` in `<TranslationWrapper chapterId={...}>`
- [x] T012 Add Urdu button CSS to `src/css/custom.css` (`.urdu-translation-button`, spinner, active/loading states)

**Checkpoint**: Button appears for logged-in users only, at top of every chapter ✅

---

## Phase 4: User Story 2 — Translate Chapter Content (Priority: P1)

**Goal**: Clicking "اردو" translates all prose text to Urdu, skips code/SVG, switches layout to RTL.

**Independent Test**: Click "اردو" → Urdu text appears, code stays English, layout is RTL. ✅

- [x] T013 Implement `translateHtmlString()` in `TranslationWrapper.tsx`:
  - DOMParser parse into temp doc
  - `fixDiagramTextColors()` to force SVG text black
  - TreeWalker to collect translatable text nodes (skip SVG, CODE, PRE, SCRIPT, STYLE)
  - Batch translate via `translateTexts()`
  - Return `doc.body.innerHTML`
- [x] T014 Add `useEffect([isUrdu])` in `TranslationWrapper` to trigger `translateHtmlString` when switching to Urdu
- [x] T015 Add `useEffect()` (no deps) to capture `contentRef.current.innerHTML` into `originalHtmlRef` on first render
- [x] T016 Conditionally render `<div dangerouslySetInnerHTML={{ __html: translatedHtml }} />` vs `<div ref={contentRef}>{children}</div>`
- [x] T017 Add `dir="rtl"` and `lang="ur"` to wrapper div when `isUrdu`
- [x] T018 Add loading overlay with spinner during translation
- [x] T019 Add RTL-specific CSS to `src/css/custom.css` (`.translation-wrapper--urdu`)

**Checkpoint**: Chapter text translates to Urdu, code blocks stay English, RTL layout works ✅

---

## Phase 5: User Story 3 — Switch Back to English (Priority: P2)

**Goal**: Instant English restore from saved ref, cache preserved for re-use.

**Independent Test**: Translate → click English → instant restore. Translate again → instant from cache. ✅

- [x] T020 When `isUrdu` becomes false, render `{children}` (React re-renders English DOM automatically — no restore needed)
- [x] T021 Preserve `translatedHtml` in state so re-toggle is instant (cache check in `useEffect([isUrdu, translatedHtml])`)
- [x] T022 Add `useEffect([chapterId])` to reset `originalHtmlRef` and `translatedHtml` on chapter navigation

**Checkpoint**: English toggle is instantaneous; re-toggling Urdu uses cached HTML ✅

---

## Phase 6: User Story 4 — Fast Batch Translation (Priority: P2)

**Goal**: Translation completes in under 10 seconds via parallel batch calls.

**Independent Test**: Translate any chapter → completes < 10 seconds. ✅

- [x] T023 Migrate from individual `translateText()` calls to batch `translateTexts()` in `TranslationWrapper`
- [x] T024 Implement parallel chunking in `TranslationWrapper`: split text nodes into groups of 50, `Promise.all()` across chunks
- [x] T025 Add per-node cache in `translationService.ts`: check cache before sending to API, write back after response

**Checkpoint**: Chapter translation completes in ~5-8 seconds ✅

---

## Phase 7: Mermaid Diagram Text Color (Cross-cutting)

**Goal**: Diagram node/edge labels are black and readable in both English and Urdu modes, all themes.

- [x] T026 Diagnose root cause: Docusaurus Mermaid renders SVG via `dangerouslySetInnerHTML` → SVG gets `id="mermaid-svg-0"`, no `.mermaid` class on any parent → all previous `.mermaid` CSS rules never matched
- [x] T027 Replace all `.mermaid` CSS selectors with `[id^="mermaid"]` attribute selectors in `src/css/custom.css`:
  - `[id^="mermaid"] text, [id^="mermaid"] tspan { fill: #000 !important }`
  - `[id^="mermaid"] foreignObject span/p/div { color: #000 !important }`
  - `[id^="mermaid"] .nodeLabel, .edgeLabel { color: #000 !important }`
- [x] T028 Add `fixDiagramTextColors()` JS function in `TranslationWrapper.tsx` to handle translated view:
  - Remove `fill` SVG presentation attributes from `svg text`
  - Set `style.fill` inline on SVG text elements
  - Set `style.color` inline on `foreignObject` HTML content
  - Target `.edgeLabel`, `.nodeLabel`, `.cluster-label` class elements

**Checkpoint**: Diagram labels black in English mode AND Urdu mode, light AND dark themes ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1
- **Phase 3 (US1 — Button)**: Depends on Phase 2
- **Phase 4 (US2 — Translate)**: Depends on Phase 3 (needs wrapper structure)
- **Phase 5 (US3 — English toggle)**: Depends on Phase 4
- **Phase 6 (US4 — Performance)**: Depends on Phase 4 (replaces naive approach)
- **Phase 7 (Mermaid)**: Independent — can be done any time after Phase 1

### Parallel Opportunities

- T005, T006, T007, T008 can run in parallel (all backend, different functions)
- T009, T012 can run in parallel (button component + CSS)
- T026, T027 can run in parallel with any Phase 3-6 work

---

## Implementation Notes

- `DEBUG_MODE` in `UrduTranslationButton.tsx` MUST remain `false` in production
- `originalHtmlRef` captures HTML BEFORE Mermaid re-renders — if Mermaid is slow to initialize, the capture may miss the SVG. Mitigation: `fixDiagramTextColors()` handles both pre- and post-render SVG content
- OpenAI GPT-4o-mini numbered-list response parsing uses `. ` split on first occurrence to handle translations that themselves contain periods
- `translationCache` in `translationService.ts` is module-level (persists across navigations within session)
