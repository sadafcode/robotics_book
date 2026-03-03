# API Contract: Authentication Service

**Version**: 1.0.0
**Base Path**: `/api/v1/auth`

## 1. Authentication Endpoints

### `POST /auth/register`
Registers a new user and collects their background information for personalization.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "background": {
    "software_experience": {
      "programming_languages": ["Python", "C++"],
      "experience_years": 3,
      "frameworks": ["ROS 2", "TensorFlow"]
    },
    "hardware_experience": {
      "electronics_experience": "intermediate",
      "robotics_experience": "beginner",
      "platforms": ["Arduino", "Raspberry Pi"]
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user_id": "uuid-v4",
  "personalization_level": "intermediate"
}
```

### `POST /auth/login`
Authenticates a user and returns a JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user_id": "uuid-v4",
  "personalization_level": "intermediate"
}
```

### `GET /auth/profile`
Retrieves the authenticated user's profile and personalization settings.

**Response**:
```json
{
  "user_id": "uuid-v4",
  "email": "user@example.com",
  "name": "John Doe",
  "personalization_level": "intermediate",
  "background": {
    "software_experience": {
      "programming_languages": ["Python", "C++"],
      "experience_years": 3,
      "frameworks": ["ROS 2", "TensorFlow"]
    },
    "hardware_experience": {
      "electronics_experience": "intermediate",
      "robotics_experience": "beginner",
      "platforms": ["Arduino", "Raspberry Pi"]
    }
  }
}
```

### `PUT /auth/profile`
Updates the user's profile and background information.

**Request Body**:
```json
{
  "background": {
    "software_experience": {
      "programming_languages": ["Python", "C++", "Go"],
      "experience_years": 4,
      "frameworks": ["ROS 2", "TensorFlow", "PyTorch"]
    },
    "hardware_experience": {
      "electronics_experience": "advanced",
      "robotics_experience": "intermediate",
      "platforms": ["Arduino", "Raspberry Pi", "NVIDIA Jetson"]
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "personalization_level": "advanced"
}
```

## 2. Error Codes

| Code | Status | Description |
|------|--------|-------------|
| **AUTH-400** | 400 | Invalid request (e.g., missing fields, malformed JSON) |
| **AUTH-401** | 401 | Unauthorized (invalid credentials) |
| **AUTH-409** | 409 | Conflict (e.g., email already exists) |
| **AUTH-500** | 500 | Internal server error |