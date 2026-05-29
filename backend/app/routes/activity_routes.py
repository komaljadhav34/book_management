from fastapi import APIRouter, Depends, Query
from app.config.database import get_database
from app.models.user_model import UserInDB
from app.middleware.auth_middleware import get_current_user
from app.models.activity_model import ActivityResponse

router = APIRouter()

@router.get("", response_model=list[ActivityResponse])
async def get_recent_activities(
    limit: int = Query(10, ge=1, le=50),
    current_user: UserInDB = Depends(get_current_user)
):
    """Get recent activities for dashboard"""
    db = get_database()
    query = {}
    if current_user.role != "Admin":
        query["user_id"] = current_user.id
        
    cursor = db.activities.find(query).sort("created_at", -1).limit(limit)
    activities = await cursor.to_list(length=limit)
    
    result = []
    for act in activities:
        act["id"] = str(act.pop("_id"))
        result.append(ActivityResponse(**act))
        
    return result
