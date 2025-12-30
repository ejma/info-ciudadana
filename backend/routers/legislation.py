from fastapi import APIRouter

router = APIRouter(
    prefix="/legislation",
    tags=["legislation"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def search_legislation():
    return {"message": "Legislation search placeholder"}
