# Chatbot Integration Template

A reusable template for deploying AI customer support chatbots.

## Architecture

```
[Website/App] ──→ [Chatbot Frontend (React)]
                      │
                      ▼
               [API Gateway (FastAPI/Express)]
                      │
              ┌───────┴───────┐
              ▼               ▼
        [LLM API]      [Vector DB]
        (OpenAI)       (Knowledge Base)
```

## Quick Start

### 1. Backend API

```python
# api/server.py — FastAPI example
from fastapi import FastAPI
from openai import OpenAI

app = FastAPI()
client = OpenAI()

@app.post("/chat")
async def chat(message: str, session_id: str = None):
    # 1. Retrieve relevant context from vector DB
    context = search_knowledge_base(message)
    
    # 2. Build prompt with context
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": f"Context: {context}"},
            {"role": "user", "content": message}
        ]
    )
    
    return {"reply": response.choices[0].message.content}
```

### 2. Frontend Component

Copy the `ChatbotDemo.jsx` from the demo project (`src/pages/demos/ChatbotDemo.jsx`) as a starting point.

### 3. Knowledge Base Setup

```python
# kb/embed.py — Vector index setup
from openai import OpenAI
import chromadb

client = OpenAI()
chroma_client = chromadb.Client()
collection = chroma_client.create_collection("knowledge-base")

def index_document(text: str, doc_id: str):
    embedding = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    collection.add(
        embeddings=[embedding.data[0].embedding],
        documents=[text],
        ids=[doc_id]
    )
```

## Configuration

| Variable | Description | Required |
|---|---|---|
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `KNOWLEDGE_BASE_PATH` | Path to training documents | Yes |
| `MAX_TOKENS` | Max response length (default: 200) | No |
| `TEMPERATURE` | Response creativity (default: 0.7) | No |

## Analytics Events

Track these events for ROI reporting:
- `chat_started` — Session begins
- `message_sent` — User sends a message
- `bot_response` — AI responds
- `escalated` — Transferred to human agent
- `resolved` — Issue marked resolved
- `satisfaction_rating` — User rates the interaction

## Deployment Checklist

- [ ] Set up OpenAI API key (server-side, never in frontend)
- [ ] Train knowledge base on your documentation/FAQs
- [ ] Configure escalation rules (when to transfer to human)
- [ ] Add chat widget to client website/app
- [ ] Set up analytics tracking
- [ ] Test with real customer queries
- [ ] Monitor and refine prompt engineering