"""
Live PostgreSQL API Verification Script.
Tests all FastAPI endpoints against running uvicorn server or local database session.
"""

import sys
import os
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def run_checks():
    print("--- LIVE POSTGRESQL & REST API VERIFICATION ---")

    # 1. Health
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. GET /api/health -> 200 OK")

    # 2. Filters
    res = client.get("/api/heritage/filters")
    assert res.status_code == 200, f"Filters endpoint failed: {res.status_code}"
    f_data = res.json()
    print(f"[PASS] 2. GET /api/heritage/filters -> {len(f_data['states'])} states, {len(f_data['regions'])} regions, {len(f_data['heritage_types'])} categories")

    # 3. Paginated listing
    res = client.get("/api/heritage?page=1&limit=6")
    assert res.status_code == 200, f"Listing failed: {res.status_code}"
    p_data = res.json()
    assert p_data["total"] >= 12, f"Expected at least 12 heritage sites, got {p_data['total']}"
    print(f"[PASS] 3. GET /api/heritage?page=1&limit=6 -> {len(p_data['items'])} items returned (total={p_data['total']}, pages={p_data['total_pages']})")

    # 4. Search query
    res = client.get("/api/heritage?search=delhi")
    assert res.status_code == 200
    s_data = res.json()
    print(f"[PASS] 4. GET /api/heritage?search=delhi -> found {s_data['total']} sites: {[s['name'] for s in s_data['items']]}")

    # 5. State filter
    res = client.get("/api/heritage?state=West%20Bengal")
    assert res.status_code == 200
    wb_data = res.json()
    print(f"[PASS] 5. GET /api/heritage?state=West Bengal -> found {wb_data['total']} sites: {[s['name'] for s in wb_data['items']]}")

    # 6. Category filter
    res = client.get("/api/heritage?heritage_type=UNESCO%20World%20Heritage")
    assert res.status_code == 200
    u_data = res.json()
    print(f"[PASS] 6. GET /api/heritage?heritage_type=UNESCO -> found {u_data['total']} UNESCO sites")

    # 7. Slug lookup
    res = client.get("/api/heritage/slug/taj-mahal")
    assert res.status_code == 200
    tm_data = res.json()
    assert tm_data["name"] == "Taj Mahal"
    print(f"[PASS] 7. GET /api/heritage/slug/taj-mahal -> {tm_data['name']} (State: {tm_data['state']}, Region: {tm_data['region']})")

    # 8. ID lookup
    res = client.get("/api/heritage/1")
    assert res.status_code == 200
    print(f"[PASS] 8. GET /api/heritage/1 -> {res.json()['name']}")

    # 9. 404 validation
    res = client.get("/api/heritage/slug/not-a-real-place-999")
    assert res.status_code == 404
    print("[PASS] 9. GET /api/heritage/slug/not-a-real-place-999 -> 404 Not Found")

    # 10. Languages endpoint
    res = client.get("/api/languages")
    assert res.status_code == 200
    l_data = res.json()
    print(f"[PASS] 10. GET /api/languages -> {len(l_data)} supported languages")

    print("\n[+] ALL 10 LIVE POSTGRESQL API CHECKS PASSED SUCCESSFULLY!\n")

if __name__ == "__main__":
    run_checks()
