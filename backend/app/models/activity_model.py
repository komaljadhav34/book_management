from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ActivitySchema(BaseModel):
    user_id: str
    action: str
    target: str
    details: Optional[str] = None
    created_at: datetime = None

class ActivityResponse(ActivitySchema):
    id: str
