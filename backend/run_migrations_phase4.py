import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL must be set in .env")

# Convert asyncpg scheme to psycopg2 compatible
if DATABASE_URL.startswith("postgresql+asyncpg://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")

def run_migrations():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cursor = conn.cursor()

    migrations = [
        # 1. StockTransfer Tables
        """
        CREATE TABLE IF NOT EXISTS stocktransfer (
            id SERIAL PRIMARY KEY,
            from_tenant_id INTEGER NOT NULL REFERENCES tenant(id),
            to_tenant_id INTEGER NOT NULL REFERENCES tenant(id),
            status VARCHAR NOT NULL DEFAULT 'pending',
            notes VARCHAR,
            created_by UUID NOT NULL REFERENCES "user"(id),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS stocktransferitem (
            id SERIAL PRIMARY KEY,
            transfer_id INTEGER NOT NULL REFERENCES stocktransfer(id),
            medicine_barcode VARCHAR NOT NULL,
            medicine_name VARCHAR NOT NULL,
            quantity INTEGER NOT NULL
        );
        """,
        # 2. Insurance Tables
        """
        CREATE TABLE IF NOT EXISTS insurancepanel (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL,
            discount_percentage FLOAT NOT NULL DEFAULT 0.0,
            receivable_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            tenant_id INTEGER NOT NULL REFERENCES tenant(id),
            created_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS insuranceledger (
            id SERIAL PRIMARY KEY,
            panel_id INTEGER NOT NULL REFERENCES insurancepanel(id),
            reference_type VARCHAR NOT NULL,
            reference_id INTEGER,
            debit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            credit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            balance_after NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
            tenant_id INTEGER NOT NULL REFERENCES tenant(id),
            notes VARCHAR,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL
        );
        """,
        # 3. Add Insurance Fields to Sale Table
        """
        ALTER TABLE sale
        ADD COLUMN IF NOT EXISTS insurance_panel_id INTEGER REFERENCES insurancepanel(id),
        ADD COLUMN IF NOT EXISTS insurance_amount NUMERIC(15, 2),
        ADD COLUMN IF NOT EXISTS patient_copay NUMERIC(15, 2);
        """
    ]

    print("Running Phase 4 Migrations...")
    for idx, query in enumerate(migrations):
        print(f"Executing migration {idx+1}/{len(migrations)}...")
        try:
            cursor.execute(query)
            print(f"Success.")
        except Exception as e:
            print(f"Error executing migration {idx+1}: {e}")

    cursor.close()
    conn.close()
    print("Phase 4 Migrations Complete!")

if __name__ == "__main__":
    run_migrations()
