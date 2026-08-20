# ITIH-AI (इतिहास)

> **"Understand the language, discover the culture"**

---

## 📖 Project Overview

**ItihAI** is an AI-Guided Multilingual Heritage Tour platform designed to transform how international and domestic tourists experience India's rich cultural landmarks, ancient monuments, traditions, and diverse languages.

The platform provides verified archaeological information, dynamic search and filtering, architectural analysis, cultural etiquette guidelines, and localized insights powered by **Google Gemini LLM** and PostgreSQL.

---

## 🛠️ Technology Stack

| Layer                         | Technologies                                                                            |
| :---------------------------- | :-------------------------------------------------------------------------------------- |
| **Frontend**                  | React.js, Vite, JavaScript, HTML5, Vanilla CSS3 (Design Tokens), React Router           |
| **Backend**                   | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, Pydantic-Settings                          |
| **Database**                  | PostgreSQL 16, SQLAlchemy 2.0, Psycopg 3                                                |
| **AI Guide (Phase 5)**        | Google GenAI Python SDK (`google-genai`), Gemini 2.5 Flash (`gemini-3.6-flash`)         |
| **Knowledge Base**            | Structured Markdown archives sourced from Archaeological Survey of India (ASI) & UNESCO |
| **RAG Retrieval _(Phase 6)_** | Semantic Embeddings & Vector Search (Planned for Phase 6)                               |
| **Translation _(Phase 7)_**   | Multilingual Translation Engine                                                         |
| **Voice / Audio _(Phase 8)_** | Text-to-Speech (TTS), Speech-to-Text (STT)                                              |
| **DevOps**                    | Docker, Docker Compose, Environment Isolation                                           |

---

## 📁 Project Structure

```text
ItihAI/
├── frontend/                     # React + Vite Frontend Application
│   ├── public/
│   │   └── images/heritage/      # Verified local heritage photographs & SOURCES.md
│   ├── src/
│   │   ├── components/           # Reusable UI components (HeritageCard, FilterBar, ChatMessage, etc.)
│   │   ├── pages/                # Application pages (Home, Explore, HeritageDetail, AiGuide, Languages, About)
│   │   ├── layouts/              # Header, Footer, Tour Layouts
│   │   ├── services/             # API service layer (api.js)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── context/              # Language and Tour context providers
│   │   ├── data/                 # Fallback data & language catalogs
│   │   ├── App.jsx               # React Router configuration
│   │   └── main.jsx              # React DOM entry point
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
│
├── backend/                      # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                  # API routes and dependency injection
│   │   │   ├── routes/           # health, heritage, languages, culture, ai
│   │   │   └── dependencies.py   # FastAPI dependency providers
│   │   ├── core/                 # App configuration and security helpers
│   │   │   └── config.py         # Pydantic Settings & environment loader
│   │   ├── database/             # PostgreSQL database layer
│   │   │   ├── database.py       # SQLAlchemy engine and sessionmaker
│   │   │   ├── models.py         # ORM models (HeritageSite, Language)
│   │   │   └── init_db.py        # Database schema initialization & dataset
│   │   ├── schemas/              # Pydantic validation schemas (ai, heritage, language, health)
│   │   ├── services/             # AI Service Layer (ai_service.py with Gemini integration)
│   │   └── main.py               # FastAPI application entrypoint
│   ├── scripts/
│   │   └── seed_data.py          # Idempotent database seeding script
│   ├── tests/                    # Automated test suites (test_phase3.py, test_phase4.py, test_phase5.py)
│   ├── requirements.txt          # Python dependencies (including google-genai)
│   └── .env                      # Local environment configuration
│
├── knowledge_base/               # Verified heritage knowledge documents
│   ├── README.md                 # Knowledge Base overview & RAG schema
│   ├── heritage/                 # Structured markdown for 12+ landmarks
│   └── sources/
│       └── sources.md            # Official archaeological citations (ASI, UNESCO)
│
├── docs/                         # Architecture and technical documentation
│   └── architecture.md
│
├── .gitignore                    # Git ignore rules
├── README.md                     # Root project guide
└── docker-compose.yml            # Multi-container orchestration
```

---

## ⚡ Quick Start & Development Workflow

### 1. Backend Setup & Gemini Configuration

From the `backend/` directory:

```powershell
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure backend environment in backend/.env:
# DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/itihai
# GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-3.6-flash

# 3. Seed PostgreSQL database with verified heritage landmarks & languages
python scripts/seed_data.py

# 4. Start the FastAPI development server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup

From the `frontend/` directory:

```powershell
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🤖 Phase 5 AI Guide REST API

### Chat with ItihAI Cultural Guide

- **Endpoint**: `POST /api/ai/chat`
- **Description**: Generates culturally authentic, historically conservative narration via Google Gemini LLM, with optional PostgreSQL landmark grounding.

#### Request Schema (`AIChatRequest`):

```json
{
  "message": "Why was the Taj Mahal built and what are its architectural highlights?",
  "language": "en",
  "heritage_site_id": 1
}
```

#### Response Schema (`AIChatResponse`):

```json
{
  "response": "The Taj Mahal was commissioned in 1632 by Mughal Emperor Shah Jahan to house the tomb of his beloved wife Mumtaz Mahal on the southern bank of the Yamuna River in Agra...",
  "language": "en",
  "heritage_site_name": "Taj Mahal"
}
```

#### Supported Languages:

- `en`: English
- `hi`: Hindi (हिंदी)
- `bn`: Bengali (বাংলা)

---

## 🧪 Testing

Run all automated unit tests across all completed phases:

```powershell
cd backend
python -m unittest discover tests
```

---

## 🗺️ Development Phases Roadmap

- [x] **PHASE 1**: Core project foundation, architecture & FastAPI backend _(Completed)_
- [x] **PHASE 2**: React frontend UI scaffold & tour discovery interface _(Completed)_
- [x] **PHASE 3**: PostgreSQL database configuration & ORM models _(Completed)_
- [x] **PHASE 4**: Heritage data layer, Knowledge Base, & REST APIs _(Completed)_
- [x] **PHASE 5**: Google Gemini LLM integration with contextual cultural prompting _(Completed)_
- [ ] **PHASE 6**: RAG knowledge retrieval pipeline over Indian heritage archives _(Next Phase)_
- [ ] **PHASE 7**: Multilingual translation engine
- [ ] **PHASE 8**: Voice engine (STT & TTS)
- [ ] **PHASE 9**: Security hardening, rate limiting, and performance tuning
- [ ] **PHASE 10**: Docker containerization & Cloud Deployment
