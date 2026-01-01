---
description: Generate Mermaid diagrams and architecture visualizations for Physical AI documentation
---

# SKILL: Create Diagram

## CONTEXT

The user needs visual diagrams to illustrate Physical AI concepts, system architectures, data flows, or algorithms in their documentation. Diagrams should:

- Be generated in Mermaid.js format (Docusaurus-compatible)
- Clearly illustrate the intended concept
- Follow consistent visual design principles
- Include descriptive captions and legends
- Be accessible and render correctly

**Diagram request:** $ARGUMENTS (diagram type, concept to illustrate, complexity level)

## YOUR ROLE

Act as a technical illustrator and information designer with expertise in:
- Visual communication of complex technical concepts
- Mermaid.js diagram syntax and capabilities
- System architecture and data flow visualization
- UML and standard diagram notations
- Physical AI system design patterns

## EXECUTION STEPS

### Step 1: Parse Diagram Requirements

Extract from $ARGUMENTS:
- **Diagram type**: Flowchart, sequence, architecture, class, state, entity-relationship, Gantt, or custom
- **Concept**: What needs to be illustrated (algorithm flow, system architecture, data pipeline, etc.)
- **Detail level**: High-level overview, detailed technical, or comprehensive
- **Style**: Minimal, standard, or detailed with annotations
- **Integration**: Standalone or part of chapter section

### Step 2: Choose Appropriate Diagram Type

Match concept to diagram type:

**Flowchart (graph TD/LR):**
- Algorithm steps and decision logic
- Process workflows
- State transitions
- Control flow

**Sequence Diagram:**
- Component interactions over time
- Message passing between systems
- Temporal relationships
- Protocol sequences

**Architecture Diagram (graph):**
- System components and connections
- Layered architectures
- Module relationships
- Hardware/software integration

**Class Diagram:**
- Object-oriented design
- Data structures
- Inheritance hierarchies
- Interface definitions

**State Diagram:**
- Finite state machines
- Behavioral states
- Transition conditions
- Robot operation modes

**Entity-Relationship (ER):**
- Data models
- Database schemas
- Relationships and cardinality

**Gantt Chart:**
- Project timelines
- Task dependencies
- Development phases

### Step 3: Create Flowchart Diagrams

For algorithms and process flows:

```markdown
### Algorithm Flow

```mermaid
graph TD
    A[Start: Input Sensor Data] --> B{Data Valid?}
    B -->|Yes| C[Preprocess Data]
    B -->|No| D[Log Error]
    D --> E[Use Previous Data]
    E --> C

    C --> F[Apply Kalman Filter]
    F --> G[State Estimation]
    G --> H{Confidence > Threshold?}

    H -->|Yes| I[Update Robot State]
    H -->|No| J[Increase Uncertainty]
    J --> K[Request Additional Sensors]

    I --> L[Publish Odometry]
    K --> L

    L --> M{Continue?}
    M -->|Yes| A
    M -->|No| N[End]

    style A fill:#e1f5e1,stroke:#4caf50,stroke-width:2px
    style N fill:#ffe1e1,stroke:#f44336,stroke-width:2px
    style H fill:#fff9e1,stroke:#ff9800,stroke-width:2px
    style I fill:#e1f0ff,stroke:#2196f3,stroke-width:2px
```

*Figure X: Sensor fusion algorithm showing data validation, filtering, and state estimation steps. Green indicates start, red indicates end, yellow indicates decision points, and blue indicates state updates.*

**Styling guide:**
- Start nodes: Green fill (#e1f5e1)
- End nodes: Red fill (#ffe1e1)
- Decision nodes: Yellow fill (#fff9e1)
- Process nodes: Blue fill (#e1f0ff)
- Error paths: Dashed lines
```

**Advanced flowchart with subgraphs:**

