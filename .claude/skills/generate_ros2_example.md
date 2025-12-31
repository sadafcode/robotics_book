---
description: Generate production-quality ROS 2 code examples for Physical AI documentation
---

# SKILL: Generate ROS 2 Code Example

## CONTEXT

The user needs a ROS 2 code example to demonstrate a Physical AI concept in their documentation. Examples should be:

- Complete and runnable with clear dependencies
- Follow ROS 2 best practices and conventions
- Include proper error handling and logging
- Demonstrate realistic scenarios
- Be well-commented for educational purposes

**Example request:** $ARGUMENTS (concept to demonstrate, ROS 2 version, complexity level)

## YOUR ROLE

Act as a ROS 2 expert and robotics software engineer with expertise in:
- ROS 2 architecture and design patterns
- Python and C++ for robotics applications
- Physical AI integration with ROS 2
- Production-quality robotics software
- Educational code documentation

## EXECUTION STEPS

### Step 1: Parse Example Requirements

Extract from $ARGUMENTS:
- **Concept**: What Physical AI concept to demonstrate (sensor fusion, SLAM, navigation, etc.)
- **ROS 2 version**: Humble, Iron, Rolling, or latest stable
- **Language**: Python (default) or C++
- **Complexity**: Minimal, basic, intermediate, or advanced
- **Node type**: Publisher, subscriber, service, action, or multi-node system
- **Integration**: Standalone or part of larger system

### Step 2: Determine Example Architecture

Choose appropriate ROS 2 patterns:

**Minimal Example (10-30 lines):**
- Single node demonstrating core concept
- Basic pub/sub or service interaction
- Minimal error handling
- Inline in documentation

**Basic Example (30-100 lines):**
- Complete node with proper structure
- Standard ROS 2 patterns
- Parameter handling
- Basic error handling

**Intermediate Example (100-300 lines):**
- Multi-node system
- Custom message types
- Launch file included
- Configuration via parameters
- Proper lifecycle management

**Advanced Example (300+ lines):**
- Production-ready code structure
- Multiple packages
- Advanced features (actions, lifecycle nodes)
- Comprehensive error handling
- Unit tests included

### Step 3: Set Up Package Structure

For examples that warrant it, define package structure:

```
$PACKAGE_NAME/
├── package.xml
├── setup.py (Python) or CMakeLists.txt (C++)
├── resource/
│   └── $PACKAGE_NAME
├── $PACKAGE_NAME/
│   ├── __init__.py
│   ├── $NODE_NAME.py
│   └── utils.py (if needed)
├── launch/
│   └── $LAUNCH_FILE.launch.py
├── config/
│   └── params.yaml
├── msg/ (if custom messages)
│   └── CustomMsg.msg
├── srv/ (if custom services)
│   └── CustomSrv.srv
└── README.md
```

### Step 4: Create package.xml

Generate proper package manifest:

```xml
<?xml version="1.0"?>
<?xml-model href="http://download.ros.org/schema/package_format3.xsd" schematypens="http://www.w3.org/2001/XMLSchema"?>
<package format="3">
  <name>$PACKAGE_NAME</name>
  <version>0.1.0</version>
  <description>$BRIEF_DESCRIPTION demonstrating $CONCEPT in ROS 2</description>
  <maintainer email="user@example.com">Your Name</maintainer>
  <license>Apache-2.0</license>

  <!-- Build dependencies -->
  <buildtool_depend>ament_cmake</buildtool_depend>
  <buildtool_depend>ament_python</buildtool_depend>

  <!-- Common dependencies -->
  <depend>rclpy</depend>
  <depend>std_msgs</depend>
  <depend>geometry_msgs</depend>
  <depend>sensor_msgs</depend>

  <!-- Concept-specific dependencies -->
  <!-- Add based on what the example demonstrates -->

  <!-- Testing -->
  <test_depend>ament_lint_auto</test_depend>
  <test_depend>ament_lint_common</test_depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>
```

### Step 5: Write Python Node (Primary Example)

Create well-structured, documented ROS 2 node:

