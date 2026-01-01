---
description: Generate URDF (Unified Robot Description Format) code snippets for robot modeling
---

# SKILL: Generate URDF Snippet

## CONTEXT

The user needs URDF code to describe a robot component, sensor configuration, or complete robot model for Physical AI documentation. URDF examples should:

- Be syntactically correct and validate-able
- Follow ROS conventions and best practices
- Include clear comments explaining structure
- Demonstrate realistic robot configurations
- Integrate with Gazebo/RViz visualization

**URDF request:** $ARGUMENTS (component type, robot part, complexity level)

## YOUR ROLE

Act as a robotics engineer and URDF expert with expertise in:
- Robot kinematics and mechanical design
- URDF/xacro syntax and conventions
- Sensor integration in robot models
- Gazebo simulation and RViz visualization
- Physical AI robot configurations

## EXECUTION STEPS

### Step 1: Parse URDF Requirements

Extract from $ARGUMENTS:
- **Component type**: Link, joint, sensor, complete robot, or assembly
- **Robot type**: Mobile robot, manipulator, humanoid, drone, or custom
- **Complexity**: Minimal, basic, detailed, or production-ready
- **Sensors**: Cameras, LiDAR, IMU, force/torque, etc.
- **Format**: Pure URDF or xacro (with macros)
- **Purpose**: Visualization, simulation, or both

### Step 2: Determine URDF Structure Level

Choose appropriate detail level:

**Level 1: Minimal Snippet (10-30 lines)**
- Single link or joint
- Basic geometric primitive
- No collision/inertial properties
- For concept illustration

**Level 2: Basic Component (30-100 lines)**
- Link with visual and collision geometry
- Proper joint definition
- Basic inertial properties
- Simple material/color

**Level 3: Detailed Subsystem (100-300 lines)**
- Multiple links and joints
- Accurate inertial properties
- Meshes for visual geometry
- Gazebo plugins for sensors
- Transmission definitions

**Level 4: Complete Robot (300+ lines)**
- Full kinematic chain
- All sensors integrated
- xacro macros for reusability
- Gazebo-ready with controllers
- Launch files for visualization

### Step 3: Create Basic Link Definition

Generate a link with proper structure:

```xml
<!--
  Link: $LINK_NAME
  Purpose: $DESCRIPTION

  A link represents a rigid body in the robot model with:
  - Visual: What the link looks like (for RViz)
  - Collision: Simplified geometry for collision detection
  - Inertial: Mass and inertia properties (for physics simulation)
-->
<link name="$link_name">

  <!-- Visual properties (for visualization in RViz) -->
  <visual>
    <origin xyz="$X $Y $Z" rpy="$ROLL $PITCH $YAW"/>
    <geometry>
      <!-- Choose one: box, cylinder, sphere, or mesh -->
      <box size="$LENGTH $WIDTH $HEIGHT"/>
      <!-- OR -->
      <cylinder radius="$RADIUS" length="$LENGTH"/>
      <!-- OR -->
      <sphere radius="$RADIUS"/>
      <!-- OR -->
      <mesh filename="package://$package_name/meshes/$mesh_file.dae" scale="$X $Y $Z"/>
    </geometry>
    <material name="$material_name">
      <color rgba="$R $G $B $A"/>  <!-- Red, Green, Blue, Alpha (0-1) -->
    </material>
  </visual>

  <!-- Collision properties (simplified geometry for physics) -->
  <collision>
    <origin xyz="$X $Y $Z" rpy="$ROLL $PITCH $YAW"/>
    <geometry>
      <!-- Usually same as visual but simplified for performance -->
      <box size="$LENGTH $WIDTH $HEIGHT"/>
    </geometry>
  </collision>

  <!-- Inertial properties (required for Gazebo simulation) -->
  <inertial>
    <origin xyz="$COM_X $COM_Y $COM_Z" rpy="0 0 0"/>
    <mass value="$MASS_KG"/>
    <inertia
      ixx="$IXX" ixy="$IXY" ixz="$IXZ"
      iyy="$IYY" iyz="$IYZ"
      izz="$IZZ"/>
  </inertial>

</link>
```

