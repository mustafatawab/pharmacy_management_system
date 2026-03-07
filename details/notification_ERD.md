### Notification Service (notification_db)

**Purpose:** track jobs/messages sent, templates, queue status.

**ER summary:**
- templates
- messages (records of notifications)
- message_logs (delivery status)

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE,
  channel TEXT, -- email/sms/whatsapp
  subject TEXT,
  body TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  channel TEXT,
  to_address TEXT,
  template_id UUID REFERENCES templates(id),
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'queued', -- queued/sent/failed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE message_logs (
  id BIGSERIAL PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  provider_response JSONB,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_status ON messages(status);

```