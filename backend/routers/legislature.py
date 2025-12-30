from fastapi import APIRouter

router = APIRouter(
    prefix="/legislature",
    tags=["legislature"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_legislature_info():
    return {"message": "Legislature analysis placeholder"}