```markdown
```mermaid
graph TB
    subgraph "Perception Layer"
        A[Camera Input] --> D[Feature Extraction]
        B[LiDAR Input] --> D
        C[IMU Input] --> D
    end

    subgraph "Processing Layer"
        D --> E[Sensor Fusion]
        E --> F[SLAM Algorithm]
        F --> G[Map Update]
    end

    subgraph "Control Layer"
        G --> H[Path Planning]
        H --> I[Trajectory Generation]
        I --> J[Motor Commands]
    end

    subgraph "Feedback Loop"
        J -.->|Odometry| C
        G -.->|Localization| H
    end

    style D fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style F fill:#bfb,stroke:#333,stroke-width:2px

    classDef perception fill:#ffe6e6,stroke:#ff4444
    classDef processing fill:#e6f2ff,stroke:#4488ff
    classDef control fill:#e6ffe6,stroke:#44ff44

    class A,B,C perception
    class D,E,F,G processing
    class H,I,J control
```

*Figure Y: Hierarchical robot architecture showing data flow from perception through processing to control layers, with feedback loops for odometry and localization.*
```

### Step 4: Create Sequence Diagrams

For temporal interactions and message passing:

```markdown
### ROS 2 Node Communication

```mermaid
sequenceDiagram
    participant S as Sensor Node
    participant F as Fusion Node
    participant P as Planner Node
    participant C as Controller Node

    Note over S,C: System Initialization (t=0)

    S->>S: Initialize sensors
    F->>F: Load fusion parameters
    P->>P: Load map

    Note over S,C: Runtime Operation (t>0)

    loop Every 100ms
        S->>F: Publish /sensor_data<br/>(LaserScan, PointCloud2)
        Note right of F: Queue size: 10<br/>QoS: BEST_EFFORT

        F->>F: Apply Kalman filter
        F->>P: Publish /robot_pose<br/>(PoseStamped)
        Note right of P: Rate: 10 Hz<br/>QoS: RELIABLE

        P->>P: A* path planning
        P->>C: Publish /path<br/>(Path)

        C->>C: Compute control
        C->>S: Publish /cmd_vel<br/>(Twist)
    end

    Note over S,C: Error Handling

    S--xF: Sensor timeout (500ms)
    F->>F: Use prediction model
    F-->>P: Reduced confidence flag

    P->>P: Activate safe mode
    P->>C: Stop command
```

*Figure Z: Sequence diagram showing ROS 2 node interaction timeline during normal operation and error handling. Solid arrows indicate successful message passing, dashed arrows indicate timeouts or degraded modes.*
```

**Multi-phase sequence:**

```markdown
```mermaid
sequenceDiagram
    participant U as User
    participant R as Robot
    participant M as Map Server
    participant L as Localization

    Note over U,L: Phase 1: Initialization

    U->>R: Start navigation
    R->>M: Request map
    M-->>R: Map data (OccupancyGrid)
    R->>L: Initialize AMCL
    L-->>R: Ready

    Note over U,L: Phase 2: Localization

    loop Position updates
        R->>L: Sensor scan + odometry
        L->>L: Particle filter update
        L-->>R: Estimated pose + covariance
    end

    Note over U,L: Phase 3: Navigation

    U->>R: Set goal (x, y, θ)
    R->>R: Plan path (Dijkstra)
    R->>R: Execute trajectory

    alt Path blocked
        R->>R: Dynamic replan
        R-->>U: Replanning notification
    else Path clear
        R->>R: Follow path
    end

    R-->>U: Goal reached
```

*Figure: Multi-phase robot navigation showing initialization, continuous localization, and navigation with dynamic replanning.*
```

### Step 5: Create Architecture Diagrams

For system design and component relationships:

```markdown
### Physical AI System Architecture

```mermaid
graph LR
    subgraph "Edge Devices"
        CAM[RGB Camera<br/>30 FPS]
        LID[LiDAR<br/>10 Hz]
        IMU[IMU<br/>100 Hz]
        GPS[GPS<br/>1 Hz]
    end

    subgraph "Perception Pipeline"
        FE[Feature Extractor<br/>CNN-based]
        OD[Object Detector<br/>YOLO v8]
        SF[Sensor Fusion<br/>EKF]
    end

    subgraph "World Model"
        SLAM[SLAM<br/>ORB-SLAM3]
        MAP[Occupancy Map<br/>2D/3D]
        OBJ[Object Map<br/>Semantic]
    end

    subgraph "Planning & Control"
        PP[Path Planner<br/>A* + DWA]
        BP[Behavior Planner<br/>BT/FSM]
        MC[Motion Controller<br/>PID + MPC]
    end

    subgraph "Actuation"
        MOTOR[Motor Drivers]
        ACT[Actuators]
    end

    CAM --> FE
    CAM --> OD
    LID --> SF
    IMU --> SF
    GPS --> SF

    FE --> SLAM
    OD --> OBJ
    SF --> SLAM

    SLAM --> MAP
    MAP --> PP
    OBJ --> BP

    BP --> PP
    PP --> MC
    MC --> MOTOR
    MOTOR --> ACT

    ACT -.->|Feedback| IMU

    style CAM fill:#ffcccc
    style LID fill:#ffcccc
    style FE fill:#ccf
    style SF fill:#ccf
    style SLAM fill:#cfc
    style MAP fill:#cfc
    style PP fill:#ffc
    style MC fill:#ffc
    style MOTOR fill:#fcc
