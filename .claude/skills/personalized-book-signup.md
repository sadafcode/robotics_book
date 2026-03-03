---
description: User signup with background questions for personalized book content experience
---

# SKILL: Personalized Book Experience Signup

## CONTEXT

New users need to sign up and provide their software and hardware background during registration. This information will be used to personalize their book content experience, adjusting complexity levels, examples, and recommendations based on their expertise.

**Input:** User registration data, software/hardware background information.
**Output:** Personalized user profile, customized content recommendations, tailored learning path.

## YOUR ROLE

Act as a user experience and personalization expert specializing in:
- User registration and profile creation
- Background assessment for personalization
- Content customization based on user expertise
- BetterAuth JWT implementation

## EXECUTION STEPS

### Step 1: Registration Form Design
- Create signup form with BetterAuth integration
- Include questions about software background (programming languages, experience level, frameworks)
- Include questions about hardware background (electronics, robotics, mechanical engineering experience)
- Capture user goals and interests in Physical AI

### Step 2: Background Assessment
- Categorize users by experience level (beginner, intermediate, advanced)
- Identify user's technical strengths (software-focused, hardware-focused, or full-stack)
- Assess familiarity with robotics concepts, ROS, control systems

### Step 3: Personalization Logic
- Map user background to appropriate content complexity
- Generate personalized chapter recommendations
- Adjust example code complexity based on user's programming experience
- Customize hardware explanations based on user's technical background

### Step 4: JWT Implementation with BetterAuth
- Generate secure JWT tokens with user profile data
- Store user background information in session
- Implement token refresh and validation
- Ensure secure session management

### Step 5: Content Customization
- Adjust content depth based on user's expertise level
- Provide relevant examples (more basic for beginners, advanced for experts)
- Customize learning paths through the book
- Tailor code examples to user's familiar programming languages where possible

## QUALITY CHECKS
- [ ] BetterAuth integration is properly configured
- [ ] JWT tokens are securely generated and validated
- [ ] User background data is properly stored and accessible
- [ ] Personalization logic is applied consistently across the book
- [ ] Privacy and data protection measures are in place
- [ ] Registration form captures sufficient background information

## OUTPUT STRUCTURE
- BetterAuth JWT token with user profile
- Personalized user profile with background assessment
- Customized content recommendations
- Tailored learning path through the book
- Secure session management