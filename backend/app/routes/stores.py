from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas import StoreCreate

from app.crud import (
    create_store,
    get_all_stores,
    get_store_by_id
)

router = APIRouter(
    prefix="/stores",
    tags=["Stores"]
)


@router.post("/")
def add_store(
    payload: StoreCreate,
    db: Session = Depends(get_db)
):

    store = create_store(
        db=db,
        name=payload.name,
        location=payload.location
    )

    return store


@router.get("/")
def list_stores(
    db: Session = Depends(get_db)
):

    return get_all_stores(db)


@router.get("/{store_id}")
def get_store(
    store_id: int,
    db: Session = Depends(get_db)
):

    store = get_store_by_id(
        db,
        store_id
    )

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found"
        )

    return store