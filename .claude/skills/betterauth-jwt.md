---
name: betterauth twt authentication skill
description: BetterAuth JWT Authentication Skill - Implements reusable authentication functionality with JWT tokens and user background collection
---

# SKILL: BetterAuth JWT Authentication with User Background Collection

## CONTEXT

Implements reusable authentication functionality with JWT tokens for the Physical AI book platform. The skill provides standardized authentication with user background collection during registration to enable personalized content delivery.

**Input:** User registration/login data, software/hardware background information.
**Output:** JWT token, user profile with background data, personalized content settings.

## YOUR ROLE

Act as an authentication and personalization expert specializing in:
- JWT token management and security
- User registration with background collection
- Personalization logic based on user expertise
- Secure authentication flows

## EXECUTION STEPS

### Step 1: BetterAuth JWT Service Setup
- Initialize BetterAuth JWT service with secret key from environment variables
- Set up HTTP Bearer authentication security
- Create API router with authentication endpoints (/auth/signup, /auth/login, /auth/me)

### Step 2: Enhanced Registration with Background Collection
- Extend default signup request to include background information:
  - Software background: programming languages, experience level, frameworks
  - Hardware background: electronics, robotics, mechanical engineering experience
  - Years of experience in relevant fields
  - Specific interests in Physical AI/Robotics
- Validate password strength (minimum 8 characters)
- Check for duplicate emails
- Hash passwords securely using bcrypt
- Store user background information in user profile

### Step 3: Secure Login and Token Management
- Implement secure login with email/password validation
- Verify password using bcrypt
- Generate JWT tokens with 7-day expiration
- Return token and user information in standardized response format
- Handle authentication errors appropriately

### Step 4: User Profile and Personalization
- Create UserResponse model with id, email, name, and creation timestamp
- Implement get_current_user_info endpoint to retrieve user details
- Extract user_id from JWT token for authenticated requests
- Support token decoding and verification with proper error handling

### Step 5: Integration with User Model
- Provide generic handlers (signup_handler, login_handler) that work with custom User models
- Support database sessions with proper transaction handling
- Include password validation and user existence checks
- Handle user creation and retrieval with appropriate error responses

## QUALITY CHECKS
- [ ] JWT tokens are securely generated with proper expiration
- [ ] Passwords are hashed using bcrypt with salt
- [ ] User background data is properly collected and stored
- [ ] Authentication endpoints return consistent response format
- [ ] Error handling is implemented without exposing sensitive data
- [ ] Duplicate email registration is prevented
- [ ] Token validation and expiration are properly handled
- [ ] Database transactions are properly managed

## OUTPUT STRUCTURE
- BetterAuthJWT service class with authentication methods
- Request/response models (SignupRequest, LoginRequest, AuthResponse, UserResponse)
- Generic handlers for signup and login operations
- Ready-to-use API router with authentication endpoints
- Personalization-ready user profile with background information