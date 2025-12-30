from fastapi import APIRouter

router = APIRouter(
    prefix="/participation",
    tags=["participation"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_participation_options():
    return {"message": "Participation options placeholder"}
