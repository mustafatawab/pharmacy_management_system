from sqlmodel import Session, select
from fastapi import HTTPException
from models.insurance import InsurancePanel, InsuranceLedger
from typing import List
from decimal import Decimal

class InsuranceService:
    @staticmethod
    def get_panels(db: Session, tenant_id: int):
        return db.exec(select(InsurancePanel).where(InsurancePanel.tenant_id == tenant_id)).all()

    @staticmethod
    def create_panel(db: Session, data: dict, tenant_id: int):
        panel = InsurancePanel(
            name=data["name"],
            discount_percentage=data.get("discount_percentage", 0.0),
            tenant_id=tenant_id
        )
        db.add(panel)
        db.commit()
        db.refresh(panel)
        return panel

    @staticmethod
    def get_ledger(db: Session, panel_id: int, tenant_id: int):
        panel = db.exec(select(InsurancePanel).where(InsurancePanel.id == panel_id, InsurancePanel.tenant_id == tenant_id)).first()
        if not panel:
            raise HTTPException(status_code=404, detail="Insurance Panel not found")
        
        statement = select(InsuranceLedger).where(InsuranceLedger.panel_id == panel_id).order_by(InsuranceLedger.created_at.desc())
        return db.exec(statement).all()

    @staticmethod
    def record_payment(db: Session, panel_id: int, amount: Decimal, notes: str, tenant_id: int):
        panel = db.exec(select(InsurancePanel).where(InsurancePanel.id == panel_id, InsurancePanel.tenant_id == tenant_id)).first()
        if not panel:
            raise HTTPException(status_code=404, detail="Insurance Panel not found")

        panel.receivable_balance -= amount
        db.add(panel)
        
        ledger_entry = InsuranceLedger(
            panel_id=panel_id,
            reference_type="payment",
            credit=amount,
            balance_after=panel.receivable_balance,
            tenant_id=tenant_id,
            notes=notes
        )
        db.add(ledger_entry)
        db.commit()
        db.refresh(ledger_entry)
        return ledger_entry
