import pytest
from httpx import AsyncClient
from app.main import app
from app.config.database import get_database, connect_to_mongo, close_mongo_connection

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture(scope="session", autouse=True)
async def setup_db():
    await connect_to_mongo()
    db = get_database()
    # Cleanup before tests
    await db.users.delete_many({})
    await db.books.delete_many({})
    yield
    # Cleanup after tests
    await db.users.delete_many({})
    await db.books.delete_many({})
    await close_mongo_connection()

@pytest.fixture
async def async_client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
