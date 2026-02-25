# Tasks: BetterAuth JWT Authentication

**Input**: Design documents from `/specs/003-auth-jwt/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base environment.

- [x] T001 [P] Initialize authentication module structure in backend/src/auth/
- [x] T002 [P] Configure environment variables for BetterAuth in backend/.env
- [x] T003 [P] Install BetterAuth dependencies in frontend and backend
- [x] T004 [P] Set up Neon Postgres connection in backend/src/models/base.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T005 [P] Implement User model with background fields in backend/src/auth/models/user.py
- [x] T006 [P] Implement UserProfile model with personalization level in backend/src/auth/models/user_profile.py
- [x] T007 [P] Initialize BetterAuth configuration in backend/src/auth/auth_config.py
- [x] T008 [P] Set up JWT token service in backend/src/auth/services/jwt_service.py
- [x] T009 [P] Create database connection and session management in backend/src/auth/models/database.py

---

## Phase 3: User Story 1 - User Registration with Background Collection (Priority: P1) 🎯 MVP

**Goal**: Allow new users to register and provide their software and hardware background.

**Independent Test**: Verify that a visitor can complete the signup flow with background questions and their account and background information are stored securely.

**Acceptance Scenarios**:
1. **Given** a visitor on the signup page, **When** they fill in registration details and background questions, **Then** an account is created with their background information stored securely.
2. **Given** a user with specific technical background, **When** they complete registration, **Then** their profile reflects their expertise level for personalization.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create background question schema in backend/src/auth/models/background_schema.py
- [x] T011 [P] [US1] Implement registration service logic in backend/src/auth/services/registration_service.py
- [x] T012 [US1] Create registration API endpoint in backend/src/auth/api/auth_routes.py
- [x] T013 [P] [US1] Create frontend registration form with background questions in frontend/src/components/RegistrationForm.jsx
- [x] T014 [P] [US1] Add registration API client in frontend/src/services/auth_client.js
- [x] T015 [US1] Integrate registration form with backend API
- [x] T016 [US1] Implement background validation and processing logic

---

## Phase 4: User Story 2 - Secure User Authentication (Priority: P1)

**Goal**: Allow registered users to securely sign in and access personalized content.

**Independent Test**: Verify that a registered user can sign in with valid credentials and gain access to personalized content.

**Acceptance Scenarios**:
1. **Given** a registered user with valid credentials, **When** they sign in, **Then** they receive a valid JWT token and access to personalized content.
2. **Given** a user with invalid credentials, **When** they attempt to sign in, **Then** they are denied access with appropriate error message.

### Implementation for User Story 2

- [x] T017 [P] [US2] Implement login service logic in backend/src/auth/services/login_service.py
- [x] T018 [US2] Create login API endpoint in backend/src/auth/api/auth_routes.py
- [x] T019 [P] [US2] Create frontend login form in frontend/src/components/LoginForm.jsx
- [x] T020 [P] [US2] Add login API client in frontend/src/services/auth_client.js
- [x] T021 [US2] Implement JWT token handling in frontend session management
- [x] T022 [US2] Add authentication middleware for protected routes

---

## Phase 5: User Story 3 - JWT Token Management (Priority: P2)

**Goal**: Maintain user sessions securely using JWT tokens for a seamless experience.

**Independent Test**: Verify JWT token generation, validation, and refresh functionality.

**Acceptance Scenarios**:
1. **Given** a user who has successfully authenticated, **When** they perform actions requiring authentication, **Then** their JWT token is validated and they maintain access.
2. **Given** a user with an expired JWT token, **When** they try to access protected resources, **Then** they are prompted to re-authenticate.

### Implementation for User Story 3

- [x] T023 [P] [US3] Implement JWT validation service in backend/src/auth/services/jwt_validation_service.py
- [x] T024 [P] [US3] Create token refresh endpoint in backend/src/auth/api/auth_routes.py
- [x] T025 [P] [US3] Implement token refresh logic in frontend/src/services/auth_client.js
- [x] T026 [US3] Add token expiration handling in frontend session management
- [x] T027 [US3] Implement secure token storage in frontend

---

## Phase 6: User Story 4 - Background-Based Content Personalization (Priority: P3)

**Goal**: Personalize book content based on user's technical background and expertise level.

**Independent Test**: Verify that content presentation varies based on user's provided background.

**Acceptance Scenarios**:
1. **Given** a user with beginner background, **When** they view content, **Then** explanations are more detailed and examples are simpler.
2. **Given** a user with advanced background, **When** they view content, **Then** explanations are more concise and examples are more complex.

### Implementation for User Story 4

- [x] T028 [P] [US4] Implement personalization level determination service in backend/src/auth/services/personalization_service.py
- [x] T029 [P] [US4] Create user profile API endpoint for personalization data in backend/src/auth/api/profile_routes.py
- [x] T030 [P] [US4] Create frontend hooks for personalization in frontend/src/hooks/usePersonalization.js
- [x] T031 [P] [US4] Implement content adaptation logic based on personalization level
- [x] T032 [US4] Integrate personalization with Docusaurus content rendering

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Persistence, logging, security, and error handling.

- [ ] T033 [P] Implement user data retention policy in backend/src/auth/services/data_retention_service.py
- [ ] T034 [P] Add comprehensive error handling and logging for auth flows
- [ ] T035 [P] Add input validation and sanitization for all auth endpoints
- [ ] T036 [P] Implement security headers and CSRF protection
- [ ] T037 [P] Add rate limiting for authentication endpoints
- [ ] T038 [P] Create auth-related skills in .claude/skills/ (betterauth-jwt-setup, user-background-collection, personalization-level-definition, jwt-token-management, user-profile-storage, betterauth-jwt)

---

## Dependencies & Execution Order

### Phase Dependencies
1. **Phase 1 & 2** are strictly required before US1.
2. **US1 (MVP)** must be functional before US2 is added.
3. **US2** can be developed in parallel with US3.
4. **US4** depends on the foundational auth system but can be implemented after core authentication.

### Parallel Opportunities
- T001, T002, T003, T004 can run in parallel (Backend setup).
- T005, T006, T007, T008, T009 can run in parallel (Foundational services).
- US2 and US3 can be worked on in parallel once US1 core API is stable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Initialize BetterAuth, database, and models.
2. Build basic registration with background collection.
3. Store user profiles with background information.
4. Pulse-check: Verify user registration and background data storage.

### Incremental Delivery
1. Deploy US1 (Registration with background collection).
2. Layer on US2 (Secure authentication).
3. Add US3 (JWT token management).
4. Finish with US4 (Content personalization).