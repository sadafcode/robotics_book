"""Learning path generation based on expertise level."""

from typing import Literal

ExpertiseLevelStr = Literal["non_technical", "beginner", "intermediate", "professional"]

# Chapter catalog: id, title, min_level required, order per level
CHAPTERS = [
    {
        "id": "intro",
        "title": "Introduction to Physical AI",
        "description": "Overview of the physical AI landscape and this book's structure.",
        "min_level": "non_technical",
        "order": 1,
    },
    {
        "id": "ros2-fundamentals",
        "title": "ROS 2 Fundamentals",
        "description": "Core concepts: nodes, topics, services, and actions in ROS 2 Humble.",
        "min_level": "beginner",
        "order": 2,
    },
    {
        "id": "robot-hardware",
        "title": "Robot Hardware Basics",
        "description": "Sensors, actuators, and embedded systems for robotics.",
        "min_level": "beginner",
        "order": 3,
    },
    {
        "id": "urdf-modeling",
        "title": "URDF Robot Modeling",
        "description": "Building robot descriptions with URDF and Xacro.",
        "min_level": "intermediate",
        "order": 4,
    },
    {
        "id": "navigation",
        "title": "Autonomous Navigation",
        "description": "Nav2 stack, SLAM, path planning, and obstacle avoidance.",
        "min_level": "intermediate",
        "order": 5,
    },
    {
        "id": "perception",
        "title": "Robot Perception",
        "description": "Computer vision, point clouds, and sensor fusion for robots.",
        "min_level": "intermediate",
        "order": 6,
    },
    {
        "id": "manipulation",
        "title": "Robot Manipulation",
        "description": "MoveIt 2, kinematics, and motion planning for robot arms.",
        "min_level": "intermediate",
        "order": 7,
    },
    {
        "id": "ml-robotics",
        "title": "Machine Learning for Robotics",
        "description": "Applying deep learning and reinforcement learning in robotic systems.",
        "min_level": "professional",
        "order": 8,
    },
    {
        "id": "sim-deployment",
        "title": "Simulation and Deployment",
        "description": "Gazebo, Isaac Sim, and deploying to real hardware.",
        "min_level": "beginner",
        "order": 9,
    },
    {
        "id": "system-integration",
        "title": "System Integration",
        "description": "Putting it all together: full-stack physical AI systems.",
        "min_level": "professional",
        "order": 10,
    },
]

_LEVEL_ORDER = ["non_technical", "beginner", "intermediate", "professional"]


def get_learning_path(level: ExpertiseLevelStr) -> list[dict]:
    """Return chapters accessible for the given level, ordered appropriately."""
    level_idx = _LEVEL_ORDER.index(level)

    accessible = [
        c for c in CHAPTERS
        if _LEVEL_ORDER.index(c["min_level"]) <= level_idx
    ]

    # Sort by order
    accessible.sort(key=lambda c: c["order"])

    return [
        {
            "id": c["id"],
            "title": c["title"],
            "description": c["description"],
            "min_level": c["min_level"],
            "is_recommended": c["min_level"] == level,
            "is_accessible": True,
        }
        for c in accessible
    ]