**Inertia calculation helpers:**
```xml
<!-- For a box: -->
<!-- ixx = (1/12) * m * (h² + d²) -->
<!-- iyy = (1/12) * m * (w² + d²) -->
<!-- izz = (1/12) * m * (w² + h²) -->

<!-- For a cylinder (axis along z): -->
<!-- ixx = iyy = (1/12) * m * (3r² + h²) -->
<!-- izz = (1/2) * m * r² -->

<!-- For a sphere: -->
<!-- ixx = iyy = izz = (2/5) * m * r² -->
```

### Step 4: Create Joint Definition

Generate joint connecting two links:

```xml
<!--
  Joint: $JOINT_NAME
  Type: $TYPE (fixed, revolute, continuous, prismatic)
  Purpose: $DESCRIPTION

  Connects $PARENT_LINK to $CHILD_LINK
-->
<joint name="$joint_name" type="$joint_type">

  <!-- Parent and child links -->
  <parent link="$parent_link"/>
  <child link="$child_link"/>

  <!-- Joint origin (transformation from parent to child) -->
  <origin xyz="$X $Y $Z" rpy="$ROLL $PITCH $YAW"/>

  <!-- Joint axis (for revolute/prismatic joints) -->
  <axis xyz="$AXIS_X $AXIS_Y $AXIS_Z"/>  <!-- e.g., "0 0 1" for z-axis rotation -->

  <!-- Joint limits (for revolute/prismatic joints) -->
  <limit
    lower="$LOWER_LIMIT"    <!-- radians for revolute, meters for prismatic -->
    upper="$UPPER_LIMIT"    <!-- radians for revolute, meters for prismatic -->
    effort="$MAX_EFFORT"    <!-- Maximum force/torque (N or N⋅m) -->
    velocity="$MAX_VELOCITY"/>  <!-- Maximum velocity (m/s or rad/s) -->

  <!-- Joint dynamics (optional) -->
  <dynamics damping="$DAMPING" friction="$FRICTION"/>

</joint>
```

**Joint type guide:**
```xml
<!-- fixed: No movement (e.g., sensor mounts) -->
<joint name="base_to_sensor" type="fixed">

<!-- revolute: Rotation with limits (e.g., robot arm joints) -->
<joint name="shoulder_joint" type="revolute">
  <limit lower="-3.14" upper="3.14" effort="100" velocity="2.0"/>

<!-- continuous: Rotation without limits (e.g., wheels) -->
<joint name="wheel_joint" type="continuous">
  <limit effort="10" velocity="5.0"/>  <!-- No position limits -->

<!-- prismatic: Linear motion (e.g., linear actuators) -->
<joint name="lift_joint" type="prismatic">
  <limit lower="0.0" upper="0.5" effort="1000" velocity="0.1"/>
  <axis xyz="0 0 1"/>  <!-- Slides along z-axis -->
```

### Step 5: Add Sensor Definitions

Integrate sensors with Gazebo plugins:

**Camera Sensor:**
```xml
<!-- Camera link -->
<link name="camera_link">
  <visual>
    <geometry>
      <box size="0.03 0.08 0.03"/>
    </geometry>
    <material name="camera_material">
      <color rgba="0.1 0.1 0.1 1.0"/>
    </material>
  </visual>
  <collision>
    <geometry>
      <box size="0.03 0.08 0.03"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="0.05"/>
    <inertia ixx="0.0001" ixy="0" ixz="0" iyy="0.0001" iyz="0" izz="0.0001"/>
  </inertial>
</link>

<!-- Camera joint (fixed to parent) -->
<joint name="camera_joint" type="fixed">
  <parent link="$parent_link"/>
  <child link="camera_link"/>
  <origin xyz="0.1 0 0.05" rpy="0 0 0"/>
</joint>

<!-- Gazebo camera plugin -->
<gazebo reference="camera_link">
  <sensor type="camera" name="camera_sensor">
    <update_rate>30.0</update_rate>
    <camera name="front_camera">
      <horizontal_fov>1.3962634</horizontal_fov>  <!-- 80 degrees -->
      <image>
        <width>800</width>
        <height>600</height>
        <format>R8G8B8</format>
      </image>
      <clip>
        <near>0.02</near>
        <far>300</far>
      </clip>
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.007</stddev>
      </noise>
    </camera>
    <plugin name="camera_controller" filename="libgazebo_ros_camera.so">
      <alwaysOn>true</alwaysOn>
      <updateRate>30.0</updateRate>
      <cameraName>camera</cameraName>
      <imageTopicName>/camera/image_raw</imageTopicName>
      <cameraInfoTopicName>/camera/camera_info</cameraInfoTopicName>
      <frameName>camera_link</frameName>
    </plugin>
  </sensor>
</gazebo>
```

