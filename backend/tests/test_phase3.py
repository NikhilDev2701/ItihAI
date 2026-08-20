"""
Phase 3 Database & API Test Suite for ItihAI.
Verifies SQLAlchemy models, non-destructive database initialization, and FastAPI REST endpoints.
"""

import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database.database import Base, get_db
from app.database.models import HeritageSite, Language
from app.database.init_db import init_db
from app.main import app


class TestPhase3DatabaseAndAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.test_engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        cls.TestingSessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=cls.test_engine,
        )
        Base.metadata.create_all(bind=cls.test_engine)

        # Seed data safely
        session = cls.TestingSessionLocal()
        try:
            init_db(session)
        finally:
            session.close()

        def override_get_db():
            db = cls.TestingSessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=cls.test_engine)

    def test_01_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
        self.assertEqual(data["service"], "ItihAI API")

    def test_02_get_all_heritage_sites(self):
        response = self.client.get("/api/heritage")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        sites = data.get("items", data) if isinstance(data, dict) else data
        self.assertGreaterEqual(len(sites), 6)

        site_names = [s["name"] for s in sites]
        self.assertIn("Taj Mahal", site_names)
        self.assertIn("Red Fort (Lal Qila)", site_names)
        self.assertIn("Qutub Minar", site_names)
        self.assertIn("Konark Sun Temple", site_names)
        self.assertIn("Victoria Memorial", site_names)
        self.assertIn("Bishnupur Terracotta Temples", site_names)

        # Verify essential fields
        for site in sites:
            self.assertIsNotNone(site["id"])
            self.assertIsNotNone(site["name"])
            self.assertIsNotNone(site["slug"])
            self.assertIsNotNone(site["location"])
            self.assertIsNotNone(site["state"])
            self.assertIsNotNone(site["country"])
            self.assertIsNotNone(site["description"])
            self.assertIsNotNone(site["image_url"])
            self.assertIsNotNone(site["created_at"])
            self.assertIsNotNone(site["updated_at"])

    def test_03_get_heritage_site_by_id(self):
        response = self.client.get("/api/heritage/1")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], 1)
        self.assertEqual(data["name"], "Taj Mahal")
        self.assertEqual(data["slug"], "taj-mahal")
        self.assertEqual(data["state"], "Uttar Pradesh")

    def test_04_get_heritage_site_by_slug(self):
        response = self.client.get("/api/heritage/konark-sun-temple")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "Konark Sun Temple")
        self.assertEqual(data["state"], "Odisha")

    def test_05_get_heritage_site_not_found(self):
        response = self.client.get("/api/heritage/non-existent-site-999")
        self.assertEqual(response.status_code, 404)
        data = response.json()
        self.assertIn("not found", data["detail"].lower())

    def test_06_heritage_search_filter(self):
        response = self.client.get("/api/heritage?search=marble")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        results = data.get("items", data) if isinstance(data, dict) else data
        names = [s["name"] for s in results]
        self.assertIn("Taj Mahal", names)

    def test_07_heritage_state_filter(self):
        response = self.client.get("/api/heritage?state=Odisha")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        results = data.get("items", data) if isinstance(data, dict) else data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["name"], "Konark Sun Temple")

    def test_08_get_languages(self):
        response = self.client.get("/api/languages")
        self.assertEqual(response.status_code, 200)
        languages = response.json()
        self.assertEqual(len(languages), 8)

        codes = [l["code"] for l in languages]
        self.assertIn("en", codes)
        self.assertIn("fr", codes)
        self.assertIn("de", codes)
        self.assertIn("es", codes)
        self.assertIn("ja", codes)
        self.assertIn("it", codes)
        self.assertIn("hi", codes)
        self.assertIn("bn", codes)

        # Verify fields
        for lang in languages:
            self.assertIsNotNone(lang["id"])
            self.assertIsNotNone(lang["code"])
            self.assertIsNotNone(lang["name"])
            self.assertIsNotNone(lang["native_name"])
            self.assertTrue(lang["is_active"])

    def test_09_non_destructive_reinitialization(self):
        # Run init_db again to confirm idempotency (no duplicate entries)
        session = self.TestingSessionLocal()
        try:
            init_db(session, target_engine=self.test_engine)
            total_sites = session.query(HeritageSite).count()
            total_langs = session.query(Language).count()
            self.assertEqual(total_sites, 13)
            self.assertEqual(total_langs, 8)
        finally:
            session.close()


if __name__ == "__main__":
    unittest.main()

