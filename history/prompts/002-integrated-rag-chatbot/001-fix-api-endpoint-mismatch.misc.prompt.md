# PHR Template

## Metadata

- **ID**: PHR-001
- **Title**: Fix API endpoint mismatch
- **Stage**: misc
- **Date**: 2026-01-05
- **Surface**: agent
- **Model**: claude-sonnet-4-5-20250929
- **Feature**: 002-integrated-rag-chatbot
- **Branch**: 002-integrated-rag-chatbot
- **User**: User
- **Command**: fix the API endpoint mismatch
- **Labels**: ["frontend", "api", "bugfix"]
- **Links**: null
- **Files**:
  - frontend/src/components/ChatWidget.tsx
  - frontend/src/components/SummaryButton.tsx
- **Tests**: []

## Prompt Text

fix the API endpoint mismatch

## Response Text

Fixed API endpoint paths in frontend to match backend routes:
- ChatWidget.tsx:135: `/api/chat/completions` → `/api/v1/chat/completions`
- SummaryButton.tsx:17: `/api/chat/summarize` → `/api/v1/chat/summarize`

Backend FastAPI routes use prefix `/api/v1`, so frontend calls now correctly route to the backend.
