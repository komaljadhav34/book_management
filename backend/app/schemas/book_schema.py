from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class BookCreateSchema(BaseModel):
    title: str = Field(..., min_length=1)
    author: str = Field(..., min_length=1)
    isbn: str = Field(..., min_length=10, max_length=13)
    category: str
    price: float = Field(..., ge=0)
    published_date: datetime
    description: str
    cover_image: Optional[str] = None
    stock: int = Field(default=0, ge=0)


class BookUpdateSchema(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    isbn: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    published_date: Optional[datetime] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None
    stock: Optional[int] = None


class BookListSchema(BaseModel):
    items: List[dict]
    total: int
    page: int
    size: int
