# Implementation Plan: 005 — Urdu Translation

**Branch**: `003-auth-jwt` | **Date**: 2026-02-25 | **Spec**: `specs/005-urdu-translation/spec.md`

---

## Summary

Logged-in users can translate any book chapter to Urdu by pressing a button at the top of the page. The system captures the rendered HTML, sends all text nodes in parallel batches to an OpenAI GPT-4o-mini backend, and renders translated content via `dangerouslySetInnerHTML` to bypass React's reconciler. Code blocks and SVG diagrams are skipped. Switching back to English restores the original content from a saved ref (no API call).

---

## Technical Context

**Language/Version**: TypeScript (React 18), Python 3.11
**Primary Dependencies**: Docusaurus 3.x, FastAPI, OpenAI SDK, BetterAuth
**Storage**: In-memory Map cache (session-scoped, cleared on chapter navigation)
**Testing**: Manual browser testing
**Target Platform**: Browser (client-side translation trigger), Server (FastAPI backend)
**Performance Goals**: Full chapter translation < 10 seconds; cache hit < 100ms
**Constraints**: Must not break React reconciliation; must skip SVG/code content; must be auth-gated
**Scale/Scope**: 13 book chapters, ~50-200 text nodes per chapter

---

## Constitution Check

- ✅ Smallest viable diff — no new frameworks, uses existing OpenAI key and FastAPI
- ✅ Auth gate via existing BetterAuth `useAuth()` hook
- ✅ No secrets hardcoded — uses `settings.OPENAI_API_KEY` from pydantic-settings
- ✅ No unrelated refactors

---

## Project Structure

```text
specs/005-urdu-translation/
├── spec.md       ✅
├── plan.md       ✅ (this file)
└── tasks.md      ✅

Frontend:
src/
├── components/
│   ├── UrduTranslationButton.tsx   # Auth-gated toggle button
│   └── TranslationWrapper.tsx      # Capture → translate → display lifecycle
├── context/
│   └── TranslationContext.tsx      # currentLanguage state + toggleLanguage
├── services/
│   └── translationService.ts       # translateTexts() batch API client
└── theme/
    ├── Root.tsx                     # TranslationProvider injected here
    └── DocItem/index.tsx            # TranslationWrapper wraps DocItem

Backend:
backend/
└── services/
    └── translation.py              # OpenAI GPT-4o-mini batch translation
backend/main.py                     # POST /api/v1/translation/translate-batch

Styles:
src/css/custom.css                  # Mermaid text color fix + RTL wrapper styles
```

---

## Key Architectural Decisions

### Decision 1: `dangerouslySetInnerHTML` for Translated Content

**Problem**: React's reconciler overwrites direct DOM mutations (text node changes) on every re-render triggered by state changes (e.g., `setIsTranslating(true)`).

**Options considered**:
- DOM mutation (TreeWalker + textContent) → Broken by React re-renders
- `dangerouslySetInnerHTML` → React no longer owns the DOM subtree → ✅ chosen
- Docusaurus i18n → URL-based routing, requires pre-translated MDX files, no auth gate → ✗ rejected

**Approach**: Capture `innerHTML` of the English-rendered `{children}` div once. Parse it with `DOMParser` into a temporary document. Walk text nodes, batch-translate, get back translated HTML string. Conditionally render `dangerouslySetInnerHTML` when in Urdu mode.

---

### Decision 2: OpenAI GPT-4o-mini over Argos Translate

**Problem**: Argos Translate en→ur model quality was poor and required a large model download.

**Options considered**:
- Argos Translate (offline, free) → Poor quality, model setup fragile → ✗ rejected
- Docusaurus i18n → Static, no dynamic button, no auth gate → ✗ rejected
- OpenAI GPT-4o-mini → High quality, existing API key in project, ~$0.01/chapter → ✅ chosen

---

### Decision 3: Parallel Batch Translation (chunks of 50)

**Problem**: A chapter has 50-200+ text nodes. Translating one by one = 50-200 API calls = 1-3 minutes.

**Options considered**:
- Sequential single calls → Too slow → ✗ rejected
- One massive batch (all nodes) → OpenAI token limit risk, harder to parse response → ✗ partial
- Parallel chunks of 50 → ~4 parallel calls, ~5-8 seconds total → ✅ chosen

**Implementation**: Collect all text nodes → split into 50-node chunks → `Promise.all()` → flat map responses.

---

### Decision 4: SVG Text Color Fixed via CSS `[id^="mermaid"]` Selector

**Problem**: Docusaurus Mermaid plugin renders SVG via `dangerouslySetInnerHTML` with no `.mermaid` class on any parent. All existing `.mermaid text` CSS rules never matched.

**Fix**: Use `[id^="mermaid"] text` and `[id^="mermaid"] foreignObject *` selectors which target the SVG's generated ID directly.

**Additionally**: `fixDiagramTextColors()` in JS removes SVG `fill` presentation attributes and sets inline `style.fill/#color` on the captured HTML before translation, ensuring color is embedded regardless of CSS.

---

## API Contract

### POST `/api/v1/translation/translate-batch`

**Request**:
```json
{
  "texts": ["Hello world", "Physical AI is..."],
  "target_language": "ur"
}
```

**Response**:
```json
{
  "translated_texts": ["ہیلو ورلڈ", "فزیکل اے آئی ہے..."],
  "target_language": "ur"
}
```

**Error**: On OpenAI failure, returns original texts (no error thrown to client).

### GET `/api/v1/translation/status`

**Response**:
```json
{
  "available": true,
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

---

## Data Flow

```
User clicks "اردو"
    │
    ▼
toggleLanguage() → currentLanguage = 'ur'
    │
    ▼
TranslationWrapper useEffect [isUrdu=true]
    │
    ├─ originalHtmlRef.current already set? No → capture contentRef.current.innerHTML
    │
    ▼
translateHtmlString(html)
    ├─ DOMParser → parse into temp doc
    ├─ fixDiagramTextColors() → force SVG text black
    ├─ TreeWalker → collect text nodes (skip SVG, CODE, PRE)
    ├─ Split into chunks of 50
    ├─ Promise.all → POST /api/v1/translation/translate-batch (×N parallel)
    ├─ Apply translations to temp doc text nodes
    └─ return doc.body.innerHTML
    │
    ▼
setTranslatedHtml(urduHtml) → re-render
    │
    ▼
<div dangerouslySetInnerHTML={{ __html: urduHtml }} />
    (dir="rtl", lang="ur" on wrapper)

User clicks "English"
    │
    ▼
toggleLanguage() → currentLanguage = 'en'
    │
    ▼
Render {children} (React-owned DOM, no API call)
```
