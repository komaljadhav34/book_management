from fastapi import APIRouter, Depends
from app.config.database import get_database
from app.models.user_model import UserInDB
from app.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("")
async def get_stats(current_user: UserInDB = Depends(get_current_user)):
    """Get system stats for the dashboard"""
    db = get_database()
    
    # Total books
    if current_user.role == "Admin":
        total_books = await db.books.count_documents({})
        categories = await db.books.distinct("category")
    else:
        total_books = await db.books.count_documents({"created_by": current_user.id})
        categories = await db.books.distinct("category", {"created_by": current_user.id})
        
    return {
        "total_books": total_books,
        "unique_categories": len(categories)
    }
