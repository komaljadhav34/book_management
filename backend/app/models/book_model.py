from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=100)
    isbn: str = Field(..., min_length=10, max_length=13)
    category: str
    price: float = Field(..., ge=0)
    published_date: datetime
    description: str
    cover_image: Optional[str] = None
    stock: int = Field(default=0, ge=0)


class BookInDB(BookBase):
    id: str
    created_by: str
    created_at: datetime


class BookResponse(BookInDB):
    pass
