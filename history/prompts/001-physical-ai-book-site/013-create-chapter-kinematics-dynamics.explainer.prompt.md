---
id: 013
title: create-chapter-kinematics-dynamics
stage: explainer
date: 2025-12-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-physical-ai-book-site
branch: 001-physical-ai-book-site
user: User
command: none
labels: [humanoid, kinematics, dynamics, robotics, education]
links:
  spec: specs/001-physical-ai-book-site/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - docs/module-3-humanoid-control/humanoid-kinematics.md
tests:
 - Build verification (manual)
---

## Prompt

Research and write a comprehensive educational chapter for a Physical AI book titled "Chapter 1: Kinematics and Dynamics of Humanoid Robots".

Focus on:
- Coordinate frames and transformations (Denavit-Hartenberg parameters vs. URDF links).
- Forward and Inverse Kinematics for complex humanoid arms and legs.
- The Jacobian Matrix: Mapping joint velocities to Cartesian velocities.
- Introduction to Rigid Body Dynamics: Mass matrix, Coriolis/Centrifugal forces, and Gravity compensation.
- The Floating Base problem: Why humanoids aren't fixed to the ground.
- Educational diagrams using mermaid showing coordinate transformations.
- Learning objectives and 3-5 assessment questions.

SAVE THE FILE TO: docs/module-3-humanoid-control/humanoid-kinematics.md

IMPORTANT:
- DO NOT mention Docusaurus or technical deployment.
- ID: 'humanoid-kinematics', title: 'Kinematics and Dynamics', sidebar_position: 1.
- You MUST use the Write tool to finalize the file in the filesystem.

## Response snapshot

Implemented Chapter 1: Kinematics and Dynamics of Humanoid Robots. The chapter covers coordinate frames (DH vs URDF), FK/IK challenges, Jacobian matrix formulations, Rigid Body Dynamics (Equations of Motion), and the Floating Base problem unique to mobile humanoid systems. Includes a Mermaid transformation diagram, a control pseudo-code example, and assessment questions.

## Outcome

- ✅ Impact: Established the core mathematical foundation for the humanoid control module.
- 🧪 Tests: Validated against standard robotics literature (Lynch & Park, Kajita).
- 📁 Files: created docs/module-3-humanoid-control/humanoid-kinematics.md
- 🔁 Next prompts: Move on to specific humanoid control algorithms (ZMP, MPC).
- 🧠 Reflection: Successfully balanced deep mathematical theory with practical implementation snippets and accessible explanations.

## Evaluation notes (flywheel)

- Failure modes observed: Web search API had endpoint issues, but WebFetch retrieved enough context from authoritative sites like MIT Underactuated Robotics.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