```

*Figure: End-to-end Physical AI architecture showing data flow from sensors through perception, world modeling, planning, and control to actuation. Color coding: Red=sensors, Blue=perception, Green=mapping, Yellow=planning/control, Pink=actuation.*
```

**Layered architecture:**

```markdown
```mermaid
graph TB
    subgraph "Application Layer"
        A1[Task Planner]
        A2[Mission Controller]
        A3[Behavior Orchestrator]
    end

    subgraph "Intelligence Layer"
        I1[Perception<br/>Vision + LiDAR]
        I2[Localization<br/>SLAM]
        I3[Prediction<br/>Trajectory]
        I4[Planning<br/>Global + Local]
    end

    subgraph "Execution Layer"
        E1[Motion Control]
        E2[Safety Monitor]
        E3[Actuator Interface]
    end

    subgraph "Hardware Abstraction"
        H1[Sensor Drivers]
        H2[Motor Controllers]
        H3[Communication]
    end

    subgraph "Physical Layer"
        P1[Sensors]
        P2[Motors]
        P3[Robot Hardware]
    end

    A1 --> I4
    A2 --> A1
    A3 --> A2

    I1 --> I2
    I2 --> I4
    I3 --> I4

    I4 --> E1
    E1 --> E2
    E2 --> E3

    E3 --> H2
    I1 --> H1
    H2 --> P2
    H1 --> P1

    style A1 fill:#e1bee7
    style I1 fill:#90caf9
    style E1 fill:#a5d6a7
    style H1 fill:#fff59d
    style P1 fill:#ffab91
```

*Figure: Layered robotics software architecture following hierarchical decomposition from high-level task planning to low-level hardware control.*
```

### Step 6: Create State Diagrams

For behavioral modeling:

```markdown
### Robot Operating States

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Initializing: Power on
    Initializing --> Ready: Self-test passed
    Initializing --> Error: Self-test failed

    Ready --> Navigating: Goal received
    Ready --> Idle: Shutdown command

    Navigating --> ObstacleAvoidance: Obstacle detected
    Navigating --> GoalReached: Arrived at goal
    Navigating --> Error: Critical failure

    ObstacleAvoidance --> Navigating: Path clear
    ObstacleAvoidance --> Stuck: Cannot proceed
    ObstacleAvoidance --> Error: Timeout

    Stuck --> Navigating: Replanned
    Stuck --> ManualControl: User intervention

    ManualControl --> Ready: User returns control

    GoalReached --> Ready: Success

    Error --> Recovery: Auto-recovery
    Recovery --> Ready: Recovered
    Recovery --> Error: Recovery failed
    Error --> Idle: Manual reset

    note right of Navigating
        Active states:
        - Path planning
        - Localization
        - Obstacle detection
    end note

    note right of Error
        Error types:
        - Sensor failure
        - Localization lost
        - Path blocked
        - Safety violation
    end note
```

*Figure: State machine for robot operation showing transitions between idle, navigation, obstacle avoidance, error handling, and recovery states.*
```

### Step 7: Create Class Diagrams

For software architecture and OOP design:

```markdown
### Sensor Fusion Class Hierarchy

