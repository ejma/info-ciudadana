from fastapi import APIRouter

router = APIRouter(
    prefix="/corruption",
    tags=["corruption"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_corruption_cases():
    return {"message": "Corruption cases placeholder"}
