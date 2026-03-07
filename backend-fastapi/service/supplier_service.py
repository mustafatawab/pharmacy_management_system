from fastapi import Depends, HTTPException, status
from sqlmodel import SQLModel, select, Session
from auth.dependency import get_session
from schemas.supplier_shema import SupplierCreate, SupplierRead, SuppplierUpdate
from models.supplier import Supplier as SupplierModel
from uuid import UUID, uuid4

class SupplierService:

    def __init__(self):
        pass



    
    def check_supplier_by_email(self,  email: str , session: Session = Depends(get_session)):
        supplier = session.exec(select(SupplierModel).where(SupplierModel.email == email)).first()

        if supplier:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exist for supplier")
        
        return supplier


    
    def check_supplier_by_phone(self, phone: str , session: Session = Depends(get_session)):
        supplier = session.exec(select(SupplierModel).where(SupplierModel.phone == phone)).first()
        
        if supplier:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Phone already exist for supplier")

        return supplier

    
    def check_supplier_by_id(self, id: UUID, session: Session = Depends(get_session)):

        supplier = session.exec(select(SupplierModel).where(SupplierModel.id == id)).first()

        if supplier:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail="Supplier not found")

        return supplier
    

    def get_all_suppliers(self, session : Session = Depends(get_session)) -> list[SupplierRead]:

        suppliers = session.exec(select(SupplierModel)).all()

        return suppliers


    def create_supplier(self, supplier: SupplierCreate, session: Session = Depends(get_session)):

        self.check_supplier_by_email(supplier.email, session=session)
        self.check_supplier_by_phone(supplier.phone, session=session)

        new_supplier = SupplierModel(**supplier.model_dump())

        session.add(new_supplier)
        session.commit()
        session.refresh(new_supplier)
        return new_supplier
    

    def update_supplier(self, id: UUID, supplier : SuppplierUpdate, session: Session = Depends(get_session)):

        exisiting_supplier = self.check_supplier_by_id(id=id, session=session)

        exisiting_supplier.email = supplier.email or exisiting_supplier.email
        exisiting_supplier.phone = supplier.phone or exisiting_supplier.phone
        exisiting_supplier.address = supplier.address or exisiting_supplier.address
        exisiting_supplier.company_name = supplier.company_name or exisiting_supplier.company_name
        exisiting_supplier.contact_person = supplier.contact_person or exisiting_supplier.contact_person

        session.add(exisiting_supplier)
        session.commit()
        session.refresh(exisiting_supplier)

        return exisiting_supplier

    

    def delete_supplier(self, id: UUID, session : Session = Depends(get_session)):

        existing_supplier = self.check_supplier_by_id(id=id, session=session)

        session.delete(existing_supplier)
        session.commit()

        return {"message" : f"{existing_supplier.company_name} has been deleted successfully"}


        

                