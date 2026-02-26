from fastapi import APIRouter

router = APIRouter()

@router.get("/data")
async def get_data():
    return {
        "source": "FastAPI Core Service",
        "items": ["Python", "FastAPI", "Pydantic", "Uvicorn"],
        "status": "success",
        "layer": "API Endpoint Layer"
    }
