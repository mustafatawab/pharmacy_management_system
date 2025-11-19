### Purchase & Supplier Service (purchase_db)

**Purpose:** suppliers, purchase orders (PO), receipts (GRN), returns.

**ER summary:**
- suppliers
- purchase_orders
- purchase_order_items
- goods_receipt_notes (GRN)


```sql

CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact JSONB,
  tax_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  po_no TEXT NOT NULL UNIQUE,
  branch_id UUID,
  status TEXT NOT NULL DEFAULT 'draft', -- draft/placed/received/cancelled
  total_amount NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_variant_id UUID,
  qty INT NOT NULL,
  unit_cost NUMERIC(12,2)
);

CREATE TABLE goods_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
  grn_no TEXT NOT NULL UNIQUE,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE TABLE goods_receipt_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goods_receipt_id UUID NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
  product_variant_id UUID,
  batch_number TEXT,
  qty INT,
  cost_price NUMERIC(12,2),
  expiry_date DATE
);

```