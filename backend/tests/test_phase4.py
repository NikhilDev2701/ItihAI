"""
Phase 4 Heritage Data, Filters, & Search API Test Suite for ItihAI.
Comprehensive automated test coverage for:
- Extended HeritageSite SQLAlchemy models
- Dynamic filter endpoint (/api/heritage/filters)
- Search across multiple text fields (case-insensitive)
- Multi-criteria combinable filtering (state, region, category, period)
- Strict pagination validation and response schemas
- Slug and ID-based detailed lookups
- Error handling (404 for missing records, 422 for invalid pagination)
- Seed data idempotency and language listing
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


class TestPhase4HeritageAPIs(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create an in-memory SQLite database for deterministic automated testing
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

        # Seed initial Phase 4 verified dataset
        session = cls.TestingSessionLocal()
        try:
            init_db(session, target_engine=cls.test_engine)
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

    def test_02_get_dynamic_filters(self):
        response = self.client.get("/api/heritage/filters")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("states", data)
        self.assertIn("regions", data)
        self.assertIn("heritage_types", data)
        self.assertIn("historical_periods", data)

        self.assertIn("Uttar Pradesh", data["states"])
        self.assertIn("West Bengal", data["states"])
        self.assertIn("North India", data["regions"])
        self.assertIn("East India", data["regions"])
        self.assertIn("UNESCO World Heritage", data["heritage_types"])

    def test_03_paginated_heritage_listing(self):
        response = self.client.get("/api/heritage?page=1&limit=6")
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("items", data)
        self.assertIn("page", data)
        self.assertIn("limit", data)
        self.assertIn("total", data)
        self.assertIn("total_pages", data)

        self.assertEqual(data["page"], 1)
        self.assertEqual(data["limit"], 6)
        self.assertEqual(len(data["items"]), 6)
        self.assertGreaterEqual(data["total"], 12)
        self.assertGreaterEqual(data["total_pages"], 2)

        # Verify full schema attributes on item
        first_item = data["items"][0]
        self.assertIn("name", first_item)
        self.assertIn("slug", first_item)
        self.assertIn("location", first_item)
        self.assertIn("state", first_item)
        self.assertIn("region", first_item)
        self.assertIn("description", first_item)
        self.assertIn("image_url", first_item)
        self.assertIn("interesting_facts", first_item)
        self.assertIn("local_traditions", first_item)
        self.assertIn("nearby_attractions", first_item)
        self.assertIn("visitor_information", first_item)

    def test_04_search_by_monument_name(self):
        response = self.client.get("/api/heritage?search=taj")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 1)
        names = [s["name"] for s in data["items"]]
        self.assertTrue(any("Taj Mahal" in n for n in names))

    def test_05_search_by_location_city(self):
        response = self.client.get("/api/heritage?search=delhi")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 2)
        names = [s["name"] for s in data["items"]]
        self.assertTrue(any("Red Fort" in n for n in names))
        self.assertTrue(any("Qutub Minar" in n for n in names))

    def test_06_filter_by_state(self):
        response = self.client.get("/api/heritage?state=West%20Bengal")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 2)
        names = [s["name"] for s in data["items"]]
        self.assertTrue(any("Victoria Memorial" in n for n in names))
        self.assertTrue(any("Bishnupur" in n for n in names))

    def test_07_filter_by_region(self):
        response = self.client.get("/api/heritage?region=South%20India")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 1)
        names = [s["name"] for s in data["items"]]
        self.assertTrue(any("Hampi" in n for n in names))

    def test_08_filter_by_heritage_type(self):
        response = self.client.get("/api/heritage?heritage_type=Caves%20%26%20Rock-Cut")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 2)
        names = [s["name"] for s in data["items"]]
        self.assertTrue(any("Ajanta Caves" in n for n in names))
        self.assertTrue(any("Ellora Caves" in n for n in names))

    def test_09_combined_filters(self):
        response = self.client.get("/api/heritage?region=East%20India&heritage_type=Temples%20%26%20Spiritual")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertGreaterEqual(data["total"], 2)
        names = [s["name"] for s in data["items"]]
        self.assertTrue(any("Konark Sun Temple" in n for n in names))
        self.assertTrue(any("Bishnupur" in n for n in names))

    def test_10_get_by_explicit_slug(self):
        response = self.client.get("/api/heritage/slug/taj-mahal")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], "Taj Mahal")
        self.assertEqual(data["state"], "Uttar Pradesh")
        self.assertEqual(data["region"], "North India")
        self.assertIsInstance(data["interesting_facts"], list)
        self.assertIsInstance(data["local_traditions"], list)
        self.assertIsInstance(data["nearby_attractions"], list)
        self.assertIsInstance(data["visitor_information"], dict)

    def test_11_get_by_id_or_slug(self):
        # By ID
        res_id = self.client.get("/api/heritage/1")
        self.assertEqual(res_id.status_code, 200)
        self.assertEqual(res_id.json()["id"], 1)

        # By slug
        res_slug = self.client.get("/api/heritage/konark-sun-temple")
        self.assertEqual(res_slug.status_code, 200)
        self.assertEqual(res_slug.json()["slug"], "konark-sun-temple")

    def test_12_non_existent_slug_returns_404(self):
        response = self.client.get("/api/heritage/slug/unknown-monument-xyz")
        self.assertEqual(response.status_code, 404)
        self.assertIn("not found", response.json()["detail"].lower())

    def test_13_pagination_validation_error(self):
        # Page < 1 should fail validation
        res_bad_page = self.client.get("/api/heritage?page=0")
        self.assertEqual(res_bad_page.status_code, 422)

        # Limit > 50 should fail validation
        res_bad_limit = self.client.get("/api/heritage?limit=999")
        self.assertEqual(res_bad_limit.status_code, 422)

    def test_14_get_languages(self):
        response = self.client.get("/api/languages")
        self.assertEqual(response.status_code, 200)
        langs = response.json()
        self.assertEqual(len(langs), 8)
        codes = [l["code"] for l in langs]
        self.assertIn("en", codes)
        self.assertIn("hi", codes)
        self.assertIn("bn", codes)

    def test_15_seed_idempotency(self):
        session = self.TestingSessionLocal()
        try:
            # Running init_db multiple times should not create duplicate rows
            init_db(session, target_engine=self.test_engine)
            init_db(session, target_engine=self.test_engine)
            total_sites = session.query(HeritageSite).count()
            total_langs = session.query(Language).count()
            self.assertEqual(total_sites, 13)
            self.assertEqual(total_langs, 8)
        finally:
            session.close()


if __name__ == "__main__":
    unittest.main()