```mermaid
classDiagram
    class SensorBase {
        <<abstract>>
        +String sensor_id
        +float update_rate
        +bool is_active
        +initialize() bool
        +read_data()* Data
        +shutdown() void
    }

    class CameraSensor {
        +int width
        +int height
        +float fps
        +read_data() ImageData
        +set_exposure(float) void
        +get_intrinsics() Matrix
    }

    class LiDARSensor {
        +int num_points
        +float range_max
        +read_data() PointCloud
        +set_filter(FilterType) void
    }

    class IMUSensor {
        +Vector3 accel_bias
        +Vector3 gyro_bias
        +read_data() IMUData
        +calibrate() bool
    }

    class FusionNode {
        -List~SensorBase~ sensors
        -KalmanFilter filter
        -RobotState state
        +add_sensor(SensorBase) void
        +update() void
        +get_state() RobotState
        -fuse_measurements() void
    }

    class KalmanFilter {
        -Matrix state_cov
        -Matrix process_noise
        -Matrix measurement_noise
        +predict(dt) void
        +update(measurement) void
        +get_estimate() Vector
    }

    class RobotState {
        +Vector3 position
        +Quaternion orientation
        +Vector3 velocity
        +Matrix covariance
        +timestamp
    }

    SensorBase <|-- CameraSensor
    SensorBase <|-- LiDARSensor
    SensorBase <|-- IMUSensor

    FusionNode --> SensorBase : manages
    FusionNode --> KalmanFilter : uses
    FusionNode --> RobotState : produces

    note for FusionNode "Main fusion node that\ncombines sensor data\nusing EKF"
```

*Figure: UML class diagram showing sensor fusion system design with inheritance hierarchy and component relationships.*
```

### Step 8: Create Data Flow Diagrams

For information processing pipelines:

```markdown
### Perception Pipeline Data Flow

```mermaid
graph LR
    subgraph Input
        I1[RGB Image<br/>640×480×3<br/>30 FPS]
        I2[Depth Image<br/>640×480<br/>30 FPS]
        I3[Point Cloud<br/>~10K points<br/>10 Hz]
    end

    subgraph "Feature Extraction"
        F1[CNN Backbone<br/>ResNet-50]
        F2[Feature Pyramid<br/>Multi-scale]
    end

    subgraph "Object Detection"
        D1[RPN<br/>Region Proposals]
        D2[ROI Pooling]
        D3[Classification<br/>+ Regression]
    end

    subgraph "3D Localization"
        L1[Depth Alignment]
        L2[3D Bounding Box<br/>Estimation]
        L3[Point Cloud<br/>Association]
    end

    subgraph Output
        O1[Detected Objects<br/>Class + 2D BBox]
        O2[3D Objects<br/>+ Pose + Dims]
        O3[Semantic Map<br/>Grid-based]
    end

    I1 --> F1
    F1 --> F2
    F2 --> D1
    D1 --> D2
    D2 --> D3
    D3 --> O1

    I2 --> L1
    I3 --> L3
    O1 --> L2
    L1 --> L2
    L2 --> L3
    L3 --> O2

    O2 --> O3

    style I1 fill:#fee
    style F1 fill:#eef
    style D1 fill:#efe
    style L1 fill:#ffe
    style O1 fill:#fef
```

*Figure: Data flow through vision-based perception pipeline showing feature extraction, 2D object detection, 3D localization, and semantic mapping stages with data dimensions.*
```

### Step 9: Add Comparison Diagrams

For showing alternatives or trade-offs:

```markdown
### Sensor Fusion Approaches Comparison

```mermaid
graph TB
    subgraph "Kalman Filter Approach"
        KF1[Linear System<br/>Assumption]
        KF2[Gaussian Noise<br/>Assumption]
        KF3[Optimal for<br/>Linear Systems]
        KF4[Fast: O(n²)]

        KF1 --> KF2
        KF2 --> KF3
        KF3 --> KF4
    end

    subgraph "Particle Filter Approach"
        PF1[Non-linear<br/>System Support]
        PF2[Arbitrary Noise<br/>Distributions]
        PF3[Approximate<br/>Solution]
        PF4[Slow: O(n·m)<br/>n=particles]

        PF1 --> PF2
        PF2 --> PF3
        PF3 --> PF4
    end

    subgraph "Deep Learning Approach"
        DL1[Learned<br/>Representations]
        DL2[Data-driven<br/>No Assumptions]
        DL3[Handles<br/>Complexity]
        DL4[GPU Required<br/>High Latency]

        DL1 --> DL2
        DL2 --> DL3
        DL3 --> DL4
    end

    style KF1 fill:#c8e6c9
    style PF1 fill:#fff9c4
    style DL1 fill:#bbdefb

    style KF4 fill:#a5d6a7
    style PF4 fill:#fff59d
    style DL4 fill:#90caf9
```

