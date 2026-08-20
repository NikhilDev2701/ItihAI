# ItihAI - System Architecture

> _"Understand the language, discover the culture"_

---

## 🗺️ High-Level System Architecture (Phase 5 Active)

ItihAI is structured as a modular, decoupled full-stack platform designed to deliver low-latency cultural guidance, verified historical discovery, and multilingual experiences for international tourists exploring India.

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│         (Vite, React Router, Audio Player, Tour UI)         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON (VITE_API_BASE_URL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Core                     │
│    (CORS, Input Validation, Pagination, Pydantic Schemas)   │
└───────┬──────────────────────┬──────────────────────┬───────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  PostgreSQL  │       │  AI Service  │       │ Translation  │
│ (Heritage DB │       │ (Google GenAI│       │  & Voice     │
│ & Languages) │       │   Gemini)    │       │(FUTURE PH 7/8│
└───────┬──────┘       └──────┬───────┘       └──────────────┘
        │                     │
        └──────────┬──────────┘
                   │
                   ▼ (Landmark Grounding)
         [ POST /api/ai/chat ]
                   │
                   ▼
┌─────────────────────────────────────┐
│    Future Phase 6 RAG Retrieval     │
│   (Vector DB, Embeddings, Hybrid)   │
└─────────────────────────────────────┘
```

---

## 🔄 AI Guide Query Lifecycle (Phase 5 Active Architecture)

```
[ Tourist Query (English, Hindi, Bengali) ]
                   │
                   ▼
       [ 1. React AI Guide (`AiGuide.jsx`) ]
       (Captures message, selected language, and optional monument context)
                   │
                   ▼
       [ 2. Frontend API Service (`api.js`) ]
       (POST `/api/ai/chat` with `{ message, language, heritage_site_id }`)
                   │
                   ▼
       [ 3. FastAPI Route Handler (`ai.py`) ]
       (Validates request payload, validates language code `en|hi|bn`)
                   │
                   ▼
       [ 4. PostgreSQL Landmark Grounding (Optional) ]
       (If `heritage_site_id` is supplied, fetches verified landmark attributes:
        overview, architecture, facts, traditions, visiting guidelines)
                   │
                   ▼
       [ 5. Gemini AI Service (`ai_service.py`) ]
       (Constructs ItihAI cultural guide system prompt, calls `google-genai` SDK)
                   │
                   ▼
       [ 6. Google Gemini LLM (`gemini-3.6-flash`) ]
       (Generates culturally authentic, historically conservative narration)
                   │
                   ▼
       [ 7. Pydantic Response Serialization (`schemas/ai.py`) ]
       (`AIChatResponse` returned to React frontend)
                   │
                   ▼
[ Rendered Interactive Narration in ItihAI Guide Interface ]
```

---

## 🔮 Future Architecture (Phase 6 RAG Integration — Coming Soon)

```
[ Tourist Cultural Inquiry ]
             │
             ▼
[ 1. FastAPI Backend ]
             │
             ▼
[ 2. RAG Retrieval Engine (Phase 6) ]
(Retrieves relevant chunks from `knowledge_base/heritage/` using Vector DB)
             │
             ▼
[ 3. Verified Knowledge Prompt Injection ]
             │
             ▼
[ 4. Google Gemini LLM Generation ]
             │
             ▼
[ 5. Verified & Grounded Tourist Response ]
```

> [!NOTE]
> **Phase Distinction**:
>
> - **Phase 5 (Active)**: Live **Google Gemini LLM** (`google-genai` SDK) connected via FastAPI backend with **structured PostgreSQL landmark grounding** and multilingual responses in English, Hindi, and Bengali.
> - **Phase 6 (Future)**: Vector embeddings, semantic chunking, and RAG retrieval over markdown knowledge bases.
> - **Phase 7–8 (Future)**: Neural machine translation APIs and voice synthesis (STT/TTS).

---

## 📦 Component Overview

### 1. Frontend (React + Vite)

- Accessible, mobile-responsive UI with rich Indian cultural aesthetics (warm saffron, terracotta, gold, deep navy indigo).
- Dynamic monument discovery with real-time search, multi-faceted filtering, pagination, and bookmarks.
- Interactive AI Guide chat interface connected to `POST /api/ai/chat`.

### 2. Backend (FastAPI + Pydantic v2 + google-genai)

- High-throughput asynchronous REST API.
- Endpoints for monument exploration, filter categories, slug lookups, languages, and Gemini AI chat (`/api/ai/chat`).
- Secure API key isolation: `GEMINI_API_KEY` exists strictly on the backend.

### 3. Database Layer (PostgreSQL 16 + SQLAlchemy 2.0)

- Stores monuments metadata, geo-coordinates, visiting rules, ticketing info, interesting facts, and local traditions using native PostgreSQL JSON and indexed varchar columns.
- Non-destructive idempotent seeding via `backend/scripts/seed_data.py`.

### 4. Knowledge Base (`knowledge_base/`)

- Structured Markdown documents for 12+ major Indian heritage sites formatted with standard sections.
- Sourced exclusively from Archaeological Survey of India (ASI) and UNESCO World Heritage records.

---

## 🗺️ Phased Roadmap

- [x] **Phase 1**: Core project foundation and backend architecture _(Completed)_
- [x] **Phase 2**: React frontend UI scaffold & tour discovery interface _(Completed)_
- [x] **Phase 3**: PostgreSQL database configuration & ORM models _(Completed)_
- [x] **Phase 4**: Heritage site data models, Knowledge Base, and REST endpoints _(Completed)_
- [x] **Phase 5**: Google Gemini LLM integration with cultural prompting _(Completed)_
- [ ] **Phase 6**: RAG pipeline & vector search over heritage records _(Next Phase)_
- [ ] **Phase 7**: Multilingual translation engine
- [ ] **Phase 8**: Voice engine (STT & TTS)
- [ ] **Phase 9**: Security hardening, rate limiting, and performance tuning
- [ ] **Phase 10**: Containerization (Docker) & Cloud Deployment
