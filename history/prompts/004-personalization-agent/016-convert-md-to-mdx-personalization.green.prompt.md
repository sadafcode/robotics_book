---
id: 016
title: Convert MD to MDX for Personalization Context
stage: green
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: 004-personalization-agent
branch: 003-auth-jwt
user: user
command: resume personalization mdx conversion
labels: ["personalization","mdx","content-section","docs","adaptive-content"]
links:
  spec: specs/004-personalization-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - docs/module-3-humanoid-control/balance-wbc.mdx
  - docs/module-4-vla/vla-introduction.mdx
  - docs/module-4-vla/openvla-models.mdx
  - docs/module-4-vla/vla-future.mdx
  - docs/module-2-simulation/isaac-sim.mdx
tests:
  - "Build: npm run build → SUCCESS (0 errors)"
---

## Prompt

hum .md files ko .mdx may convert ker rahey thay taakey personalization kay hisab say context change ho

## Response snapshot

Resumed the .md → .mdx conversion task. Found that 9 files were already converted in a prior session and 4 were missing:

**Missing files created:**
- `docs/module-3-humanoid-control/balance-wbc.mdx` — WBC content split into non_technical/beginner (analogies) + intermediate/professional (QP math, C++ code)
- `docs/module-4-vla/vla-introduction.mdx` — VLA intro split by level; code example in intermediate/professional only
- `docs/module-4-vla/openvla-models.mdx` — Model comparison table visible to all; implementation code in intermediate/professional
- `docs/module-4-vla/vla-future.mdx` — Future trends split; warning admonition in intermediate/professional

**Bug fixed:**
- `docs/module-2-simulation/isaac-sim.mdx` line 136: `levels=['intermediate'` → `levels={['intermediate'` (missing curly brace)

**Build result:** ✅ SUCCESS — all 13 .mdx files compile cleanly.

## Outcome

- All docs now use `<ContentSection levels={[...]}>` for adaptive content delivery
- Non-technical/beginner content uses analogies and simple language
- Intermediate/professional content uses full technical details, math, and code
- Build passes with zero errors
