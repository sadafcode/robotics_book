# API Contract: RAG Chatbot Service

**Version**: 1.0.0
**Base Path**: `/api/v1`

## 1. Chat Endpoints

### `POST /chat/completions`
Generates a RAG-based response to a user query.

**Request Body**:
```json
{
  "message": "How do I create a ROS 2 publisher?",
  "session_id": "uuid-v4",
  "selected_text": "class MinimalPublisher(Node):...",
  "stream": true
}
```

**Response**:
```json
{
  "content": "To create a publisher in ROS 2, you need to use...",
  "sources": [{"title": "ROS 2 Fundamentals", "url": "/docs/ros2/basics", "relevance_score": 0.85}],
  "session_id": "uuid-v4"
}
```

### `POST /chat/summarize`
Generates a summary for a specific chapter.

**Request Body**:
```json
{
  "chapter_id": "ros2-fundamentals"
}
```

**Response**:
```json
{
  "summary": "This chapter covers the core concepts of ROS 2...",
  "key_takeaways": ["Nodes", "Topics", "Messages"]
}
```

## 2. Indexing Endpoints (Internal)

### `POST /index/chapter`
Triggers chunking and embedding for a specific markdown file.

**Request Body**:
```json
{
  "file_path": "docs/intro.md"
}
```

**Response**:
```json
{
  "status": "success",
  "chunks_indexed": 12,
  "collection": "physical_ai_book_chunks"
}
```

## 3. Error Codes

| Code | Status | Description |
|------|--------|-------------|
| **RAG-404** | 404 | Chapter or context not found in index |
| **RAG-503** | 503 | Vector database or OpenAI API is unavailable |
| **RAG-400** | 400 | Invalid request (e.g., missing session_id) |