**LiDAR/Laser Scanner:**
```xml
<!-- LiDAR link -->
<link name="lidar_link">
  <visual>
    <geometry>
      <cylinder radius="0.05" length="0.07"/>
    </geometry>
    <material name="lidar_material">
      <color rgba="0.2 0.2 0.2 1.0"/>
    </material>
  </visual>
  <collision>
    <geometry>
      <cylinder radius="0.05" length="0.07"/>
    </geometry>
  </collision>
  <inertial>
    <mass value="0.2"/>
    <inertia ixx="0.0001" ixy="0" ixz="0" iyy="0.0001" iyz="0" izz="0.0001"/>
  </inertial>
</link>

<!-- LiDAR joint -->
<joint name="lidar_joint" type="fixed">
  <parent link="$parent_link"/>
  <child link="lidar_link"/>
  <origin xyz="0 0 0.15" rpy="0 0 0"/>
</joint>

<!-- Gazebo LiDAR plugin -->
<gazebo reference="lidar_link">
  <sensor type="ray" name="lidar_sensor">
    <pose>0 0 0 0 0 0</pose>
    <visualize>false</visualize>
    <update_rate>10</update_rate>
    <ray>
      <scan>
        <horizontal>
          <samples>720</samples>
          <resolution>1</resolution>
          <min_angle>-3.14159</min_angle>
          <max_angle>3.14159</max_angle>
        </horizontal>
      </scan>
      <range>
        <min>0.10</min>
        <max>30.0</max>
        <resolution>0.01</resolution>
      </range>
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.01</stddev>
      </noise>
    </ray>
    <plugin name="gazebo_ros_lidar" filename="libgazebo_ros_ray_sensor.so">
      <ros>
        <namespace>/</namespace>
        <remapping>~/out:=scan</remapping>
      </ros>
      <output_type>sensor_msgs/LaserScan</output_type>
      <frame_name>lidar_link</frame_name>
    </plugin>
  </sensor>
</gazebo>
```

**IMU Sensor:**
```xml
<!-- IMU link (usually small or coincident with robot base) -->
<link name="imu_link">
  <inertial>
    <mass value="0.01"/>
    <inertia ixx="0.00001" ixy="0" ixz="0" iyy="0.00001" iyz="0" izz="0.00001"/>
  </inertial>
</link>

<!-- IMU joint -->
<joint name="imu_joint" type="fixed">
  <parent link="base_link"/>
  <child link="imu_link"/>
  <origin xyz="0 0 0" rpy="0 0 0"/>
</joint>

<!-- Gazebo IMU plugin -->
<gazebo reference="imu_link">
  <sensor name="imu_sensor" type="imu">
    <plugin filename="libgazebo_ros_imu_sensor.so" name="imu_plugin">
      <ros>
        <namespace>/</namespace>
        <remapping>~/out:=imu</remapping>
      </ros>
      <initial_orientation_as_reference>false</initial_orientation_as_reference>
    </plugin>
    <always_on>true</always_on>
    <update_rate>100</update_rate>
    <visualize>true</visualize>
    <imu>
      <angular_velocity>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
          </noise>
        </x>
        <y>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
          </noise>
        </y>
        <z>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>2e-4</stddev>
          </noise>
        </z>
      </angular_velocity>
      <linear_acceleration>
        <x>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
          </noise>
        </x>
        <y>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
          </noise>
        </y>
        <z>
          <noise type="gaussian">
            <mean>0.0</mean>
            <stddev>1.7e-2</stddev>
          </noise>
        </z>
      </linear_acceleration>
    </imu>
  </sensor>
</gazebo>
```

### Step 6: Create Complete Robot Example

For complete robots, provide full URDF structure:

