from fastapi import Depends, HTTPException, status
from sqlmodel import SQLModel, select, Session
from auth.dependency import get_session
from schemas.supplier_shema import SupplierCreate, SupplierRead, SuppplierUpdate
from models.supplier import Supplier as SupplierModel
from uuid import UUID, uuid4

class SupplierService:
    def __init__(self):
        pass

    def check_supplier_by_email(self, email: str, session: Session, tenant_id: int):
        supplier = session.exec(select(SupplierModel).where(
            SupplierModel.email == email,
            SupplierModel.tenant_id == tenant_id
        )).first()

        if supplier:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exist for supplier in this pharmacy")
        
        return supplier

    def check_supplier_by_phone(self, phone: str, session: Session, tenant_id: int):
        supplier = session.exec(select(SupplierModel).where(
            SupplierModel.phone == phone,
            SupplierModel.tenant_id == tenant_id
        )).first()
        
        if supplier:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already exist for supplier in this pharmacy")

        return supplier

    def get_supplier_by_id(self, id: UUID, session: Session, tenant_id: int):
        supplier = session.exec(select(SupplierModel).where(
            SupplierModel.id == id,
            SupplierModel.tenant_id == tenant_id
        )).first()

        if not supplier:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier not found")

        return supplier

    def get_all_suppliers(self, session: Session, tenant_id: int) -> list[SupplierModel]:
        suppliers = session.exec(select(SupplierModel).where(SupplierModel.tenant_id == tenant_id)).all()
        return suppliers

    def create_supplier(self, supplier: SupplierCreate, session: Session, tenant_id: int):
        self.check_supplier_by_email(supplier.email, session=session, tenant_id=tenant_id)
        self.check_supplier_by_phone(supplier.phone, session=session, tenant_id=tenant_id)

        new_supplier = SupplierModel(**supplier.model_dump(), tenant_id=tenant_id)

        session.add(new_supplier)
        session.commit()
        session.refresh(new_supplier)
        return new_supplier

    def update_supplier(self, id: UUID, supplier_data: SuppplierUpdate, session: Session, tenant_id: int):
        existing_supplier = self.get_supplier_by_id(id=id, session=session, tenant_id=tenant_id)

        update_data = supplier_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing_supplier, key, value)

        session.add(existing_supplier)
        session.commit()
        session.refresh(existing_supplier)

        return existing_supplier

    def delete_supplier(self, id: UUID, session: Session, tenant_id: int):
        existing_supplier = self.get_supplier_by_id(id=id, session=session, tenant_id=tenant_id)

        session.delete(existing_supplier)
        session.commit()

        return {"message": f"{existing_supplier.company_name} has been deleted successfully"}


        

                