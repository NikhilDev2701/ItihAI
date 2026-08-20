"""
Automated Test Suite for Phase 5: Gemini LLM Integration for ItihAI.
Tests schema validation, PostgreSQL context resolution, error handling, and Gemini SDK integration.
"""

import unittest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.database import Base, get_db
from app.database.models import HeritageSite
from app.api.routes.ai import build_heritage_context
from app.services.ai_service import GeminiAIService


class TestPhase5GeminiIntegration(unittest.TestCase):
    """Test cases for Phase 5 Gemini AI Guide integration."""

    @classmethod
    def setUpClass(cls):
        # Create in-memory SQLite database for isolated test execution
        cls.engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        cls.TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=cls.engine)
        Base.metadata.create_all(bind=cls.engine)

        # Seed sample heritage monument
        db = cls.TestingSessionLocal()
        cls.test_site = HeritageSite(
            id=1,
            name="Taj Mahal",
            slug="taj-mahal",
            location="Agra, Uttar Pradesh",
            state="Uttar Pradesh",
            country="India",
            region="North India",
            description="The pinnacle of Mughal architecture.",
            historical_overview="Built by Shah Jahan in 1632 in memory of Mumtaz Mahal.",
            cultural_significance="Enduring symbol of love and UNESCO World Heritage site.",
            architecture="White Makrana marble with Pietra Dura inlays.",
            historical_period="Medieval & Mughal (1200–1750 CE)",
            heritage_type="UNESCO World Heritage",
            image_url="/images/heritage/taj-mahal.jpg",
            interesting_facts=["Changes color from morning to evening", "Symmetrical architecture"],
            local_traditions=[{"title": "Footwear Rule", "description": "Remove footwear on plinth", "tip": "Use shoe covers"}],
            visitor_information={"hours": "Sunrise to sunset", "dressCode": "Modest clothing"},
        )
        db.add(cls.test_site)
        db.commit()
        db.close()

        def override_get_db():
            db_session = cls.TestingSessionLocal()
            try:
                yield db_session
            finally:
                db_session.close()

        app.dependency_overrides[get_db] = override_get_db
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=cls.engine)

    def test_01_empty_message_validation(self):
        """Empty message should return HTTP 422 Unprocessable Entity."""
        res = self.client.post("/api/ai/chat", json={"message": "", "language": "en"})
        self.assertEqual(res.status_code, 422)

    def test_02_whitespace_only_message_validation(self):
        """Whitespace message is rejected or handled cleanly."""
        res = self.client.post("/api/ai/chat", json={"message": "   ", "language": "en"})
        self.assertIn(res.status_code, [200, 422])

    def test_03_invalid_language_code(self):
        """Unsupported language codes should return HTTP 422."""
        res = self.client.post("/api/ai/chat", json={"message": "Hello", "language": "fr"})
        self.assertEqual(res.status_code, 422)

        res2 = self.client.post("/api/ai/chat", json={"message": "Hello", "language": "invalid_code"})
        self.assertEqual(res2.status_code, 422)

    def test_04_valid_supported_languages(self):
        """Supported languages (en, hi, bn) are accepted."""
        for lang in ["en", "hi", "bn"]:
            res = self.client.post("/api/ai/chat", json={"message": "Tell me about Indian monuments", "language": lang})
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json()["language"], lang)

    def test_05_unconfigured_api_key_response(self):
        """When GEMINI_API_KEY is empty, a clean setup message is returned without crashing."""
        with patch("app.core.config.settings.GEMINI_API_KEY", ""):
            res = self.client.post("/api/ai/chat", json={"message": "Why was Taj Mahal built?", "language": "en"})
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("not configured", data["response"])

    def test_06_heritage_site_context_resolution(self):
        """Providing a valid heritage_site_id resolves landmark name and attaches context."""
        res = self.client.post(
            "/api/ai/chat",
            json={"message": "Explain the dome architecture", "language": "en", "heritage_site_id": 1},
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["heritage_site_name"], "Taj Mahal")

    def test_07_invalid_heritage_site_id_returns_404(self):
        """Providing a non-existent heritage_site_id returns HTTP 404."""
        res = self.client.post(
            "/api/ai/chat",
            json={"message": "Explain this", "language": "en", "heritage_site_id": 9999},
        )
        self.assertEqual(res.status_code, 404)
        self.assertIn("not found", res.json()["detail"].lower())

    def test_08_build_heritage_context_formatting(self):
        """Context builder extracts all landmark details correctly."""
        db = self.TestingSessionLocal()
        site = db.query(HeritageSite).filter(HeritageSite.id == 1).first()
        context = build_heritage_context(site)
        db.close()
        self.assertIn("Taj Mahal", context)
        self.assertIn("Agra, Uttar Pradesh", context)
        self.assertIn("Medieval & Mughal", context)
        self.assertIn("Pietra Dura", context)
        self.assertIn("Footwear Rule", context)
        self.assertIn("Sunrise to sunset", context)

    @patch("app.core.config.settings.GEMINI_API_KEY", "AIzaSyFakeKeyForTesting123")
    def test_09_mock_gemini_live_success(self):
        """Simulates successful Gemini generation with google-genai client mock."""
        mock_response = MagicMock()
        mock_response.text = "The Taj Mahal was commissioned by Mughal Emperor Shah Jahan in 1632."

        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response

        service = GeminiAIService()
        service._client = mock_client

        with patch("app.api.routes.ai.ai_service", service):
            res = self.client.post(
                "/api/ai/chat",
                json={"message": "Why was the Taj Mahal built?", "language": "en", "heritage_site_id": 1},
            )
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("Shah Jahan", data["response"])
            self.assertEqual(data["heritage_site_name"], "Taj Mahal")

    @patch("app.core.config.settings.GEMINI_API_KEY", "AIzaSyFakeKeyForTesting123")
    def test_10_mock_gemini_rate_limit_error(self):
        """Tests that rate-limiting from Gemini produces a clean user notice without stack trace leaks."""
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = Exception("429 RESOURCE_EXHAUSTED: Quota exceeded")

        service = GeminiAIService()
        service._client = mock_client

        with patch("app.api.routes.ai.ai_service", service):
            res = self.client.post(
                "/api/ai/chat",
                json={"message": "Hello", "language": "en"},
            )
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("rate limit", data["response"].lower())

    @patch("app.core.config.settings.GEMINI_API_KEY", "AIzaSyFakeKeyForTesting123")
    def test_11_mock_gemini_timeout_error(self):
        """Tests that timeout produces a polite retry message."""
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = Exception("DEADLINE_EXCEEDED: Request timed out")

        service = GeminiAIService()
        service._client = mock_client

        with patch("app.api.routes.ai.ai_service", service):
            res = self.client.post(
                "/api/ai/chat",
                json={"message": "Hello", "language": "en"},
            )
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("timed out", data["response"].lower())


if __name__ == "__main__":
    unittest.main()
