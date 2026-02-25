# Feature Specification: Urdu Translation

**Feature Branch**: `003-auth-jwt`
**Created**: 2026-02-25
**Status**: Implemented
**Feature ID**: 005-urdu-translation

---

## User Scenarios & Testing

### User Story 1 — Auth-Gated Translation Button (Priority: P1)

A logged-in user navigates to any book chapter and sees an "اردو" button at the top of the page. A logged-out visitor does NOT see the button.

**Why this priority**: Core feature gate — translation must only be accessible to registered users to encourage sign-up.

**Independent Test**: Log in → navigate to any chapter → verify "🇵🇰 اردو" button appears. Log out → verify button is gone.

**Acceptance Scenarios**:

1. **Given** a logged-out user, **When** they visit a chapter page, **Then** the translation button is not rendered.
2. **Given** a logged-in user, **When** they visit a chapter page, **Then** a "🇵🇰 اردو" button appears at the top of the content area.
3. **Given** a logged-in user viewing the button, **When** they are on any chapter, **Then** the button is consistent across all chapters.

---

### User Story 2 — Translate Chapter Content to Urdu (Priority: P1)

A logged-in user clicks the "اردو" button and the entire chapter text is translated to Urdu with RTL layout. Code blocks and diagram labels remain in English.

**Why this priority**: The primary value of the feature — without this, the button is meaningless.

**Independent Test**: Click "اردو" → verify prose text becomes Urdu script → verify `<code>` blocks remain English → verify layout switches to RTL.

**Acceptance Scenarios**:

1. **Given** a logged-in user on a chapter, **When** they click "اردو", **Then** a loading spinner shows and text is translated to Urdu within ~5-10 seconds.
2. **Given** translation in progress, **When** complete, **Then** all paragraph text, headings, and list items appear in Urdu Nastaliq script.
3. **Given** translated content, **When** viewing code blocks (`<code>`, `<pre>`), **Then** code remains in English (not translated).
4. **Given** translated content, **When** viewing Mermaid diagrams, **Then** diagram node/edge labels remain in English and are black/visible.
5. **Given** translated page, **When** layout is applied, **Then** text flows right-to-left with correct Urdu rendering.

---

### User Story 3 — Switch Back to English (Priority: P2)

A user who has translated a chapter can switch back to English instantly without a page reload.

**Why this priority**: Essential UX — users need to compare or return to English.

**Independent Test**: Translate a chapter → click "🇬🇧 English" → verify original English content is restored instantly (no API call).

**Acceptance Scenarios**:

1. **Given** a translated chapter, **When** the user clicks "🇬🇧 English", **Then** original English content is restored immediately.
2. **Given** restored English content, **When** user clicks "اردو" again, **Then** translation appears instantly (from cache, no new API call).
3. **Given** a user who navigates to a different chapter, **When** they return to the translated chapter, **Then** the cache is cleared and a fresh translation is requested.

---

### User Story 4 — Fast Batch Translation (Priority: P2)

Translation of a full chapter completes in under 10 seconds using parallel batch API calls.

**Why this priority**: Without fast translation, the feature is unusable in practice.

**Independent Test**: Click "اردو" on any chapter → verify translation completes in under 10 seconds.

**Acceptance Scenarios**:

1. **Given** a chapter with 100+ text nodes, **When** user clicks "اردو", **Then** all text is sent in parallel batches of 50 to OpenAI, completing in ~5-8 seconds.
2. **Given** repeated visits to the same chapter, **When** user clicks "اردو" again after switching back, **Then** cached translation is shown instantly (0 API calls).

---

### Edge Cases

- What happens when the OpenAI API is unavailable? → Original English text is preserved (no error shown to user, silent fallback).
- What happens when a chapter has no text nodes? → Button still shows but translation is instantaneous (nothing to translate).
- What happens with very long chapters (300+ nodes)? → Batched into groups of 50, processed in parallel, each batch independent.
- What happens if the user is authenticated but JWT expires mid-session? → Button disappears on next render; content reverts to English.
- What happens with Mermaid diagrams? → SVG content is skipped from translation; diagram labels remain English and forced to black color.

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST show the translation button ONLY to authenticated users (via BetterAuth session).
- **FR-002**: System MUST translate all paragraph text, headings, and list items to Urdu using OpenAI GPT-4o-mini.
- **FR-003**: System MUST preserve `<code>`, `<pre>`, SVG, and `<foreignObject>` content untranslated.
- **FR-004**: System MUST switch page layout to RTL (`dir="rtl"`, `lang="ur"`) when in Urdu mode.
- **FR-005**: System MUST restore original English content instantly when user switches back (from saved HTML ref).
- **FR-006**: System MUST cache translations per chapter per session to avoid redundant API calls.
- **FR-007**: System MUST send text nodes in parallel batches of 50 to the backend translation API.
- **FR-008**: Backend MUST expose `POST /api/v1/translation/translate-batch` accepting a list of strings.
- **FR-009**: Backend MUST use OpenAI GPT-4o-mini with a system prompt that preserves technical terms, code, and numbers in English.
- **FR-010**: Mermaid diagram text MUST be visually black in both English and Urdu modes across all themes.

### Key Entities

- **TranslationContext**: React context holding `currentLanguage`, `toggleLanguage`, `setLanguage`.
- **TranslationWrapper**: React component wrapping each DocItem; owns the capture → translate → display lifecycle.
- **UrduTranslationButton**: Auth-gated toggle button rendered at top of each chapter.
- **translationService**: Frontend module exposing `translateTexts()` (batch) and `translateText()` (single).
- **translation.py**: FastAPI service using OpenAI client for batch translation.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Translation button visible to 100% of logged-in users, 0% of logged-out users.
- **SC-002**: Chapter translation completes in under 10 seconds for chapters with up to 200 text nodes.
- **SC-003**: Switching back to English is instantaneous (< 100ms, no API call).
- **SC-004**: Code blocks remain English in 100% of translations.
- **SC-005**: Mermaid diagram labels are black and readable in both English and Urdu mode across light and dark themes.
- **SC-006**: Cache hit on repeated Urdu toggle is instantaneous (0 API calls after first translation).
