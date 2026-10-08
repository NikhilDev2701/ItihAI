"""
Dedicated Database Seeding Script for ItihAI.
Populates PostgreSQL with verified Indian heritage monuments and supported languages.
Safe, idempotent, and non-destructive.
"""

import sys
import os
from pathlib import Path

# Ensure backend root directory is in sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.database.init_db import init_db

if __name__ == "__main__":
    print("=" * 60)
    print("   ItihAI - Heritage Database Seeding (Phase 4)")
    print("=" * 60)
    try:
        init_db()
        print("\n[+] Database seeded and verified successfully.done")
    except Exception as exc:
        print(f"\n[-] Seeding failed: {exc}", file=sys.stderr)
        sys.exit(1)
