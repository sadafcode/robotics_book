# Data Model: BetterAuth JWT Authentication

## Overview

This document defines the user authentication and personalization data entities for the BetterAuth integration.

---

## 1. User Profile Entities (Neon Postgres)

Used for storing user authentication data and background information for personalization.

### Table: `users`
| Field | Type | Description |
|-------|------|-------------|
| **id** | UUID (PK) | Unique identifier for the user |
| **email** | string | User's email address (unique) |
| **name** | string | User's display name |
| **created_at** | timestamp | Account creation time |
| **updated_at** | timestamp | Last update time |

### Table: `user_profiles`
| Field | Type | Description |
|-------|------|-------------|
| **user_id** | UUID (FK) | Reference to the user |
| **software_experience** | JSON | User's software background information |
| **hardware_experience** | JSON | User's hardware background information |
| **personalization_level** | string | Tier (beginner/intermediate/advanced) |
| **preferences** | JSON | User's content preferences |
| **created_at** | timestamp | Profile creation time |
| **updated_at** | timestamp | Last profile update |

### Table: `auth_sessions`
| Field | Type | Description |
|-------|------|-------------|
| **session_id** | string (PK) | JWT session identifier |
| **user_id** | UUID (FK) | Reference to the user |
| **expires_at** | timestamp | Session expiration time |
| **created_at** | timestamp | Session creation time |

## 2. Personalization Data Structure

### software_experience JSON structure:
```json
{
  "programming_languages": ["Python", "C++", "JavaScript"],
  "experience_years": 5,
  "frameworks": ["ROS 2", "TensorFlow", "PyTorch"],
  "domain_knowledge": ["AI", "Robotics", "Control Systems"]
}
```

### hardware_experience JSON structure:
```json
{
  "electronics_experience": "intermediate",
  "robotics_experience": "advanced",
  "mechanical_engineering": "beginner",
  "specific_platforms": ["Arduino", "Raspberry Pi", "NVIDIA Jetson"]
}
```

---

## 3. Validation Rules

1. **Email Uniqueness**: Each email must be unique in the users table.
2. **Profile Completeness**: User profiles must contain at least basic background information to enable personalization.
3. **Session Expiration**: Auth sessions must have a reasonable expiration time (e.g., 24 hours).
4. **Data Privacy**: Background information must be stored in compliance with privacy regulations.

---

## 4. State Transitions

1. **Registration**: User provides email/password → User account created → Background information collected → Profile created with personalization level determined.
2. **Authentication**: User signs in → JWT token generated → Session created → Personalization level applied to content delivery.
3. **Profile Update**: User updates background → Profile updated → Personalization level recalculated → Content delivery adjusted.

---

**Design Status**: ✅ COMPLETE - Proceed to Contracts.