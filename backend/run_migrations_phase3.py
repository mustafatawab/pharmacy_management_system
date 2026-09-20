import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def run_migrations():
    print("Starting Phase 3 Migrations...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()

        # 1. Update users role mapping
        print("Modifying UserRole enum and users table...")
        
        # We need to map 'staff' to 'manager' or 'cashier'. 
        # PostgreSQL enums are tricky to alter. We can add values.
        try:
            cursor.execute("ALTER TYPE userrole ADD VALUE 'manager';")
        except psycopg2.errors.DuplicateObject:
            pass
            
        try:
            cursor.execute("ALTER TYPE userrole ADD VALUE 'cashier';")
        except psycopg2.errors.DuplicateObject:
            pass
            
        # Update existing staff to manager
        cursor.execute("UPDATE \"user\" SET role = 'manager' WHERE role = 'staff';")
        # Change column default
        cursor.execute("ALTER TABLE \"user\" ALTER COLUMN role SET DEFAULT 'manager';")

        # 2. Add Phase 3 fields to medicine
        print("Adding narcotic and prescription fields to medicine...")
        try:
            cursor.execute("ALTER TABLE medicine ADD COLUMN is_narcotic BOOLEAN DEFAULT FALSE;")
        except psycopg2.errors.DuplicateColumn:
            pass

        try:
            cursor.execute("ALTER TABLE medicine ADD COLUMN prescription_required BOOLEAN DEFAULT FALSE;")
        except psycopg2.errors.DuplicateColumn:
            pass

        # 3. Add Phase 3 fields to sale
        print("Adding customer and prescription fields to sale...")
        try:
            cursor.execute("ALTER TABLE sale ADD COLUMN customer_id INTEGER REFERENCES customer(id);")
        except (psycopg2.errors.DuplicateColumn, psycopg2.errors.UndefinedTable):
            # customer table might not exist yet if SQLModel hasn't created it.
            # We'll rely on SQLModel to create the tables first, then run this.
            pass

        try:
            cursor.execute("ALTER TABLE sale ADD COLUMN prescription_no VARCHAR(255);")
        except psycopg2.errors.DuplicateColumn:
            pass

        try:
            cursor.execute("ALTER TABLE sale ADD COLUMN doctor_name VARCHAR(255);")
        except psycopg2.errors.DuplicateColumn:
            pass

        print("Phase 3 Migrations Completed Successfully!")
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("NOTE: You must start the server ONCE before running this script so SQLModel creates the new tables (Customer, CustomerLedger, RefillReminder).")
    print("Press Enter to continue if tables are created, or Ctrl+C to abort.")
    input()
    run_migrations()
    
    # Run the customer foreign key separately in case it failed earlier due to table not existing
    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.autocommit = True
        cursor = conn.cursor()
        cursor.execute("ALTER TABLE sale ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customer(id);")
        print("Customer FK added successfully.")
    except Exception as e:
        print(f"Customer FK check: {e}")
