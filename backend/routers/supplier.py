from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from database import get_session
from schemas.supplier_schema import SupplierCreate, SupplierRead, SupplierUpdate
from service.supplier_service import SupplierService
from models.users import User
from auth.dependency import require_admin_with_tenant
from uuid import UUID

router = APIRouter(prefix="/supplier" , tags=["supplier"])

supplier_service = SupplierService()

@router.get("/" , response_model=list[SupplierRead])
def get_suppliers(
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    suppliers = supplier_service.get_all_suppliers(session=session, tenant_id=current_user.tenant_id)
    return suppliers


@router.get("/{id}" , response_model=SupplierRead)
def get_supplier_by_id(
    id : UUID , 
    session : Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return supplier_service.get_supplier_by_id(id=id, session=session, tenant_id=current_user.tenant_id)


@router.post("/" , response_model=SupplierRead)
def create_supplier(
    supplier : SupplierCreate , 
    session : Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return supplier_service.create_supplier(supplier=supplier, session=session, tenant_id=current_user.tenant_id)


@router.put("/{id}" , response_model=SupplierRead)
def update_supplier(
    id : UUID , 
    supplier : SupplierUpdate , 
    session : Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return supplier_service.update_supplier(id=id, supplier_data=supplier, session=session, tenant_id=current_user.tenant_id)


@router.delete("/{id}" , response_model=dict)
def delete_supplier(
    id : UUID , 
    session : Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return supplier_service.delete_supplier(id=id, session=session, tenant_id=current_user.tenant_id)

from service.supplier_ledger_service import SupplierLedgerService
from schemas.supplier_ledger_schema import SupplierLedgerRead, SupplierPaymentRequest
from typing import List

ledger_service = SupplierLedgerService()

@router.get("/{id}/ledger", response_model=List[SupplierLedgerRead])
def get_supplier_ledger(
    id: UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return ledger_service.get_ledger(supplier_id=id, session=session, current_user=current_user)

@router.post("/{id}/pay", response_model=SupplierLedgerRead)
def pay_supplier(
    id: UUID,
    payment: SupplierPaymentRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin_with_tenant)
):
    return ledger_service.record_payment(supplier_id=id, payment=payment, session=session, current_user=current_user)
