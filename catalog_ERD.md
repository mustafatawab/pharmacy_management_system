### Product Catalog Service (catalog_db)

**Purpose**: medicine master data, SKUs, pricing, category taxonomy.

**ER summary:**
- products (medicine master)
- product_variants (strength/form/pack sizes)
- brands, categories, tags
- product_prices (time-based prices / multi-tenant / branch specific overrides)



```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID, -- optional multi-tenant
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  generic_name TEXT,
  brand_id UUID REFERENCES brands(id),
  description TEXT,
  unit TEXT, -- e.g., "tablet", "ml"
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_code TEXT, -- e.g., "500mg", "10ml"
  form TEXT, -- "tablet", "syrup"
  pack_size INT,
  gtin TEXT, -- bar code
  UNIQUE(product_id, variant_code)
);

CREATE TABLE product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  branch_id UUID, -- null = global
  price NUMERIC(12,2) NOT NULL,
  cost_price NUMERIC(12,2),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  effective_to TIMESTAMPTZ
);

-- Indexes for search & common lookups
CREATE INDEX idx_products_name ON products USING gin (to_tsvector('simple', name || ' ' || coalesce(generic_name, '')));
CREATE INDEX idx_variant_gtin ON product_variants(gtin);

```