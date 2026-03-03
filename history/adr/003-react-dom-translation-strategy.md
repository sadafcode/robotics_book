# ADR-003: React DOM Translation Strategy for Urdu Content

> **Scope**: Documents the architectural approach for rendering translated content in a Docusaurus React application without breaking React's reconciliation model. Groups: HTML capture strategy, DOMParser isolation, `dangerouslySetInnerHTML` rendering, and TreeWalker traversal.

- **Status:** Accepted
- **Date:** 2026-02-25
- **Feature:** 005-urdu-translation

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? ✅ Any future translation or content-swap feature in this Docusaurus app must use this same pattern
     2) Alternatives: Multiple viable options considered with tradeoffs? ✅ Three approaches evaluated
     3) Scope: Cross-cutting concern (not an isolated detail)? ✅ Affects TranslationWrapper, DocItem swizzle, Root.tsx, TranslationContext -->

- **Context:** The Docusaurus site renders chapter content as React components from MDX files. A logged-in user must be able to toggle the entire chapter text to Urdu and back to English. The challenge is that React's virtual DOM reconciler actively manages the DOM subtree that renders chapter content (`<DocItem>`). Any direct DOM mutation (changing text node content via `textContent`) is overwritten when React triggers a re-render — which happens on every state update (e.g., `setIsTranslating(true)`). The solution must work within React's rendering model, not against it.

## Decision

The translation rendering pipeline is built on four integrated components:

- **HTML Capture**: On first render, `contentRef.current.innerHTML` is saved into `originalHtmlRef` (a ref, not state — prevents re-renders). Captured once per chapter navigation.
- **Isolation via DOMParser**: Translation operates on a cloned document (`new DOMParser().parseFromString(html, 'text/html')`) — completely detached from the live React DOM. Mutations to this temp document have zero effect on the rendered page.
- **TreeWalker Traversal**: `document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT)` collects all translatable text nodes. Nodes inside `svg`, `code`, `pre`, `script`, `style` are skipped via `isInsideSkippedTag()`.
- **`dangerouslySetInnerHTML` for Urdu mode**: When `translatedHtml` state is set, the component conditionally renders `<div dangerouslySetInnerHTML={{ __html: translatedHtml }} />` instead of `{children}`. React no longer reconciles the translated DOM subtree — it treats it as opaque HTML.

**Switching back to English**: Simply renders `{children}` again. React re-renders the English virtual DOM from scratch. No restore logic needed.

## Consequences

### Positive

- React reconciliation is never broken — translated content is fully owned by `dangerouslySetInnerHTML`, original content is fully owned by React
- Instant English restore — switching back re-renders React's virtual DOM (no API call, no ref restoration)
- Cached re-toggle — `translatedHtml` state persists in the component; second Urdu toggle is instantaneous
- Chapter isolation — `useEffect([chapterId])` clears `originalHtmlRef` and `translatedHtml` on navigation, preventing stale content
- Works with any content complexity — Mermaid SVGs, admonitions, code blocks all preserved in the captured HTML

### Negative

- `dangerouslySetInnerHTML` bypasses React's XSS protection — the HTML source is the site's own rendered output (trusted), not user input, so risk is acceptable
- React event handlers attached to children (e.g., interactive components) stop working in Urdu mode — the `dangerouslySetInnerHTML` div is static HTML
- If Mermaid renders AFTER `originalHtmlRef` is captured, the saved HTML may contain the pre-render placeholder — mitigated by `fixDiagramTextColors()` being a no-op on non-SVG content
- Content capture timing depends on React render lifecycle — `useEffect()` (no deps) runs after every render but only saves once (`!originalHtmlRef.current` guard), which means capture happens after first paint

## Alternatives Considered

### Alternative A: Direct DOM Mutation (TreeWalker on live DOM)

Walk text nodes in `contentRef.current` directly and set `textNode.textContent = translated`.

**Rejected because**: React's reconciler overwrites DOM mutations on the next re-render. `setIsTranslating(true)` alone triggers a re-render that restores English text, undoing all translations. This was the initial implementation and caused the translation to silently fail.

### Alternative B: Docusaurus i18n (Built-in Internationalization)

Use Docusaurus's `i18n` config with an `ur` locale and pre-translated MDX files in `i18n/ur/docusaurus-plugin-content-docs/`.

**Rejected because**:
- URL-based routing (`/ur/docs/intro`) — no button toggle, no auth gate
- Requires manually pre-translating all 13 chapters into Urdu MDX files
- Does not support the "logged-in users only" requirement
- Static — cannot use OpenAI for dynamic translation

### Alternative C: React State-Managed Content Replacement

Store the full chapter text in React state as a string, replace it with translated text, render as Markdown.

**Rejected because**: Docusaurus MDX content is already-rendered React components — converting back to raw Markdown string would lose all formatting, code highlighting, Mermaid diagrams, and interactive elements. No clean extraction path.

## References

- Feature Spec: `specs/005-urdu-translation/spec.md`
- Implementation Plan: `specs/005-urdu-translation/plan.md`
- Key file: `src/components/TranslationWrapper.tsx`
- Related ADRs: ADR-001 (Agent orchestration), ADR-002 (RAG pipeline)
- PHR: `history/prompts/urdu-translation/002-fix-auth-guard-and-dom-translation.green.prompt.md`
