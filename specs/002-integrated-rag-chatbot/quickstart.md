# Quickstart: RAG Chatbot Integration

## Prerequisites
- **Python 3.11+** installed
- **Node.js 18+** installed
- **OpenRouter API Key** (for model access)
- **Qdrant Cloud API Key** and URL
- **Neon Postgres Connection String**

## Backend Setup (FastAPI)
1. Install dependencies: `pip install fastapi uvicorn qdrant-client openai sqlalchemy psycopg2-binary requests`
2. Configure `.env` with your **OpenRouter** and Qdrant keys.
3. Run the server: `uvicorn main:app --reload`

## Frontend Setup (Docusaurus)
1. Install UI components: `npm install lucide-react ai react-markdown`
2. Add the `ChatWidget.tsx` to `src/components`.
3. Wrap the site in `Root.tsx` to ensure the widget appears on every page.

## Indexing Content
To populate the knowledge base, run the indexing script:
`python scripts/index_docs.py`
This will process all files in the `docs/` folder and upload them to Qdrant.

## Using the "Explain Selection" Feature
1. Highlight any text in the book.
2. A small context menu or the chat widget will automatically capture the selection.
3. Ask "Explain this" or "Simplify this" in the chat.