```xml
<?xml version="1.0"?>
<!--
  URDF for $ROBOT_NAME

  Description: $ROBOT_DESCRIPTION
  Author: Your Name
  Date: 2025

  This model includes:
  - Base platform with wheels
  - Sensor suite (camera, LiDAR, IMU)
  - Accurate inertial properties
  - Gazebo plugins for simulation
-->
<robot name="$robot_name" xmlns:xacro="http://www.ros.org/wiki/xacro">

  <!-- ============= -->
  <!-- Base Link     -->
  <!-- ============= -->

  <link name="base_footprint"/>

  <joint name="base_joint" type="fixed">
    <parent link="base_footprint"/>
    <child link="base_link"/>
    <origin xyz="0 0 0.05" rpy="0 0 0"/>
  </joint>

  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.4 0.3 0.1"/>
      </geometry>
      <material name="base_material">
        <color rgba="0.5 0.5 0.5 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="0.4 0.3 0.1"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="5.0"/>
      <inertia ixx="0.042" ixy="0" ixz="0" iyy="0.067" iyz="0" izz="0.1"/>
    </inertial>
  </link>

  <!-- ============= -->
  <!-- Wheels        -->
  <!-- ============= -->

  <!-- Left wheel -->
  <link name="left_wheel">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.04"/>
      </geometry>
      <origin xyz="0 0 0" rpy="1.5708 0 0"/>
      <material name="wheel_material">
        <color rgba="0.2 0.2 0.2 1.0"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <cylinder radius="0.05" length="0.04"/>
      </geometry>
      <origin xyz="0 0 0" rpy="1.5708 0 0"/>
    </collision>
    <inertial>
      <mass value="0.5"/>
      <inertia ixx="0.0004" ixy="0" ixz="0" iyy="0.0004" iyz="0" izz="0.00063"/>
    </inertial>
  </link>

  <joint name="left_wheel_joint" type="continuous">
    <parent link="base_link"/>
    <child link="left_wheel"/>
    <origin xyz="0 0.18 -0.05" rpy="0 0 0"/>
    <axis xyz="0 1 0"/>
    <limit effort="10" velocity="5.0"/>
  </joint>

  <!-- Right wheel (mirror of left) -->
  <!-- ... similar structure ... -->

  <!-- ============= -->
  <!-- Sensors       -->
  <!-- ============= -->

  <!-- Add sensor definitions from Step 5 -->

  <!-- =================== -->
  <!-- Gazebo Materials    -->
  <!-- =================== -->

  <gazebo reference="base_link">
    <material>Gazebo/Grey</material>
  </gazebo>

  <gazebo reference="left_wheel">
    <material>Gazebo/Black</material>
    <mu1>1.0</mu1>  <!-- Friction coefficient -->
    <mu2>1.0</mu2>
  </gazebo>

  <!-- ========================= -->
  <!-- Differential Drive Plugin -->
  <!-- ========================= -->

  <gazebo>
    <plugin name="differential_drive_controller" filename="libgazebo_ros_diff_drive.so">
      <ros>
        <namespace>/</namespace>
      </ros>

      <!-- Wheel joints -->
      <left_joint>left_wheel_joint</left_joint>
      <right_joint>right_wheel_joint</right_joint>

      <!-- Kinematics -->
      <wheel_separation>0.36</wheel_separation>
      <wheel_diameter>0.10</wheel_diameter>

      <!-- Limits -->
      <max_wheel_torque>20</max_wheel_torque>
      <max_wheel_acceleration>1.0</max_wheel_acceleration>

      <!-- Output -->
      <publish_odom>true</publish_odom>
      <publish_odom_tf>true</publish_odom_tf>
      <publish_wheel_tf>true</publish_wheel_tf>

      <odometry_frame>odom</odometry_frame>
      <robot_base_frame>base_footprint</robot_base_frame>

      <!-- Topics -->
      <command_topic>cmd_vel</command_topic>
      <odometry_topic>odom</odometry_topic>
    </plugin>
  </gazebo>

</robot>
```

### Step 7: Create xacro Macro (Advanced)

For reusable components, use xacro:

