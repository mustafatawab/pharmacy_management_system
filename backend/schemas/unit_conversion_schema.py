from pydantic import BaseModel, Field
from typing import Optional


class UnitConversionCreate(BaseModel):
    """Define one level of the unit hierarchy for a medicine."""
    from_unit: str = Field(..., max_length=50, description="Larger unit, e.g. 'box'")
    to_unit: str = Field(..., max_length=50, description="Smaller unit, e.g. 'strip'")
    factor: int = Field(..., gt=0, description="How many to_unit are in one from_unit")


class UnitConversionRead(UnitConversionCreate):
    id: int
    medicine_id: int
    tenant_id: int

    class Config:
        from_attributes = True


class ResolvedQuantity(BaseModel):
    """Response from the resolve endpoint showing base-unit equivalents."""
    medicine_id: int
    original_quantity: int
    original_unit: str
    base_quantity: int       # Quantity after converting to base unit
    base_unit: str
