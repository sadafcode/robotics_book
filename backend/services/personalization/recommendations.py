"""Hardware and software recommendations by expertise level."""

from typing import Literal

ExpertiseLevelStr = Literal["non_technical", "beginner", "intermediate", "professional"]

_RECOMMENDATIONS: dict[str, dict] = {
    "non_technical": {
        "summary": "Start with accessible, affordable platforms that require no prior coding.",
        "hardware": [
            {
                "name": "Raspberry Pi 4 Model B",
                "description": "Beginner-friendly single-board computer. Great for first robotics projects.",
                "price_range": "$35-$75",
                "link": "https://www.raspberrypi.com/products/raspberry-pi-4-model-b/",
            },
            {
                "name": "LEGO Mindstorms / SPIKE Prime",
                "description": "Visual programming + physical robot kits. No soldering required.",
                "price_range": "$200-$350",
                "link": "https://education.lego.com/en-us/products/lego-education-spike-prime-set/45678/",
            },
            {
                "name": "Sphero RVR",
                "description": "Programmable robot platform with sensors. Ideal for exploration.",
                "price_range": "$250",
                "link": "https://sphero.com/products/rvr",
            },
        ],
        "software": [
            {
                "name": "Scratch / MIT App Inventor",
                "description": "Visual block-based programming for absolute beginners.",
                "free": True,
            },
            {
                "name": "Thonny IDE",
                "description": "Beginner-friendly Python IDE with built-in debugger.",
                "free": True,
            },
        ],
    },
    "beginner": {
        "summary": "Hands-on platforms with solid community support and good learning resources.",
        "hardware": [
            {
                "name": "TurtleBot 4",
                "description": "Official ROS 2 learning robot. Excellent community & documentation.",
                "price_range": "$1,100-$1,600",
                "link": "https://clearpathrobotics.com/turtlebot-4/",
            },
            {
                "name": "Raspberry Pi 4 + Arduino Uno",
                "description": "Combine high-level computing (Pi) with real-time control (Arduino).",
                "price_range": "$60-$120",
                "link": "https://www.arduino.cc/en/Main/arduinoBoardUno",
            },
            {
                "name": "Yahboom ROSMASTER R2",
                "description": "Affordable ROS 2 mobile robot kit with LIDAR and camera.",
                "price_range": "$350-$500",
                "link": "https://www.yahboom.net/",
            },
        ],
        "software": [
            {
                "name": "ROS 2 Humble",
                "description": "The standard robotics middleware. LTS release through 2027.",
                "free": True,
            },
            {
                "name": "Gazebo Classic / Ignition",
                "description": "3D robot simulator integrated with ROS 2.",
                "free": True,
            },
            {
                "name": "VS Code + ROS Extension",
                "description": "Excellent IDE support for ROS 2 development.",
                "free": True,
            },
        ],
    },
    "intermediate": {
        "summary": "More capable platforms for complex autonomous behaviors.",
        "hardware": [
            {
                "name": "Unitree Go1 / Go2",
                "description": "Quadruped robot for legged locomotion research and development.",
                "price_range": "$2,700-$8,000",
                "link": "https://www.unitree.com/",
            },
            {
                "name": "Intel RealSense D435i",
                "description": "Depth + IMU camera for SLAM and 3D perception.",
                "price_range": "$200-$300",
                "link": "https://www.intelrealsense.com/depth-camera-d435i/",
            },
            {
                "name": "NVIDIA Jetson Orin Nano",
                "description": "Edge AI compute module for perception and inference tasks.",
                "price_range": "$150-$500",
                "link": "https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/",
            },
            {
                "name": "Universal Robots UR3e",
                "description": "Collaborative robot arm suitable for lab and research use.",
                "price_range": "$35,000+",
                "link": "https://www.universal-robots.com/products/ur3-robot/",
            },
        ],
        "software": [
            {
                "name": "MoveIt 2",
                "description": "Motion planning framework for robot manipulation.",
                "free": True,
            },
            {
                "name": "Nav2",
                "description": "Complete navigation stack for autonomous mobile robots.",
                "free": True,
            },
            {
                "name": "Isaac ROS",
                "description": "NVIDIA's GPU-accelerated ROS 2 packages for perception.",
                "free": True,
            },
        ],
    },
    "professional": {
        "summary": "Research-grade and production platforms for cutting-edge work.",
        "hardware": [
            {
                "name": "Boston Dynamics Spot",
                "description": "Industry-standard quadruped for research and field deployment.",
                "price_range": "$70,000+",
                "link": "https://bostondynamics.com/products/spot/",
            },
            {
                "name": "Franka Emika Research 3",
                "description": "7-DOF collaborative arm with torque sensing. Research standard.",
                "price_range": "$30,000+",
                "link": "https://franka.de/",
            },
            {
                "name": "NVIDIA DGX Station",
                "description": "Workstation-class AI training hardware for sim2real workflows.",
                "price_range": "$50,000+",
                "link": "https://www.nvidia.com/en-us/data-center/dgx-station-a100/",
            },
            {
                "name": "LIDAR: Velodyne VLP-32C",
                "description": "High-density 3D LIDAR for autonomous vehicle and robot research.",
                "price_range": "$8,000-$12,000",
                "link": "https://velodynelidar.com/",
            },
        ],
        "software": [
            {
                "name": "NVIDIA Isaac Sim",
                "description": "Photorealistic simulation for training and testing AI robots.",
                "free": True,
            },
            {
                "name": "IsaacLab / Orbit",
                "description": "Robot learning framework built on Isaac Sim.",
                "free": True,
            },
            {
                "name": "PyTorch + TorchRL",
                "description": "Deep learning + reinforcement learning for robot policies.",
                "free": True,
            },
            {
                "name": "ROS 2 Rolling",
                "description": "Latest ROS 2 with cutting-edge features for research.",
                "free": True,
            },
        ],
    },
}


def get_recommendations(level: ExpertiseLevelStr) -> dict:
    return _RECOMMENDATIONS.get(level, _RECOMMENDATIONS["beginner"])
