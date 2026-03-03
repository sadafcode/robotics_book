# Argos Translation Setup Guide

## Overview
Using **Argos Translate** - a completely free, open-source, offline translation library.

## Features
- **100% Free**: No API keys, no usage limits
- **Offline**: Works without internet
- **Privacy**: Your data never leaves your computer
- **Open Source**: Community maintained

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Download Language Models

```bash
cd backend
python -m scripts.install_translation_models
```

This downloads the English → Urdu translation model.

### 3. Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

### 4. Test the Translation API

```bash
# Check status
curl http://localhost:8000/api/v1/translation/status

# Translate text
curl -X POST http://localhost:8000/api/v1/translation/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?", "target_language": "ur"}'
```

## How It Works

1. **Frontend** → Calls backend API at `/api/v1/translation/translate`
2. **Backend** → Uses Argos Translate (offline, no external API calls)
3. **Argos** → Runs local ML models to translate text
4. **Response** → Returns translated text to frontend

## Fallback Behavior

If Argos is not available:
- Common terms show pre-defined Urdu translations
- Other text shows `[اردو]` prefix as indicator
- No external API calls are made

## Troubleshooting

### "No languages installed"
Run the install script again:
```bash
python -m scripts.install_translation_models
```

### Slow first translation
The first translation may take 5-10 seconds as models load into memory. Subsequent translations are much faster.

### Quality concerns
Argos Translate quality is decent for basic sentences but may not match GPT-4. For better quality, consider Google Cloud or OpenAI as paid alternatives.

## File Structure

```
backend/
├── services/
│   └── translation.py         # Argos service wrapper
├── scripts/
│   └── install_translation_models.py  # Model downloader
├── main.py                    # API endpoints
└── requirements.txt           # argostranslate dependency
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/translation/status` | GET | Check service availability |
| `/api/v1/translation/translate` | POST | Translate text to Urdu |

### Request Format
```json
{
  "text": "Hello world",
  "target_language": "ur"
}
```

### Response Format
```json
{
  "translated_text": "ہیلو ورلڈ",
  "original_text": "Hello world",
  "target_language": "ur"
}
```
