import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    exit(1)

# Connect to the PostgreSQL database
try:
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    print("Running Phase 2 Migrations...")

    # 1. Update supplier table
    try:
        cursor.execute("ALTER TABLE supplier ADD COLUMN outstanding_balance NUMERIC DEFAULT 0.00;")
        print("✅ Added 'outstanding_balance' to supplier")
    except psycopg2.errors.DuplicateColumn:
        print("⏭️ 'outstanding_balance' already exists in supplier")

    # 2. Update medicine table
    try:
        cursor.execute("ALTER TABLE medicine ADD COLUMN generic_salt VARCHAR(255);")
        print("✅ Added 'generic_salt' to medicine")
    except psycopg2.errors.DuplicateColumn:
        print("⏭️ 'generic_salt' already exists in medicine")

    try:
        cursor.execute("ALTER TABLE medicine ADD COLUMN reorder_level INTEGER NOT NULL DEFAULT 0;")
        print("✅ Added 'reorder_level' to medicine")
    except psycopg2.errors.DuplicateColumn:
        print("⏭️ 'reorder_level' already exists in medicine")

    try:
        cursor.execute("ALTER TABLE medicine ADD COLUMN target_max_stock INTEGER NOT NULL DEFAULT 0;")
        print("✅ Added 'target_max_stock' to medicine")
    except psycopg2.errors.DuplicateColumn:
        print("⏭️ 'target_max_stock' already exists in medicine")

    # 3. Update purchase table
    try:
        cursor.execute("ALTER TABLE purchase ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Completed';")
        print("✅ Added 'status' to purchase")
    except psycopg2.errors.DuplicateColumn:
        print("⏭️ 'status' already exists in purchase")

    try:
        cursor.execute("ALTER TABLE purchase ADD COLUMN supplier_id UUID REFERENCES supplier(id);")
        print("✅ Added 'supplier_id' to purchase")
    except psycopg2.errors.DuplicateColumn:
        print("⏭️ 'supplier_id' already exists in purchase")

    print("Phase 2 Migrations Completed Successfully!")

except Exception as e:
    print(f"Migration Failed: {e}")
finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()
