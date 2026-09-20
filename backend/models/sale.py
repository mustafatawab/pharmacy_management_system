from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from decimal import Decimal
from uuid import UUID

if TYPE_CHECKING:
    from models.tenant import Tenant
    from models.users import User
    from models.medicine import Medicine

class Sale(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    total_amount: Decimal
    discount: Decimal = Field(default=Decimal("0.00"))
    final_amount: Decimal
    payment_method: str = Field(default="cash") # cash, card, mobile_pay, credit
    
    # Phase 3 Fields
    customer_id: int | None = Field(default=None, foreign_key="customer.id")
    prescription_no: str | None = Field(default=None)
    doctor_name: str | None = Field(default=None)
    
    # Phase 4 Fields
    insurance_panel_id: int | None = Field(default=None, foreign_key="insurancepanel.id")
    insurance_amount: Decimal | None = Field(default=None, max_digits=15, decimal_places=2)
    patient_copay: Decimal | None = Field(default=None, max_digits=15, decimal_places=2)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Foreign Keys
    tenant_id: int = Field(index=True, foreign_key="tenant.id")
    user_id: UUID = Field(foreign_key="user.id")
    
    # Relationships
    items: List["SaleItem"] = Relationship(back_populates="sale")

class SaleItem(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    
    sale_id: int = Field(foreign_key="sale.id")
    medicine_id: int = Field(foreign_key="medicine.id")

    # Which batch was used for this sale item (FIFO traceability)
    batch_id: int | None = Field(default=None, foreign_key="productbatch.id")
    
    quantity: int            # Quantity in base units (after unit conversion)
    dispensed_unit: str = Field(default="unit")  # Unit as dispensed at counter (e.g. "strip")
    unit_price: Decimal      # Price per base unit
    total_price: Decimal
    
    # Relationships
    sale: Optional[Sale] = Relationship(back_populates="items")

