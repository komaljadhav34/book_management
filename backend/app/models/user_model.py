from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    role: str = "User"


class UserInDB(UserBase):
    id: str
    created_at: datetime

    class Config:
        populate_by_name = True


class UserResponse(UserBase):
    id: str
    created_at: datetime
