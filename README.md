---
title: Physical AI Backend
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Physical AI & Humanoid Robotics Book

An interactive educational platform for learning Physical AI and Humanoid Robotics. Built with Docusaurus for the book content, a FastAPI RAG chatbot backend, and JWT authentication.

## What's Inside

### Book Content (13 Chapters)
- **Module 1 — ROS 2**: Architecture, Publishers/Subscribers, Services/Actions
- **Module 2 — Simulation**: Gazebo, Isaac Sim, Simulation Basics
- **Module 3 — Humanoid Control**: Kinematics, Locomotion, Balance & WBC
- **Module 4 — VLA**: Introduction, OpenVLA Models, Future of VLA

### RAG Chatbot
A floating chat widget on every page that answers questions about the book using Retrieval-Augmented Generation:
- Select text on any page for context-aware questions
- Retrieves relevant book chunks via Qdrant vector search
- Generates answers with GPT-4o and cites source chapters
- Logs conversations to Neon Postgres

### Authentication
- JWT-based signup/login via BetterAuth
- User profile with technical background tracking
- Content personalization based on expertise level

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Docusaurus v3, React 18, TypeScript |
| Chat Backend | FastAPI, Python 3.12 |
| AI | OpenAI text-embedding-3-small + GPT-4o |
| Vector DB | Qdrant Cloud (cosine similarity) |
| Database | Neon Postgres (async SQLAlchemy + asyncpg) |
| Auth | BetterAuth with JWT |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

## Project Structure

```
├── docs/                        # Book content (Markdown)
│   ├── intro.md
│   ├── module-1-ros2/
│   ├── module-2-simulation/
│   ├── module-3-humanoid-control/
│   └── module-4-vla/
├── src/                         # Docusaurus frontend
│   ├── theme/ChatWidget.tsx     # RAG chat widget
│   ├── auth/                    # BetterAuth config
│   ├── components/              # React components
│   └── pages/                   # Login, Signup pages
├── backend/                     # FastAPI RAG backend
│   ├── main.py                  # App + POST /api/v1/chat/completions
│   ├── config.py                # pydantic-settings env config
│   ├── models/
│   │   ├── database.py          # Async SQLAlchemy engine
│   │   └── chat_log.py          # ChatSession, ChatMessage, MessageSource
│   ├── services/
│   │   ├── chunker.py           # Markdown → semantic chunks
│   │   ├── embedder.py          # OpenAI embeddings
│   │   ├── retriever.py         # Qdrant vector search
│   │   └── generator.py         # GPT-4o RAG generation
│   └── scripts/
│       └── index_book.py        # Index book content into Qdrant
├── specs/                       # Feature specifications (SDD)
├── history/                     # Prompt history & ADRs
├── auth-server.js               # BetterAuth server (port 3001)
├── docusaurus.config.ts         # Site configuration
└── .env                         # API keys (not committed)
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API key
- Qdrant Cloud account (free tier works)
- Neon Postgres database

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### 2. Configure environment

Add to `.env` in the project root:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
OPENAI_API_KEY=sk-proj-...
QDRANT_URL=https://your-cluster.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-key
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3001
```

### 3. Index book content

```bash
cd backend
python -m scripts.index_book
```

This chunks all 13 markdown chapters, embeds them with OpenAI, and upserts ~178 vectors to Qdrant.

### 4. Start the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

### 5. Start the frontend

```bash
npm start
```

Open http://localhost:3000 — click the chat bubble and ask about ROS 2, humanoid kinematics, or anything in the book.

## API

### `GET /health`
Returns `{"status": "ok"}`.

### `POST /api/v1/chat/completions`

**Request:**
```json
{
  "message": "How does ROS 2 handle communication between nodes?",
  "selected_text": "optional text selected on the page",
  "session_id": "docusaurus-session"
}
```

**Response:**
```json
{
  "content": "ROS 2 uses a publish-subscribe pattern built on DDS...",
  "sources": [
    {
      "title": "The ROS 2 Architecture",
      "heading": "Core Concepts: Nodes and Graph",
      "source_file": "ros2-architecture.md",
      "score": 0.891
    }
  ],
  "session_id": "docusaurus-session"
}
```

## Deployment

The static Docusaurus site deploys to GitHub Pages via GitHub Actions on push to `master`. The backend needs separate hosting (e.g., Railway, Render, or any Python-capable platform).

## License

MIT
