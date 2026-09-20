from sqlmodel import Session, select
from models.supplier_ledger import SupplierLedger
from models.supplier import Supplier
from models.users import User
from schemas.supplier_ledger_schema import SupplierPaymentRequest
from fastapi import HTTPException
from uuid import UUID
from decimal import Decimal
from datetime import datetime

class SupplierLedgerService:
    def get_ledger(self, supplier_id: UUID, session: Session, current_user: User):
        return session.exec(
            select(SupplierLedger).where(
                SupplierLedger.supplier_id == supplier_id,
                SupplierLedger.tenant_id == current_user.tenant_id
            ).order_by(SupplierLedger.created_at.desc())
        ).all()
        
    def record_payment(self, supplier_id: UUID, payment: SupplierPaymentRequest, session: Session, current_user: User):
        supplier = session.exec(
            select(Supplier).where(
                Supplier.id == supplier_id,
                Supplier.tenant_id == current_user.tenant_id
            )
        ).first()
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
            
        supplier.outstanding_balance -= payment.amount
        
        ledger_entry = SupplierLedger(
            supplier_id=supplier.id,
            tenant_id=current_user.tenant_id,
            reference_type="payment",
            reference_id=None,
            debit=Decimal("0.00"),
            credit=payment.amount,
            balance_after=supplier.outstanding_balance,
            notes=payment.notes or f"Manual payment via {payment.payment_method}"
        )
        
        session.add(supplier)
        session.add(ledger_entry)
        session.commit()
        session.refresh(ledger_entry)
        
        return ledger_entry
