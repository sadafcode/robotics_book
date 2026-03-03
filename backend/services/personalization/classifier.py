"""Rule-based user classification from questionnaire responses."""

from typing import Literal

QUESTIONS = [
    {
        "key": "programming_experience",
        "question": "How much programming experience do you have?",
        "options": [
            {"label": "None", "score": 0},
            {"label": "Less than 1 year", "score": 1},
            {"label": "1-3 years", "score": 2},
            {"label": "3+ years", "score": 3},
        ],
    },
    {
        "key": "primary_language",
        "question": "What is your primary programming language?",
        "options": [
            {"label": "None", "score": 0},
            {"label": "Web / JavaScript", "score": 1},
            {"label": "Python", "score": 2},
            {"label": "C / C++", "score": 3},
        ],
    },
    {
        "key": "robotics_experience",
        "question": "How much robotics experience do you have?",
        "options": [
            {"label": "None", "score": 0},
            {"label": "Hobbyist (Arduino, etc.)", "score": 1},
            {"label": "ROS beginner", "score": 2},
            {"label": "ROS expert", "score": 3},
        ],
    },
    {
        "key": "hardware_experience",
        "question": "What is your hardware experience?",
        "options": [
            {"label": "None", "score": 0},
            {"label": "Basic electronics", "score": 1},
            {"label": "Microcontrollers / Raspberry Pi", "score": 2},
            {"label": "PCB design / FPGA", "score": 3},
        ],
    },
    {
        "key": "math_comfort",
        "question": "How comfortable are you with mathematics?",
        "options": [
            {"label": "Not comfortable", "score": 0},
            {"label": "Basic algebra", "score": 1},
            {"label": "Calculus / Linear algebra", "score": 2},
            {"label": "Advanced (control theory, etc.)", "score": 3},
        ],
    },
    {
        "key": "ml_experience",
        "question": "What is your machine learning experience?",
        "options": [
            {"label": "None", "score": 0},
            {"label": "Understand the concepts", "score": 1},
            {"label": "Used ML libraries (TensorFlow, PyTorch)", "score": 2},
            {"label": "Built and trained models", "score": 3},
        ],
    },
    {
        "key": "goal",
        "question": "What is your primary goal with this book?",
        "options": [
            {"label": "Understand the field broadly", "score": 0},
            {"label": "Build hobby projects", "score": 1},
            {"label": "Apply in professional work", "score": 2},
            {"label": "Academic / research use", "score": 3},
        ],
    },
]

ExpertiseLevelStr = Literal["non_technical", "beginner", "intermediate", "professional"]

# Score thresholds (max possible = 21)
_THRESHOLDS = [
    (0, 5, "non_technical"),
    (6, 10, "beginner"),
    (11, 15, "intermediate"),
    (16, 21, "professional"),
]


def classify(total_score: int) -> ExpertiseLevelStr:
    for low, high, level in _THRESHOLDS:
        if low <= total_score <= high:
            return level
    return "beginner"


def compute_score(answers: dict[str, int]) -> tuple[int, ExpertiseLevelStr]:
    """Given {question_key: answer_index}, return (raw_score, level)."""
    total = 0
    for q in QUESTIONS:
        key = q["key"]
        idx = answers.get(key, 0)
        if 0 <= idx < len(q["options"]):
            total += q["options"][idx]["score"]
    return total, classify(total)
