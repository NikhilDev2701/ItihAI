"""
RAG (Retrieval-Augmented Generation) Service Interface.
Manages retrieval of verified historical & architectural facts.
"""

from typing import List, Dict, Any, Optional


class RAGService:
    """
    Service interface for knowledge retrieval against heritage documents.
    Vector store & embeddings retrieval will be implemented in Phase 6.
    """

    async def retrieve_relevant_context(
        self,
        query: str,
        site_slug: Optional[str] = None,
        top_k: int = 3,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves top_k relevant excerpts from the verified heritage knowledge base.
        (Placeholder for Phase 1).
        """
        return [
            {
                "id": "kb-mock-001",
                "site": site_slug or "General Indian Heritage",
                "title": "Historical Context Overview",
                "excerpt": f"Verified factual data matching '{query}'",
                "source": "Archaeological Survey of India Archives",
                "score": 0.95,
            }
        ]


rag_service = RAGService()
