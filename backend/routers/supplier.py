from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from auth.dependency import get_session
from schemas.supplier_shema import SupplierCreate, SupplierRead, SuppplierUpdate
from service.supplier_service import SupplierService
from uuid import UUID

router = APIRouter(prefix="/supplier" , tags=["supplier"])

supplier_service = SupplierService()

@router.get("/" , response_model=list[SupplierRead])
def get_suppliers(session: Session = Depends(get_session)):

    suppliers = supplier_service.get_all_suppliers(session=session)

    return suppliers


@router.post("/" , response_model=SupplierRead)
def create_supplier(supplier : SupplierCreate , session : Session = Depends(get_session)):
    return supplier_service.create_supplier(supplier=supplier , session=session)


@router.put("/{id}" , response_model=SupplierRead)
def update_supplier(id : UUID , supplier : SuppplierUpdate , session : Session = Depends(get_session)):
    return supplier_service.update_supplier(id=id , supplier=supplier , session=session)


@router.delete("/{id}" , response_model=SupplierRead)
def delete_supplier(id : UUID , session : Session = Depends(get_session)):
    return supplier_service.delete_supplier(id=id , session=session)


