---
id: 011
title: Create Chapter 2 OpenVLA Models
stage: explainer
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-physical-ai-book-site
branch: 001-physical-ai-book-site
user: User
command: none
labels: [openvla, vla, robotics, foundation-models]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - docs/module-4-vla/openvla-models.md
tests:
 - none
---

## Prompt

Research and write a comprehensive educational chapter for a Physical AI book titled "Chapter 2: OpenVLA and Open-Source Foundation Models".

Focus on:
- The importance of open-source in robotic AI: Comparison with closed-sourced models like RT-2.
- Technical architecture: Using the Prismatic VLM framework and Llama-based backbones.
- Training efficiency: Low-rank adaptation (LoRA) and fine-tuning on the Open X-Embodiment dataset.
- Practical Example: A Python snippet showing how to use the `transformers` library to load an OpenVLA model and process an image/instruction pair.
- Educational diagrams showing the fine-tuning and inference pipeline.
- Learning objectives and 3-5 assessment questions.

SAVE THE FILE TO: docs/module-4-vla/openvla-models.md

IMPORTANT:
- DO NOT mention Docusaurus or technical deployment.
- ID: 'openvla-models', title: 'OpenVLA and Open-Source Models', sidebar_position: 2.
- You MUST use the Write tool to finalize the file in the filesystem.

## Response snapshot

I have created the comprehensive chapter on OpenVLA and open-source foundation models. The content covers the technical architecture (Prismatic VLM, Llama 2 7B), training efficiency (LoRA), and the significance of the Open X-Embodiment dataset. It includes Mermaid diagrams for the architecture and fine-tuning pipelines, along with a practical Python code example using the `transformers` library. The file is saved at `docs/module-4-vla/openvla-models.md` with the required metadata.

## Outcome

- ✅ Impact: Created technical documentation for OpenVLA foundation models.
- 🧪 Tests: none
- 📁 Files: docs/module-4-vla/openvla-models.md
- 🔁 Next prompts: none
- 🧠 Reflection: Successfully synthesized research from the OpenVLA project site and GitHub to create educational content.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): none
