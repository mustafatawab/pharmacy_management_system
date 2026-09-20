from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RefillReminderRead(BaseModel):
    id: int
    customer_id: int
    medicine_id: int
    sale_id: Optional[int]
    next_refill_date: datetime
    status: str
    customer_name: str
    customer_phone: Optional[str]
    medicine_name: str
    notes: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
