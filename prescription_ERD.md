### Prescription Service (prescription_db)
Purpose: store prescriptions, items, approvals, OCR results and images.

**ER summary:**
- `prescriptions`
- `prescription_items`
- `prescription_approvals`
- `prescription_images`


```sql
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  patient_id UUID, -- references patient service if cross-db; else store minimal patient copy
  prescriber_name TEXT,
  prescriber_license TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending/approved/rejected
  created_by UUID, -- user who uploaded
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}' -- OCR summary, flags
);

CREATE TABLE prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  product_name TEXT, -- captured string
  product_variant_id UUID, -- optional FK to catalog
  dosage TEXT,
  qty INT,
  instructions TEXT
);

CREATE TABLE prescription_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  approved_by UUID, -- user id
  approved_at TIMESTAMPTZ,
  note TEXT
);

CREATE TABLE prescription_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  s3_key TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_presc_status ON prescriptions(status);


```