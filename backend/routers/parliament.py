from fastapi import APIRouter

router = APIRouter(
    prefix="/parliament",
    tags=["parliament"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_parliament_info():
    return {"message": "Parliament info placeholder"}