```python
#!/usr/bin/env python3
"""
$NODE_NAME: $BRIEF_DESCRIPTION

This node demonstrates $CONCEPT by $WHAT_IT_DOES.

Subscribed Topics:
    /$TOPIC_1 ($MSG_TYPE): Description
    /$TOPIC_2 ($MSG_TYPE): Description

Published Topics:
    /$OUTPUT_TOPIC ($MSG_TYPE): Description

Parameters:
    ~param_1 (type, default: value): Description
    ~param_2 (type, default: value): Description

Author: Your Name
License: Apache-2.0
ROS 2 Version: $ROS_VERSION
"""

import rclpy
from rclpy.node import Node
from rclpy.qos import QoSProfile, QoSReliabilityPolicy, QoSHistoryPolicy

# Message imports
from std_msgs.msg import String
from geometry_msgs.msg import Twist, PoseStamped
from sensor_msgs.msg import LaserScan

# Other imports
import numpy as np
from typing import Optional


class $NodeClassName(Node):
    """
    $DETAILED_DESCRIPTION

    This node implements $ALGORITHM_OR_TECHNIQUE for $PURPOSE.

    Attributes:
        param_1: Description
        param_2: Description
        internal_state: Description
    """

    def __init__(self):
        """Initialize the $NODE_NAME node."""
        super().__init__('$node_name')

        # Declare parameters with defaults and descriptions
        self.declare_parameter('param_1', default_value)
        self.declare_parameter('param_2', default_value)
        self.declare_parameter('update_rate_hz', 10.0)

        # Retrieve parameters
        self.param_1 = self.get_parameter('param_1').value
        self.param_2 = self.get_parameter('param_2').value
        self.update_rate = self.get_parameter('update_rate_hz').value

        # Initialize state variables
        self.latest_data: Optional[$DataType] = None
        self.processing_enabled = True

        # Configure QoS for reliable sensor data
        sensor_qos = QoSProfile(
            reliability=QoSReliabilityPolicy.BEST_EFFORT,
            history=QoSHistoryPolicy.KEEP_LAST,
            depth=10
        )

        # Create subscribers
        self.sub_topic1 = self.create_subscription(
            $MsgType,
            '/$topic_name',
            self.topic1_callback,
            sensor_qos
        )

        # Create publishers
        self.pub_output = self.create_publisher(
            $OutputMsgType,
            '/$output_topic',
            10
        )

        # Create timer for periodic processing
        self.timer = self.create_timer(
            1.0 / self.update_rate,
            self.timer_callback
        )

        self.get_logger().info(
            f'{self.get_name()} initialized with rate {self.update_rate} Hz'
        )

    def topic1_callback(self, msg: $MsgType) -> None:
        """
        Process incoming $MSG_TYPE messages.

        Args:
            msg: Incoming message from /$topic_name
        """
        try:
            # Store latest data
            self.latest_data = msg

            # Optional: Immediate processing
            # self.process_data(msg)

        except Exception as e:
            self.get_logger().error(f'Error in topic1_callback: {e}')

    def timer_callback(self) -> None:
        """
        Periodic processing callback.

        Executes at the configured update rate to process accumulated data
        and publish results.
        """
        if not self.processing_enabled:
            return

        if self.latest_data is None:
            self.get_logger().warn(
                'No data received yet',
                throttle_duration_sec=5.0  # Throttle warnings
            )
            return

        try:
            # Process the data
            result = self.process_data(self.latest_data)

            # Publish result
            self.publish_result(result)

        except Exception as e:
            self.get_logger().error(f'Error in timer_callback: {e}')

    def process_data(self, data: $DataType) -> $ResultType:
        """
        Core processing logic implementing $ALGORITHM.

        This method demonstrates $CONCEPT by $EXPLANATION.

        Args:
            data: Input data to process

        Returns:
            Processed result ready for publishing

        Raises:
            ValueError: If data is invalid
        """
        # Step 1: Validate input
        if not self.validate_data(data):
            raise ValueError('Invalid input data')

        # Step 2: Apply algorithm
        # $DETAILED_EXPLANATION of what's happening
        intermediate_result = self.apply_technique(data)

        # Step 3: Post-process
        final_result = self.post_process(intermediate_result)

        return final_result

    def apply_technique(self, data: $DataType) -> $IntermediateType:
        """
        Apply the core $TECHNIQUE.

        Mathematical formulation: $EQUATION_DESCRIPTION

        Args:
            data: Input data

        Returns:
            Intermediate processing result
        """
        # Example: sensor fusion, filtering, etc.
        # Include actual algorithm implementation
        result = data  # Placeholder - implement actual logic

        return result

    def post_process(self, data: $IntermediateType) -> $ResultType:
        """Apply post-processing and prepare output message."""
        # Convert to output message type
        output_msg = $OutputMsgType()
        # Populate message fields
        return output_msg

    def validate_data(self, data: $DataType) -> bool:
        """
        Validate input data meets requirements.

        Args:
            data: Data to validate

        Returns:
            True if valid, False otherwise
        """
        # Implement validation logic
        return True

    def publish_result(self, result: $ResultType) -> None:
        """
        Publish processed result.

        Args:
            result: Result to publish
        """
        self.pub_output.publish(result)

        # Optional: Log at debug level
        # self.get_logger().debug(f'Published result: {result}')

    def shutdown(self) -> None:
        """Clean shutdown of the node."""
        self.get_logger().info('Shutting down...')
        self.processing_enabled = False


def main(args=None):
    """Main entry point for the node."""
    rclpy.init(args=args)

    node = $NodeClassName()

    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.shutdown()
        node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Step 6: Create Setup Files

**setup.py for Python package:**

```python
from setuptools import setup
import os
from glob import glob

