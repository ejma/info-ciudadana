from fastapi import APIRouter

router = APIRouter(
    prefix="/subsidies",
    tags=["subsidies"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_subsidies():
    return {"message": "Subsidies placeholder"}
