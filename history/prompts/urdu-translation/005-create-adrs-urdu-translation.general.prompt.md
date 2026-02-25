---
id: 005
title: Create ADRs Urdu Translation Architecture
stage: general
date: 2026-02-25
surface: agent
model: claude-sonnet-4-6
feature: urdu-translation
branch: 003-auth-jwt
user: User
command: /sp.adr urdu-translation-architecture
labels: ["adr","architecture","urdu-translation","react","openai"]
links:
  spec: specs/005-urdu-translation/spec.md
  ticket: null
  adr: history/adr/003-react-dom-translation-strategy.md
  pr: null
files:
  - history/adr/003-react-dom-translation-strategy.md
  - history/adr/004-translation-provider-and-performance.md
tests:
  - null
---

## Prompt

`/sp.adr urdu-translation-architecture`

## Response snapshot

Loaded specs/005-urdu-translation/plan.md. Extracted 4 decisions, clustered into 2 ADR-worthy groups. Decision 4 (Mermaid CSS selector) failed significance test (narrow bug fix, no meaningful alternatives). Created:

- ADR-003: React DOM Translation Strategy — dangerouslySetInnerHTML + DOMParser isolation + TreeWalker traversal. Documents why direct DOM mutation fails (React reconciler overwrites), and why i18n/state-managed content were rejected.
- ADR-004: Translation Provider and Performance — OpenAI GPT-4o-mini + parallel batch chunks of 50. Documents Argos rejection (poor quality), sequential calls rejection (too slow), and chunking rationale (token limit safety + parallel speedup).

## Outcome

- ✅ Impact: Permanent architectural record for both cross-cutting decisions
- 🧪 Tests: N/A
- 📁 Files: 2 ADRs created (003, 004)
- 🔁 Next prompts: /sp.git.commit_pr to commit all urdu-translation work
- 🧠 Reflection: Both ADRs document real failures that were discovered during implementation — valuable for future engineers working on similar translation features in React/Docusaurus

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Both ADRs passed all 3 significance tests
- Prompt variant (if applicable): none
- Next experiment: n/a