*Figure: Comparison of three sensor fusion approaches showing assumptions, capabilities, and computational characteristics.*
```

### Step 10: Add Annotations and Legends

Enhance diagrams with explanatory text:

```markdown
```mermaid
graph TD
    A[Input: Raw Sensor Data] -->|Preprocessing| B[Filtered Data]
    B -->|Feature Extraction| C[Feature Vectors]
    C -->|Classification| D[Object Classes]

    Note1[Note: Preprocessing includes<br/>noise reduction, normalization,<br/>and outlier removal]
    Note2[Note: Features extracted using<br/>deep CNN (ResNet-50 backbone)]

    B -.-> Note1
    C -.-> Note2

    style Note1 fill:#ffffcc,stroke:#cccc00,stroke-dasharray: 5 5
    style Note2 fill:#ffffcc,stroke:#cccc00,stroke-dasharray: 5 5
```

**Best practices for annotations:**
- Use `note` blocks for explanatory text
- Dashed lines for non-data connections
- Yellow background for notes
- Keep annotations concise
```

## OUTPUT STRUCTURE

Present the diagram:

```
✅ Diagram created: $DIAGRAM_TITLE

📊 Diagram details:
   - Type: $DIAGRAM_TYPE (flowchart, sequence, class, etc.)
   - Nodes: X
   - Edges/Connections: Y
   - Subgraphs/Sections: Z
   - Annotations: W

🎯 Illustrates:
   - Concept: $WHAT_IT_SHOWS
   - Key insight: $MAIN_TAKEAWAY
   - Complexity: $LEVEL (high-level, detailed, comprehensive)

✓ Mermaid syntax validated
✓ Renders correctly in Docusaurus
✓ Color coding is meaningful
✓ Caption provided
✓ Legend/annotations included where needed

📝 Markdown code block ready to insert into documentation
🎨 Styling consistent with documentation theme
```

## DIAGRAM BEST PRACTICES

**Visual Design:**
- Limit to 7-15 nodes for readability
- Use consistent color scheme
- Group related components in subgraphs
- Left-to-right or top-to-bottom flow

**Color Coding:**
- Input/sensors: Red/pink tones
- Processing: Blue tones
- Storage/state: Green tones
- Output/control: Yellow/orange tones
- Errors/warnings: Red outlines

**Text and Labels:**
- Concise labels (2-5 words)
- Include units for data (MB, Hz, ms)
- Abbreviate long names with legend
- Use consistent terminology

**Accessibility:**
- Don't rely solely on color
- Use shape and pattern too
- Include descriptive captions
- Provide text alternative

## MERMAID SYNTAX REFERENCE

**Graph directions:**
- `TD` or `TB`: Top to bottom
- `LR`: Left to right
- `RL`: Right to left
- `BT`: Bottom to top

**Node shapes:**
- `[Text]`: Rectangle
- `(Text)`: Rounded
- `([Text])`: Stadium
- `[[Text]]`: Subroutine
- `[(Text)]`: Cylinder
- `((Text))`: Circle
- `{Text}`: Diamond
- `{{Text}}`: Hexagon

**Line types:**
- `-->`: Solid arrow
- `-.->`: Dotted arrow
- `==>`: Thick arrow
- `--`: Solid line
- `-.-`: Dotted line

**Styling:**
- `style node fill:#color`
- `class node1,node2 className`
- `classDef className fill:#color`

## QUALITY CHECKS

Before completing:
- [ ] Diagram renders without errors
- [ ] All nodes are labeled clearly
- [ ] Flow direction is logical
- [ ] Colors enhance understanding
- [ ] Caption explains the diagram
- [ ] Legend provided if needed
- [ ] Syntax is valid Mermaid.js
- [ ] Fits within documentation width
- [ ] Text is readable at normal size

## TONE

Be clear and visual. Diagrams should simplify complex concepts, not add complexity. Use annotations to guide the reader's understanding and highlight the most important aspects.
