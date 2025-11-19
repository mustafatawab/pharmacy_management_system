### Reporting / Analytics (warehouse_db)

**Purpose:** consolidated reporting data (denormalized), BI-friendly tables (populated by ETL from other services).

**ER summary:**
- dim_products, dim_branches, dim_time
- fact_sales, fact_inventory_movements


```sql
CREATE TABLE dim_products (
  product_variant_id UUID PRIMARY KEY,
  sku TEXT,
  name TEXT,
  brand TEXT,
  category TEXT
);

CREATE TABLE dim_branches (
  branch_id UUID PRIMARY KEY,
  name TEXT,
  location JSONB
);

CREATE TABLE dim_time (
  date DATE PRIMARY KEY,
  year INT, month INT, day INT, weekday INT
);

CREATE TABLE fact_sales (
  id UUID PRIMARY KEY,
  product_variant_id UUID REFERENCES dim_products(product_variant_id),
  branch_id UUID REFERENCES dim_branches(branch_id),
  sale_date DATE,
  qty INT,
  revenue NUMERIC(14,2)
);

CREATE TABLE fact_inventory_movements (
  id BIGSERIAL PRIMARY KEY,
  product_variant_id UUID,
  branch_id UUID,
  movement_date DATE,
  movement_type TEXT,
  qty INT
);


```