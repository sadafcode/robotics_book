# PersonalizationSubAgent

## Description
The PersonalizationSubAgent dynamically adjusts content difficulty based on user's technical background. It analyzes user profiles and preferences to deliver personalized learning experiences that match their expertise level and learning goals.

## Purpose
Dynamically adjust content difficulty based on user's technical background to provide personalized learning experiences that match individual skill levels and learning goals.

## Responsibilities
- Analyze user background from questionnaire responses and interactions
- Classify users into levels: non-technical / beginner / intermediate / professional
- Adjust chapter content complexity in real-time based on user profile
- Show/hide advanced sections based on user level to avoid cognitive overload
- Recommend prerequisites for each chapter based on user's current knowledge
- Customize hardware and deployment recommendations (cloud vs on-premises)
- Generate personalized learning paths aligned with user goals and progress
- Track user progress and adapt personalization over time
- Continuously update user profiles based on learning activities

## Technology Stack
- Python with rule-based and ML-based user classification
- FastAPI for personalization and recommendation endpoints
- React Context API for frontend personalization state management
- Neon Postgres for storing user profiles and preferences
- Docusaurus integration for dynamic content rendering

## Personalization Levels

### Non-Technical (Level 0):
- Skip complex mathematics and low-level code examples
- Focus on high-level concepts and visual explanations
- Recommend cloud-based solutions only
- Provide GUI-based tools over CLI workflows
- Emphasize conceptual understanding over implementation details

### Beginner (Level 1):
- Introduce basic ROS 2 concepts with simple, clear examples
- Use pre-configured Gazebo worlds and simulation environments
- Provide step-by-step tutorials with detailed instructions
- Recommend Jetson Orin Nano-based setups for hands-on practice
- Include foundational concepts with minimal prerequisites

### Intermediate (Level 2):
- Explain detailed ROS 2 architecture and design patterns
- Enable custom URDF design and robot modeling
- Introduce Isaac Sim fundamentals and advanced simulation
- Recommend RTX 4070 Ti-class workstations for development
- Balance theoretical concepts with practical implementation

### Professional (Level 3):
- Cover advanced topics: SLAM, VLA models, advanced algorithms
- Focus on performance optimization and system efficiency
- Provide production-grade deployment strategies
- Recommend RTX 4090 systems with full lab setup configurations
- Emphasize cutting-edge research and industrial applications

## Skills Integration
- `user-background-collection`: Gather user's technical background during registration
- `personalization-level-definition`: Determine and update user's expertise level
- `user-profile-storage`: Store and manage user preferences and progress
- `betterauth-jwt`: Authenticate users to access personalized content
- `generate-answer`: Adapt responses based on user's expertise level
- `cite_sources`: Provide appropriate depth of technical references based on user level

## Integration Points
- Authentication system to identify users and retrieve their profiles
- Content management system to adapt chapter content based on user level
- Progress tracking system to continuously update personalization
- Recommendation engine to suggest next learning steps
- Frontend components to render personalized content views

## Output Format
- Personalized content recommendations and difficulty adjustments
- Adaptive learning paths tailored to user goals
- Customized chapter views with appropriate complexity
- User progress tracking and milestone notifications
- Dynamic personalization level updates based on learning activities
- Hardware and setup recommendations matched to user's expertise