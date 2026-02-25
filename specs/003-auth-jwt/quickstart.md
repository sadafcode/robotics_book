# Quickstart: BetterAuth JWT Authentication

## Prerequisites
- **Node.js 18+** installed
- **Python 3.11+** installed
- **BetterAuth API Key** (for authentication)
- **Neon Postgres Connection String** (for user profiles)

## Backend Setup (FastAPI)
1. Install dependencies: `pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] psycopg2-binary`
2. Configure `.env` with your BetterAuth and database credentials.
3. Run the server: `uvicorn main:app --reload`

## Frontend Setup (Docusaurus)
1. Install BetterAuth: `npm install @better-auth/react @better-auth/node`
2. Add the authentication provider to your Docusaurus app.
3. Configure the authentication context to collect user background information during registration.

## Authentication Flow
1. User registers with email/password
2. User provides software and hardware background information
3. System determines personalization level based on background
4. JWT token is generated and stored in session
5. Personalization preferences are applied to content delivery

## User Background Collection
During registration, users will be asked to provide:
- Programming languages and experience level
- Hardware and robotics experience
- Frameworks and tools familiarity
- Specific domains of expertise

## Personalization Implementation
The system will use collected background information to:
- Adjust content complexity
- Customize examples and code snippets
- Provide appropriate learning paths
- Tailor explanations to user's expertise level