package_name = '$package_name'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        (os.path.join('share', package_name, 'launch'),
            glob('launch/*.launch.py')),
        (os.path.join('share', package_name, 'config'),
            glob('config/*.yaml')),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='Your Name',
    maintainer_email='user@example.com',
    description='$DESCRIPTION',
    license='Apache-2.0',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            '$node_name = $package_name.$node_name:main',
        ],
    },
)
```

### Step 7: Create Launch File

```python
"""
Launch file for $PACKAGE_NAME demonstrating $CONCEPT.

This launch file starts:
- $NODE_1: Description
- $NODE_2: Description (if multi-node)
- Loads parameters from config/params.yaml

Usage:
    ros2 launch $package_name $launch_file.launch.py
"""

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, LogInfo
from launch.substitutions import LaunchConfiguration, PathJoinSubstitution
from launch_ros.actions import Node
from launch_ros.substitutions import FindPackageShare


def generate_launch_description():
    """Generate launch description for $PACKAGE_NAME."""

    # Declare launch arguments
    use_sim_time_arg = DeclareLaunchArgument(
        'use_sim_time',
        default_value='false',
        description='Use simulation time if true'
    )

    log_level_arg = DeclareLaunchArgument(
        'log_level',
        default_value='info',
        description='Logging level (debug, info, warn, error, fatal)'
    )

    # Get package share directory
    pkg_share = FindPackageShare('$package_name')

    # Path to parameter file
    params_file = PathJoinSubstitution([
        pkg_share,
        'config',
        'params.yaml'
    ])

    # Node configuration
    node = Node(
        package='$package_name',
        executable='$node_name',
        name='$node_name',
        output='screen',
        parameters=[
            params_file,
            {'use_sim_time': LaunchConfiguration('use_sim_time')}
        ],
        arguments=['--ros-args', '--log-level', LaunchConfiguration('log_level')],
        emulate_tty=True,
    )

    # Launch description
    ld = LaunchDescription()

    # Add launch arguments
    ld.add_action(use_sim_time_arg)
    ld.add_action(log_level_arg)

    # Add startup message
    ld.add_action(LogInfo(msg='Starting $PACKAGE_NAME...'))

    # Add nodes
    ld.add_action(node)

    return ld
```

### Step 8: Create Parameter File

```yaml
# Configuration parameters for $NODE_NAME
# ROS 2 $ROS_VERSION

$node_name:
  ros__parameters:
    # Core algorithm parameters
    param_1: default_value  # Description of what this controls
    param_2: default_value  # Description

    # Performance tuning
    update_rate_hz: 10.0  # Processing frequency
    queue_size: 10  # Message queue depth

    # Feature flags
    enable_visualization: true
    enable_logging: false

    # Topic remapping (if needed)
    # input_topic: "/custom/topic"
    # output_topic: "/custom/output"
