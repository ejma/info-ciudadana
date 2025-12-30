from fastapi import APIRouter

router = APIRouter(
    prefix="/contracting",
    tags=["contracting"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_contracting():
    return {"message": "Public contracting placeholder"}