```xml
<?xml version="1.0"?>
<robot xmlns:xacro="http://www.ros.org/wiki/xacro">

  <!--
    Macro: $MACRO_NAME
    Purpose: $DESCRIPTION

    Parameters:
      - prefix: Namespace for link/joint names
      - parent: Parent link to attach to
      - xyz: Position offset
      - rpy: Orientation offset
      - param1: Description
  -->
  <xacro:macro name="$macro_name" params="prefix parent *origin param1 param2">

    <!-- Link definition using parameters -->
    <link name="${prefix}_$link_name">
      <visual>
        <geometry>
          <box size="${param1} ${param2} 0.1"/>
        </geometry>
      </visual>
      <!-- ... -->
    </link>

    <!-- Joint connecting to parent -->
    <joint name="${prefix}_$joint_name" type="fixed">
      <parent link="${parent}"/>
      <child link="${prefix}_$link_name"/>
      <xacro:insert_block name="origin"/>
    </joint>

  </xacro:macro>

  <!-- Usage example -->
  <xacro:$macro_name prefix="front" parent="base_link" param1="0.1" param2="0.2">
    <origin xyz="0.3 0 0" rpy="0 0 0"/>
  </xacro:$macro_name>

</robot>
```

### Step 8: Add Validation and Testing Notes

Include validation instructions:

```markdown
## Validating the URDF

### Check syntax
```bash
check_urdf $robot_name.urdf
```

Expected output: "robot name is: $robot_name" (no errors)

### Visualize in RViz
```bash
# Install if needed
sudo apt install ros-$ROS_DISTRO-joint-state-publisher-gui

# Launch visualization
ros2 launch urdf_tutorial display.launch.py model:=$robot_name.urdf
```

### Convert xacro to URDF
```bash
xacro $robot_name.urdf.xacro > $robot_name.urdf
```

### View kinematic tree
```bash
urdf_to_graphiz $robot_name.urdf
evince $robot_name.pdf
```

### Test in Gazebo
```bash
gazebo --verbose $world_name.world
# Then spawn robot model
```
```

## OUTPUT STRUCTURE

Present the URDF snippet:

```
✅ URDF generated: $COMPONENT_NAME

📐 Model structure:
   - Links: X
   - Joints: Y (Z revolute, W fixed, V continuous)
   - Sensors: N (camera, LiDAR, IMU, etc.)
   - Gazebo plugins: M

🎯 Demonstrates:
   - Component: $WHAT_IT_MODELS
   - Kinematics: $JOINT_CONFIGURATION
   - Sensors: $SENSOR_SUITE
   - Physics: Inertial properties included

✓ URDF syntax validated
✓ Gazebo plugins configured
✓ RViz visualization ready
✓ Comments explain structure
✓ Realistic parameters used

📋 Usage:
   - Validation: check_urdf file.urdf
   - Visualization: RViz with joint_state_publisher
   - Simulation: Gazebo-ready with plugins
```

## URDF BEST PRACTICES

**Naming Conventions:**
- Links: `{prefix}_link` (e.g., `base_link`, `left_wheel`)
- Joints: `{parent}_to_{child}_joint` or `{child}_joint`
- Sensors: `{type}_link` (e.g., `camera_link`, `lidar_link`)

**Coordinate Frames:**
- X forward, Y left, Z up (ROS convention)
- Base_footprint at ground level
- Sensor frames follow REP-103/105

**Inertial Properties:**
- Always include mass and inertia
- Use realistic values (not zero or placeholder)
- Place center of mass accurately

**Collision Geometry:**
- Simpler than visual (for performance)
- Conservative bounding (slightly larger)
- Avoid complex meshes

**Materials:**
- Define reusable materials
- Use Gazebo materials for simulation
- Appropriate colors for clarity

## QUALITY CHECKS

Before completing:
- [ ] XML is well-formed and validates
- [ ] All links have inertial properties
- [ ] Joint limits are realistic
- [ ] Sensor plugins have correct filenames
- [ ] Coordinate frames follow conventions
- [ ] Mass/inertia values are physically plausible
- [ ] Comments explain non-obvious choices
- [ ] Model visualizes correctly in RViz

## TONE

Be precise and technical. URDF requires exact syntax and physically accurate parameters. Explain the reasoning behind values and configurations to help users understand and adapt the examples.
