from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
import uuid
from typing import Dict

router = APIRouter()

UPLOAD_DIR = "static/uploads"

@router.post("", response_model=Dict[str, str])
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not upload file")
        
    return {"url": f"http://localhost:8000/static/uploads/{unique_filename}"}
