# ADR-004: Translation Provider and Batch Performance Strategy

> **Scope**: Documents the choice of translation provider (OpenAI GPT-4o-mini) and the parallel batch chunking strategy for translating full chapters within an acceptable latency budget. Groups: provider selection, API design, chunking algorithm, caching strategy.

- **Status:** Accepted
- **Date:** 2026-02-25
- **Feature:** 005-urdu-translation

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? ✅ Provider choice affects cost, quality, and offline capability for all future translation work
     2) Alternatives: Multiple viable options considered with tradeoffs? ✅ Four alternatives evaluated
     3) Scope: Cross-cutting concern (not an isolated detail)? ✅ Affects backend service, API contract, frontend service, cost model -->

- **Context:** The translation feature must translate 50–200 text nodes per chapter with acceptable UX latency (< 10 seconds). The project already has an OpenAI API key in its `.env`. The initial implementation used Argos Translate (offline, free) but it produced poor-quality Urdu and required a large model download. A naive sequential API call approach (one call per text node) was also considered but produces 1–3 minute wait times, making the feature unusable.

## Decision

**Provider**: OpenAI `gpt-4o-mini` via the existing `OPENAI_API_KEY` in `backend/config.py`.

**System prompt strategy**: A role-based system prompt instructs GPT-4o-mini to:
1. Translate the numbered list to Urdu (Nastaliq script)
2. Preserve technical terms, code, numbers, URLs, and proper nouns in English
3. Return ONLY the numbered list — no explanations

**API design**: New endpoint `POST /api/v1/translation/translate-batch` accepts `{"texts": [...], "target_language": "ur"}` and returns `{"translated_texts": [...]}`. Numbered-list format (`1. text\n2. text`) used for the OpenAI prompt/response to handle multi-item translation in one completion.

**Chunking strategy**: Text nodes are split into groups of 50 and translated in parallel via `Promise.all()` on the frontend:
```
200 nodes → 4 chunks of 50 → Promise.all([chunk1, chunk2, chunk3, chunk4])
~5-8 seconds total vs ~1-3 minutes sequential
```

**Caching**: Module-level `Map<string, string>` in `translationService.ts` caches translations by `targetLang:text.slice(0,100)` key. Cache persists across chapter navigations within the session. Cache is checked before batching — already-cached nodes are excluded from API calls.

## Consequences

### Positive

- High-quality Urdu translation — GPT-4o-mini significantly outperforms Argos for en→ur
- Zero setup friction — uses `OPENAI_API_KEY` already in `.env`, no model downloads
- Technical term preservation — system prompt explicitly guards code, numbers, URLs
- ~5-8 second UX for a full chapter (acceptable for a manual-trigger action)
- Cache hit on re-toggle is instantaneous (0 API calls)
- Graceful degradation — on OpenAI failure, original English texts returned silently

### Negative

- Per-use cost — ~$0.01/chapter translation (GPT-4o-mini input/output tokens). Acceptable at hackathon scale; would need budget controls at production scale
- Requires internet + backend running — no offline capability
- Numbered-list parsing is brittle if GPT-4o-mini returns malformed output — mitigated by fallback to original text per node
- Token limits — a chunk of 50 long paragraphs could approach GPT-4o-mini's context window; mitigated by 50-node chunk size limit

## Alternatives Considered

### Alternative A: Argos Translate (Offline, Free)

Self-hosted offline ML translation using `argostranslate` Python library.

**Rejected because**:
- en→ur Argos model quality was noticeably poor for technical content
- Requires downloading a large language model (`python -m scripts.install_translation_models`)
- Model may not be available in all deployment environments
- Slow first translation (5-10 seconds for model load)

### Alternative B: Sequential Single API Calls (One call per text node)

Call `POST /api/v1/translation/translate` once per text node.

**Rejected because**: 50–200 calls × ~1 second each = 50–200 second wait. Functionally unusable.

### Alternative C: One Massive Batch (All Nodes in One Call)

Send all 200 text nodes in a single OpenAI API call.

**Partially rejected**: OpenAI GPT-4o-mini has a max output token limit. A chapter with 200 long paragraphs could overflow the context window and truncate the response. Chunking to 50 nodes keeps each call well within limits. Also, single-call failure loses all translations vs chunked approach where only one chunk fails.

### Alternative D: Google Cloud Translation API / DeepL

Third-party translation APIs with high quality.

**Rejected because**: Would require new API keys not present in the project. OpenAI is already integrated. For a hackathon, adding a new vendor dependency is not justified.

### Alternative E: Docusaurus i18n with Pre-translated MDX

Pre-translate all 13 chapters offline, commit Urdu MDX files, use Docusaurus locale routing.

**Rejected because**:
- No dynamic translation — static files only
- URL-based locale switch, not a button toggle
- Cannot enforce "logged-in users only"
- 13 chapters × full manual Urdu translation = significant upfront effort

## References

- Feature Spec: `specs/005-urdu-translation/spec.md`
- Implementation Plan: `specs/005-urdu-translation/plan.md`
- Key files: `backend/services/translation.py`, `src/services/translationService.ts`
- Related ADRs: ADR-002 (RAG pipeline — same OpenAI key used), ADR-003 (React DOM Translation Strategy)
- PHR: `history/prompts/urdu-translation/003-switch-translation-to-openai.green.prompt.md`
