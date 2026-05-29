from fastapi import HTTPException, status
from app.config.database import get_database
from app.schemas.book_schema import BookCreateSchema, BookUpdateSchema, BookListSchema
from app.models.book_model import BookInDB
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId


def _serialize(book: dict) -> dict:
    book["id"] = str(book.pop("_id"))
    return book


async def create_book(data: BookCreateSchema, user_id: str) -> BookInDB:
    db = get_database()
    book_dict = data.model_dump()
    book_dict["created_by"] = user_id
    book_dict["created_at"] = datetime.now(timezone.utc)
    result = await db.books.insert_one(book_dict)
    
    # Log activity
    await db.activities.insert_one({
        "user_id": user_id,
        "action": "CREATE_BOOK",
        "target": data.title,
        "details": f"Added new book: {data.title}",
        "created_at": datetime.now(timezone.utc)
    })
    
    created = await db.books.find_one({"_id": result.inserted_id})
    return BookInDB(**_serialize(created))


from app.models.user_model import UserInDB

async def get_all_books(
    page: int = 1,
    size: int = 10,
    search: Optional[str] = None,
    category: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    current_user: Optional[UserInDB] = None
) -> BookListSchema:
    db = get_database()
    query = {}
    
    if current_user and current_user.role != "Admin":
        query["created_by"] = current_user.id
        
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if category:
        query["category"] = category

    sort_dir = -1 if sort_order == "desc" else 1
    skip = (page - 1) * size

    cursor = db.books.find(query).sort(sort_by, sort_dir).skip(skip).limit(size)
    books = await cursor.to_list(length=size)
    total = await db.books.count_documents(query)
    serialized = [_serialize(b) for b in books]

    return BookListSchema(items=serialized, total=total, page=page, size=size)


async def get_book(book_id: str) -> BookInDB:
    db = get_database()
    try:
        obj_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID")
    book = await db.books.find_one({"_id": obj_id})
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return BookInDB(**_serialize(book))


async def update_book(book_id: str, data: BookUpdateSchema) -> BookInDB:
    db = get_database()
    try:
        obj_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID")
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")
    result = await db.books.update_one({"_id": obj_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")
        
    # Log activity
    await db.activities.insert_one({
        "user_id": "System/Admin", # Admin context not passed directly, but update_book is admin only
        "action": "UPDATE_BOOK",
        "target": book_id,
        "details": f"Updated book {book_id}",
        "created_at": datetime.now(timezone.utc)
    })
        
    return await get_book(book_id)


async def delete_book(book_id: str) -> bool:
    db = get_database()
    try:
        obj_id = ObjectId(book_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid book ID")
    result = await db.books.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Book not found")
        
    # Log activity
    await db.activities.insert_one({
        "user_id": "System/Admin",
        "action": "DELETE_BOOK",
        "target": book_id,
        "details": f"Deleted book {book_id}",
        "created_at": datetime.now(timezone.utc)
    })
        
    return True
