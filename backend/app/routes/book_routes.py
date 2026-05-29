from fastapi import APIRouter, Depends, Query, status
from typing import Optional
from app.schemas.book_schema import BookCreateSchema, BookUpdateSchema, BookListSchema
from app.models.book_model import BookResponse
from app.services.book_service import create_book, get_all_books, get_book, update_book, delete_book
from app.middleware.auth_middleware import get_current_user, get_current_admin
from app.models.user_model import UserInDB

router = APIRouter()

@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
async def add_book(
    data: BookCreateSchema,
    current_user: UserInDB = Depends(get_current_user)
):
    """Add a new book (authenticated users)"""
    return await create_book(data, current_user.id)

@router.get("", response_model=BookListSchema)
async def list_books(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all books with pagination, search, filter, and sort"""
    return await get_all_books(page, size, search, category, sort_by, sort_order, current_user)

@router.get("/{book_id}", response_model=BookResponse)
async def read_book(book_id: str):
    """Get a single book by ID"""
    return await get_book(book_id)

@router.put("/{book_id}", response_model=BookResponse)
async def edit_book(
    book_id: str,
    data: BookUpdateSchema,
    current_user: UserInDB = Depends(get_current_admin),
):
    """Update a book (admin only)"""
    return await update_book(book_id, data)

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_book(
    book_id: str,
    current_user: UserInDB = Depends(get_current_admin),
):
    """Delete a book (admin only)"""
    await delete_book(book_id)
    return None
