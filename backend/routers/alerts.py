from fastapi import APIRouter

router = APIRouter(
    prefix="/alerts",
    tags=["alerts"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_alerts():
    return {"message": "Alerts placeholder"}
