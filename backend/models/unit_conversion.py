from sqlmodel import SQLModel, Field
from typing import Optional


class UnitConversion(SQLModel, table=True):
    """
    Defines a unit-of-measure hierarchy for a medicine.

    Example:
        medicine_id=1, from_unit="box", to_unit="strip", factor=10
        medicine_id=1, from_unit="strip", to_unit="tablet", factor=10
        → 1 box = 10 strips = 100 tablets

    `base_unit` is stored on the Medicine model itself (e.g. "tablet").
    The chain of UnitConversion rows describes how larger units convert DOWN
    toward the base unit.
    """

    id: int | None = Field(default=None, primary_key=True)

    medicine_id: int = Field(index=True, foreign_key="medicine.id")

    # The larger unit (e.g. "box", "strip")
    from_unit: str = Field(max_length=50)

    # The next smaller unit in the hierarchy (e.g. "strip", "tablet")
    to_unit: str = Field(max_length=50)

    # How many `to_unit` are in one `from_unit`
    factor: int = Field(gt=0, description="Number of to_unit in one from_unit")

    tenant_id: int = Field(index=True, foreign_key="tenant.id")
