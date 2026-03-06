# Multi-Tenant Query Patterns

Use these patterns to ensure data isolation between tenants in SQLModel/SQLAlchemy.

## ❌ Unsafe Patterns (Data Leakage Risk)

These queries are missing the `tenant_id` filter, which could allow one tenant to access or modify another tenant's data.

### Select One
```python
# Returns product even if it belongs to another tenant
statement = select(Product).where(Product.id == product_id)
product = session.exec(statement).first()
```

### Select All
```python
# Returns all products from all pharmacies
statement = select(Product)
products = session.exec(statement).all()
```

### Update/Delete
```python
# Could update a product belonging to a different tenant
statement = update(Product).where(Product.id == product_id).values(name="New Name")
session.exec(statement)
```

## ✅ Safe Patterns (Row-Level Isolation)

Always include the `tenant_id` filter in every query.

### Select One
```python
# Correctly scoped to the current tenant
statement = select(Product).where(
    Product.id == product_id, 
    Product.tenant_id == current_tenant_id
)
product = session.exec(statement).first()
```

### Select All
```python
# Returns only products for the current pharmacy
statement = select(Product).where(Product.tenant_id == current_tenant_id)
products = session.exec(statement).all()
```

### Update/Delete
```python
# Guarantees isolation during modification
statement = update(Product).where(
    Product.id == product_id, 
    Product.tenant_id == current_tenant_id
).values(name="New Name")
session.exec(statement)
```

## 🛡️ Recommended Practice: Context-Aware Services

Pass the `tenant_id` into your service methods from the FastAPI dependency:

```python
async def get_product(db: Session, product_id: int, tenant_id: int):
    statement = select(Product).where(
        Product.id == product_id, 
        Product.tenant_id == tenant_id
    )
    return db.exec(statement).first()
```
