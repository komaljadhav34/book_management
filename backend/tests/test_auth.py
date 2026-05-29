import pytest
from httpx import AsyncClient

@pytest.mark.anyio
async def test_register_user(async_client: AsyncClient):
    response = await async_client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "password" not in data

@pytest.mark.anyio
async def test_login_user(async_client: AsyncClient):
    response = await async_client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
