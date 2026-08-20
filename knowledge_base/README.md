# ItihAI Knowledge Base

This directory is the verified repository of Indian heritage, architectural details, historical timelines, cultural traditions, and authoritative sources compiled for the **ItihAI** platform.

---

## 🏛️ Purpose & Scope
Foreign tourists visiting India often encounter conflicting, over-simplified, or fragmented historical information. The ItihAI knowledge base provides:
1. **Verified Archaeological & Historical Records**: Sourced strictly from the Archaeological Survey of India (ASI), UNESCO World Heritage Centre, Ministry of Culture (Govt. of India), and official state tourism archives.
2. **Cultural Etiquette & Local Traditions**: Respectful guidance on monument customs, temple protocols, dressing guidelines, photography rules, and regional rituals.
3. **Architectural Analysis**: Rigorous architectural breakdowns detailing construction periods, design traditions (Mughal, Kalinga, Dravidian, Nagara, Bengal Terracotta, Rock-Cut), and engineering feats.
4. **Verified Authoritative Sources**: Clear citations and attribution documented in [`sources/sources.md`](file:///c:/Users/nikhi/OneDrive/Documents/Projects/ItihAI/knowledge_base/sources/sources.md).

---

## 📂 Knowledge Base Structure

```text
knowledge_base/
├── README.md
├── heritage/
│   ├── taj_mahal.md
│   ├── red_fort.md
│   ├── qutub_minar.md
│   ├── konark_sun_temple.md
│   ├── victoria_memorial.md
│   ├── bishnupur_temples.md
│   ├── sanchi_stupa.md
│   ├── ajanta_caves.md
│   ├── ellora_caves.md
│   ├── hampi.md
│   ├── fatehpur_sikri.md
│   └── mahabodhi_temple.md
└── sources/
    └── sources.md
```

---

## 📑 Structured Document Schema
Each heritage document follows an identical markdown structure designed for high semantic cohesion:

- `# Heritage Site`
- `## Overview`
- `## Historical Background`
- `## Cultural Significance`
- `## Architecture`
- `## Important Facts`
- `## Local Traditions`
- `## Nearby Attractions`
- `## Visitor Information`
- `## Sources`

---

## 🔄 Relationship to Future AI / RAG Phases
- **Phase 4 (Current)**: Data collection, standardization, verification, database persistence, and REST APIs. **No RAG ingestion or LLM invocation is performed in Phase 4.**
- **Phase 6 (Future)**: Documents in this directory will be automatically parsed, section-chunked, vectorized via embedding models, and stored in vector indexes for semantic context retrieval.
