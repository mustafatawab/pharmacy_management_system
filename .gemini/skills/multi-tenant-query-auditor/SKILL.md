---
name: multi-tenant-query-auditor
description: Reviews FastAPI backend services/routers to ensure database queries include tenant_id filtering for row-level isolation. Use when writing, modifying, or auditing CRUD operations in a multi-tenant system to prevent data leakage.
---

# Multi-Tenant Query Auditor

This skill provides a structured workflow to audit SQLModel/SQLAlchemy queries for proper tenant isolation.

## Audit Workflow

When auditing or writing backend code in `backend/service/` or `backend/routers/`, follow these steps:

1. **Identify Database Operations**: Locate all instances of `select()`, `update()`, `delete()`, and `insert()`.
2. **Check the Model**: Verify if the model being queried (e.g., `Product`, `Supplier`, `Category`) contains a `tenant_id` field.
3. **Analyze the Query**:
    - **Read (Select)**: Ensure the query includes `.where(Model.tenant_id == tenant_id)`.
    - **Write (Update/Delete)**: Ensure the query includes `.where(Model.tenant_id == tenant_id)` to prevent cross-tenant modifications.
    - **Create (Insert)**: Ensure the `tenant_id` is explicitly set to the current tenant's ID before saving.
4. **Source of Truth**: Verify that the `tenant_id` used in filters is derived from a trusted source, typically the `current_user` dependency or a validated request header.

## Secure Coding Guidelines

Refer to [references/patterns.md](references/patterns.md) for a comparison of unsafe and safe query patterns.

### Key Checklist
- [ ] Does every query on a multi-tenant model filter by `tenant_id`?
- [ ] Is the `tenant_id` passed from the router layer down to the service layer?
- [ ] Are there any queries that use `.all()` or `.exec()` without a `where()` clause on the tenant?

## When to Flag a Potential Leak
- If a query retrieves a single record by `id` only (e.g., `select(Product).where(Product.id == 1)`).
- If an update or delete operation does not include a `tenant_id` filter.
- If a service method lacks a `tenant_id` parameter when dealing with tenant-owned data.
