### Inventory Service (inventory_db)

**Purpose**: batches, stock levels, movements (audit), expiry tracking.

**ER summary:**
- batches holds per-batch quantities and expiry
- stock_levels materialized view / cache per product-variant per branch (can be computed)
- inventory_movements append-only ledger of adjustments

```sql
CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id UUID NOT NULL, -- NOT FK to allow eventual schema decoupling (optionally add FK)
  batch_number TEXT,
  supplier_lot TEXT,
  branch_id UUID NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  cost_price NUMERIC(12,2),
  mrp NUMERIC(12,2),
  expiry_date DATE,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- append-only ledger of all inbound/outbound adjustments
CREATE TABLE inventory_movements (
  id BIGSERIAL PRIMARY KEY,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  product_variant_id UUID NOT NULL,
  branch_id UUID NOT NULL,
  movement_type TEXT NOT NULL, -- IN, OUT, ADJUSTMENT, TRANSFER
  qty INT NOT NULL,
  reason TEXT,
  reference_id UUID, -- e.g., sale_id or purchase_id
  performed_by UUID, -- user id
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- per-branch per-product materialized stock (can be maintained by worker)
CREATE TABLE stock_levels (
  product_variant_id UUID NOT NULL,
  branch_id UUID NOT NULL,
  qty INT NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(product_variant_id, branch_id)
);

-- Indexes
CREATE INDEX idx_batches_variant_branch ON batches(product_variant_id, branch_id);
CREATE INDEX idx_movements_variant ON inventory_movements(product_variant_id);
CREATE INDEX idx_movements_ref ON inventory_movements(reference_id);


```

**Consistency note:** when decrementing stock for a sale, use SELECT ... FOR UPDATE on batch rows (or use DB transaction + row lock) to prevent oversell. Alternatively, use Redis for reservation locks then commit to DB.