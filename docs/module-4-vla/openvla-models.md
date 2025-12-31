---
title: "The Pantheon of VLAs: OpenVLA, RT-2, and PaLM-E"
description: "A deep dive into the architectures of dominant VLA models from 2024-2025."
sidebar_position: 2
keywords: [OpenVLA, RT-2, PaLM-E, RT-1, Robotics Transformer, Architecture]
---

# The Pantheon of VLAs: OpenVLA, RT-2, and PaLM-E

To build a general-purpose robot, we must understand the "lineage" of its brain. Between 2023 and 2025, a series of breakthrough models redefined what is possible in embodied AI.

## 1. RT-1: The Founding Father (2022-2023)

Google DeepMind's **Robotics Transformer 1 (RT-1)** was one of the first large-scale applications of transformers to robot control.

*   **Architecture:** A FiLM-conditioned EfficientNet visual encoder coupled with a standard Transformer.
*   **Key Innovation:** It demonstrated that large-scale data collection (130k episodes) could lead to robust performance across many tasks.
*   **Limitation:** It lacked the deep semantic reasoning of a Large Language Model (LLM).

## 2. PaLM-E: The Embodied LLM (2023)

**PaLM-E** was a massive leap: it directly injected visual and sensor data into the **PaLM** language model.

*   **The Concept:** Treat sensor data as "multimodal sentences."
*   **Architecture:**
    *   **Vision:** ViT-22B (Vision Transformer).
    *   **Reasoning:** PaLM-540B.
*   **Breakthrough:** It showed that a model trained on text and images could perform robotic tasks *better* by leveraging its broad world knowledge.

## 3. RT-2: Vision-Language-Action (2023-2024)

**RT-2** introduced the term "VLA." It simplified the pipeline by using **Action Tokenization**.

```mermaid
graph TD
    subgraph "Input Processing"
        V[Camera Image] --> VE[ViT Encoder]
        L[Text Instruction] --> PE[Positional Embeddings]
    end

    subgraph "VLA Core (PaLM-E or PaLI-X)"
        VE --> T[Transformer Blocks]
        PE --> T
    end

    subgraph "Output Space"
        T --> AT[Action Tokens]
        AT --> D[De-tokenization]
        D --> R[6-DOF Control]
    end

    style V fill:#00d2ff
    style L fill:#00d2ff
    style AT fill:#ff00ea,color:#fff
```

## 4. OpenVLA: The 2024-2025 Standard

**OpenVLA** (Stanford, Berkeley, TRI) represents the current pinnacle of accessible, high-performance VLA research. It is designed to be the "Llama for Robotics."

### OpenVLA Architecture Deep Dive

OpenVLA is built on the **Prismatic VLM** framework. It fuses two visual backbones to capture both semantic and spatial details:

1.  **SigLIP (Vision-Language alignment):** Understands "what" things are.
2.  **DINOv2 (Self-supervised vision):** Understands "where" things are in 3D space.

#### The Action Head
Unlike its predecessors, OpenVLA is optimized for **parameter-efficient fine-tuning (PEFT)**. Using **LoRA**, you can adapt the 7B parameter model to a new robot embodiment in just a few hours.

| Feature | OpenVLA-7B | RT-2 (55B) |
| :--- | :--- | :--- |
| **Open Source** | Yes (Weights + Code) | No (Research Paper Only) |
| **Backbone** | Llama-2-7B | PaLI-X / PaLM-E |
| **Action Space** | 7-DOF discretized | 6-DOF discretized |
| **Training Data** | Open X-Embodiment | Google Private + Web |

## Comparison of VLA Workflows

| Model | Input | Intermediate Representation | Primary Output |
| :--- | :--- | :--- | :--- |
| **RT-1** | Image + Instruction | Tokenized History | Action Tokens |
| **PaLM-E** | Image + Multi-sensor | Multimodal Sentence | Textual Plan/Action |
| **OpenVLA** | Image + Instruction | Fused Embeddings | 7-DOF Action Tokens |

## Implementing OpenVLA (Action Prediction)

To use a VLA model, you typically pass the current camera observation and the goal instruction. The model returns a normalized vector of actions.

```python
# Conceptual OpenVLA implementation
from openvla import load_vla, get_processor

# Load at 4-bit quantization for real-time edge inference
vla_model = load_vla("openvla/openvla-7b", load_in_4bit=True)
processor = get_processor("openvla/openvla-7b")

def get_next_robot_step(image, command):
    # Process inputs
    inputs = processor(text=command, images=image, return_tensors="pt")

    # The VLA 'thinks' about the pixels and the text
    # then outputs the action tokens
    action = vla_model.predict_action(
        **inputs,
        unnorm_key="bridge_dataset" # Mapping back to real-world units
    )

    return action # e.g., [0.01, -0.05, 0.1, 0, 0, 1.57, 1.0]
```

## The "Tokenization" Mystery
Why do we tokenize actions?
By turning joint angles (e.g., 45.2 degrees) into a discrete token (e.g., `<ACTION_452>`), the model handles robotics exactly like language. This allows the transformer to use its native **attention mechanism** to find correlations between the visual feature of a "mug" and the action token for "grasping."

---

### Sources
*   [RT-2: Vision-Language-Action Models](https://arxiv.org/abs/2307.15818) (2023)
*   [PaLM-E: An Embodied Multimodal Language Model](https://arxiv.org/abs/2303.03378) (2023)
*   [OpenVLA: 7B Open-Source VLA](https://openvla.github.io/) (2024)
*   [Stanford AI Lab: Robotics Foundation Models](https://ai.stanford.edu/blog/openvla/)
