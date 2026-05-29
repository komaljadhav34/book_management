import pytest
from httpx import AsyncClient

@pytest.fixture
async def auth_token(async_client: AsyncClient):
    # Register an admin user for tests
    email = "admin_test@example.com"
    await async_client.post("/api/auth/register", json={
        "name": "Admin",
        "email": email,
        "password": "password123"
    })
    # Login
    res = await async_client.post("/api/auth/login", json={
        "email": email,
        "password": "password123"
    })
    return res.json()["access_token"]

@pytest.mark.anyio
async def test_create_book(async_client: AsyncClient, auth_token: str):
    response = await async_client.post("/api/books", json={
        "title": "Test Book",
        "author": "Test Author",
        "isbn": "1234567890",
        "category": "Fiction",
        "price": 10.99,
        "stock": 5,
        "description": "A test book",
        "published_date": "2023-01-01T00:00:00Z"
    }, headers={"Authorization": f"Bearer {auth_token}"})
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Book"
    assert "id" in data

@pytest.mark.anyio
async def test_get_books(async_client: AsyncClient, auth_token: str):
    response = await async_client.get("/api/books", headers={"Authorization": f"Bearer {auth_token}"})
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) > 0
