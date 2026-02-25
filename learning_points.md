DB Shema

```
users
medicines
medicine_batches
sales
sale_items
suppliers
purchases
purchase_items
inventory_movements
customers (optional)
```

### 🧠 What is Relationship()?

`Relationship()` is an ORM-level link between Python objects.

It does NOT create the foreign key.
The `Field(foreign_key="...")` already does that.

`Relationship()` tells the ORM:

> "When I load this object, how can I navigate to related objects?"
