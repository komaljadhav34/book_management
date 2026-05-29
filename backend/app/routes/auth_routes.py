from fastapi import APIRouter, Depends
from app.schemas.auth_schema import RegisterSchema, LoginSchema, TokenSchema
from app.models.user_model import UserResponse
from app.services.auth_service import register_user, login_user
from app.middleware.auth_middleware import get_current_user
from app.models.user_model import UserInDB

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: RegisterSchema):
    """Register a new user"""
    return await register_user(data)

@router.post("/login", response_model=TokenSchema)
async def login(data: LoginSchema):
    """Authenticate user and return JWT token"""
    return await login_user(data)

@router.get("/profile", response_model=UserResponse)
async def profile(current_user: UserInDB = Depends(get_current_user)):
    """Get current user profile"""
    return current_user
