from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.database import connect_to_mongo, close_mongo_connection
from app.config.settings import settings
from app.routes import (
    auth_routes,
    book_routes,
    stats_routes,
    activity_routes,
    upload_routes
)
import os

# ✅ 1. CREATE APP FIRST
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full Stack Intern Hiring Task – Book Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ✅ 2. ADD CORS AFTER APP CREATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://book-management-five-bice.vercel.app",
        "https://book-management-c87sjij2t-komaljadhav34s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Lifecycle
@app.on_event("startup")
async def startup():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()

# Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(book_routes.router, prefix="/api/books", tags=["Books"])
app.include_router(stats_routes.router, prefix="/api/stats", tags=["Stats"])
app.include_router(activity_routes.router, prefix="/api/activities", tags=["Activities"])
app.include_router(upload_routes.router, prefix="/api/upload", tags=["Upload"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": f"{settings.PROJECT_NAME} API is running. Visit /docs for Swagger UI."
    }
