from sqlmodel import Session, select
from fastapi import HTTPException
from models.unit_conversion import UnitConversion
from models.medicine import Medicine
from schemas.unit_conversion_schema import UnitConversionCreate
from models.users import User
from typing import List


class UnitConversionService:

    def get_conversions_for_medicine(
        self, medicine_id: int, session: Session, current_user: User
    ) -> List[UnitConversion]:
        return list(
            session.exec(
                select(UnitConversion).where(
                    UnitConversion.medicine_id == medicine_id,
                    UnitConversion.tenant_id == current_user.tenant_id,
                )
            ).all()
        )

    def create_conversion(
        self,
        medicine_id: int,
        data: UnitConversionCreate,
        session: Session,
        current_user: User,
    ) -> UnitConversion:
        # Validate medicine belongs to this tenant
        medicine = session.exec(
            select(Medicine).where(
                Medicine.id == medicine_id,
                Medicine.tenant_id == current_user.tenant_id,
            )
        ).first()
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")

        # Prevent duplicate from_unit for same medicine
        existing = session.exec(
            select(UnitConversion).where(
                UnitConversion.medicine_id == medicine_id,
                UnitConversion.from_unit == data.from_unit,
                UnitConversion.tenant_id == current_user.tenant_id,
            )
        ).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Conversion from '{data.from_unit}' already defined for this medicine.",
            )

        conversion = UnitConversion(
            medicine_id=medicine_id,
            from_unit=data.from_unit,
            to_unit=data.to_unit,
            factor=data.factor,
            tenant_id=current_user.tenant_id,
        )
        session.add(conversion)
        session.commit()
        session.refresh(conversion)
        return conversion

    def delete_conversion(
        self, conversion_id: int, session: Session, current_user: User
    ) -> None:
        conversion = session.exec(
            select(UnitConversion).where(
                UnitConversion.id == conversion_id,
                UnitConversion.tenant_id == current_user.tenant_id,
            )
        ).first()
        if not conversion:
            raise HTTPException(status_code=404, detail="Unit conversion not found")
        session.delete(conversion)
        session.commit()

    def resolve_to_base_units(
        self,
        medicine_id: int,
        quantity: int,
        unit: str,
        session: Session,
        current_user: User,
    ) -> int:
        """
        Convert a given quantity expressed in `unit` to the base unit quantity.

        Example chain:  box → strip (factor=10) → tablet (factor=10)
        resolve("box", 2) → 2 * 10 * 10 = 200 tablets

        If `unit` matches the medicine's base_unit (or no conversions defined),
        returns quantity unchanged.
        """
        medicine = session.exec(
            select(Medicine).where(
                Medicine.id == medicine_id,
                Medicine.tenant_id == current_user.tenant_id,
            )
        ).first()
        if not medicine:
            raise HTTPException(status_code=404, detail="Medicine not found")

        # Already in base unit
        if unit == medicine.base_unit:
            return quantity

        conversions = self.get_conversions_for_medicine(medicine_id, session, current_user)
        # Build a lookup: from_unit → (to_unit, factor)
        conv_map = {c.from_unit: (c.to_unit, c.factor) for c in conversions}

        current_unit = unit
        base_quantity = quantity
        visited: set[str] = set()

        while current_unit != medicine.base_unit:
            if current_unit in visited:
                raise HTTPException(
                    status_code=400,
                    detail=f"Circular unit conversion detected for unit '{current_unit}'",
                )
            if current_unit not in conv_map:
                raise HTTPException(
                    status_code=400,
                    detail=f"No conversion defined from unit '{current_unit}' for medicine '{medicine.name}'",
                )
            visited.add(current_unit)
            to_unit, factor = conv_map[current_unit]
            base_quantity *= factor
            current_unit = to_unit

        return base_quantity
