from fastapi import HTTPException, status
from app.config.database import get_database
from app.config.jwt_handler import create_access_token
from app.schemas.auth_schema import RegisterSchema, LoginSchema
from app.models.user_model import UserInDB
from app.utils.password import hash_password, verify_password
from datetime import datetime, timezone
from bson import ObjectId


# Emails that are automatically granted Admin role
ADMIN_EMAILS = [
    "komaljadhav8584@gmail.com",
]


async def register_user(data: RegisterSchema) -> UserInDB:
    db = get_database()
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    user_dict = data.model_dump()
    user_dict["password"] = hash_password(data.password)
    user_dict["created_at"] = datetime.now(timezone.utc)

    # Auto-assign Admin role for whitelisted emails
    if data.email.lower() in [e.lower() for e in ADMIN_EMAILS]:
        user_dict["role"] = "Admin"
    else:
        user_dict["role"] = "User"

    result = await db.users.insert_one(user_dict)
    created = await db.users.find_one({"_id": result.inserted_id})
    return UserInDB(**created, id=str(created["_id"]))


async def login_user(data: LoginSchema) -> dict:
    db = get_database()
    user = await db.users.find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(subject=str(user["_id"]))
    return {"access_token": token, "token_type": "bearer"}


async def get_user_by_id(user_id: str) -> UserInDB:
    db = get_database()
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    user = await db.users.find_one({"_id": obj_id})
    if not user:
        return None
    return UserInDB(**user, id=str(user["_id"]))
