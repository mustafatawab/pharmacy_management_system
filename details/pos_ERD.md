### Sales / POS Service (sales_db)
**Purpose:** transactional sales, refunds, payments, invoices.

**ER summary:**
- sales (orders/invoices)
- sale_items (line items linked to batch chosen)
- payments
- refunds


```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  branch_id UUID,
  invoice_no TEXT NOT NULL UNIQUE,
  patient_id UUID,
  prescription_id UUID,
  total_amount NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending/paid/refunded
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL,
  batch_id UUID, -- which batch was used (for traceability)
  qty INT NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  method TEXT NOT NULL, -- CASH, CARD, ONLINE
  amount NUMERIC(12,2) NOT NULL,
  provider_ref TEXT, -- external gateway reference
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  reason TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_sales_branch_date ON sales(branch_id, created_at);
CREATE INDEX idx_sale_items_product ON sale_items(product_variant_id);


```