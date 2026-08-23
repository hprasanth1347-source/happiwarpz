import sqlite3
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from app.config import settings
from app.database.database import engine, Base
from app.database import models

DB_PATH = settings.DATABASE_URL.replace("sqlite:///", "")

def apply_migrations():
    print(f"Applying SQLite schema migrations to {DB_PATH}...")
    
    # 1. Create missing tables
    Base.metadata.create_all(bind=engine)

    # 2. Add missing columns to users table safely
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(users)")
    existing_columns = [row[1] for row in cursor.fetchall()]

    new_columns = [
        ("email_verified", "BOOLEAN DEFAULT 0"),
        ("phone_verified", "BOOLEAN DEFAULT 0"),
        ("profile_image", "TEXT"),
        ("last_login_at", "DATETIME")
    ]

    for col_name, col_type in new_columns:
        if col_name not in existing_columns:
            print(f"Adding column '{col_name}' to 'users' table...")
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")

    conn.commit()
    conn.close()
    print("Database schema migration complete!")

if __name__ == "__main__":
    apply_migrations()