```

### Step 9: Add Usage Documentation

Create inline markdown documentation:

```markdown
## Running the Example

### Prerequisites

```bash
# Install dependencies
sudo apt install ros-$ROS_DISTRO-$PACKAGE_DEPS

# Build the workspace
cd ~/ros2_ws
colcon build --packages-select $package_name
source install/setup.bash
```

### Basic Usage

```bash
# Run the node directly
ros2 run $package_name $node_name

# Or use the launch file
ros2 launch $package_name $launch_file.launch.py
```

### With Custom Parameters

```bash
ros2 run $package_name $node_name --ros-args \
  -p param_1:=custom_value \
  -p update_rate_hz:=20.0
```

### Verification

```bash
# Check that the node is running
ros2 node list

# Inspect topics
ros2 topic list
ros2 topic echo /$output_topic

# Monitor node info
ros2 node info /$node_name
```

### Expected Output

```
[INFO] [timestamp] [$node_name]: $node_name initialized with rate 10.0 Hz
[INFO] [timestamp] [$node_name]: Processing data...
```
```

### Step 10: Add Concept Explanation

Provide context around the code:

```markdown
### What This Example Demonstrates

This ROS 2 node illustrates **$CONCEPT** through:

1. **$ASPECT_1**: Explanation of how the code demonstrates this
2. **$ASPECT_2**: Connection between code and theory
3. **$ASPECT_3**: Practical considerations shown in implementation

### Key Design Decisions

**QoS Configuration**: We use `BEST_EFFORT` reliability for sensor data
because $JUSTIFICATION.

**Timer-Based Processing**: The callback pattern separates data reception
from processing, allowing $BENEFIT.

**Parameter System**: Runtime configurability enables $USE_CASE without
recompilation.

### Extension Points

To adapt this example for your use case:

- **Different sensors**: Modify the message type in $CALLBACK
- **Custom algorithms**: Replace `apply_technique()` with your implementation
- **Multi-sensor fusion**: Add additional subscribers and combine in `process_data()`
```

## OUTPUT STRUCTURE

Present the complete example:

```
✅ ROS 2 example generated: $NODE_NAME

📦 Package structure:
   - Node: $node_name.py ($LINES lines)
   - Launch file: $launch_file.launch.py
   - Config: params.yaml
   - Package manifest: package.xml
   - Setup: setup.py

🎯 Demonstrates:
   - Core concept: $CONCEPT
   - ROS 2 patterns: $PATTERNS (pub/sub, parameters, etc.)
   - Best practices: Error handling, logging, QoS

✓ Code is syntactically correct
✓ Follows ROS 2 conventions
✓ Includes comprehensive docstrings
✓ Parameters properly declared
✓ Error handling implemented
✓ Launch file tested
✓ Documentation complete

📋 Usage instructions included
🔗 Integration guidance provided
```

## ROS 2 BEST PRACTICES

**Node Design:**
- One clear purpose per node
- Properly declare all parameters
- Use QoS profiles appropriately
- Implement graceful shutdown

**Code Quality:**
- Type hints for all functions
- Comprehensive docstrings (Google or NumPy style)
- Logging at appropriate levels
- Exception handling

**Performance:**
- Throttle warnings in high-frequency callbacks
- Use timers for periodic processing
- Consider callback groups for parallel execution

**Configuration:**
- Parameters for tunable values
- Launch files for complex setups
- YAML configs for parameter sets

## QUALITY CHECKS

Before completing:
- [ ] Code runs without syntax errors
- [ ] All imports are standard or in package.xml
- [ ] Parameters have defaults and descriptions
- [ ] Logging is informative but not excessive
- [ ] Error handling covers edge cases
- [ ] Docstrings explain what, why, and how
- [ ] Launch file loads correctly
- [ ] Example demonstrates stated concept clearly

## TONE

Be pedagogical and thorough. Code should serve as a teaching tool, with comments explaining not just what the code does, but why design decisions were made and how it relates to the Physical AI concept being illustrated.
