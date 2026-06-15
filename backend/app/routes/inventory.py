from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas import (
    InventoryCreate,
    InventoryCheck
)

from app.crud import (
    create_inventory,
    get_inventory,
    check_inventory
)

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


@router.post("/")
def add_inventory(
    payload: InventoryCreate,
    db: Session = Depends(get_db)
):

    return create_inventory(
        db=db,
        power=payload.power,
        lens_type=payload.lens_type,
        lens_index=payload.lens_index,
        coating=payload.coating,
        quantity=payload.quantity
    )


@router.get("/")
def list_inventory(
    db: Session = Depends(get_db)
):

    return get_inventory(db)


@router.post("/check")
def inventory_check(
    payload: InventoryCheck,
    db: Session = Depends(get_db)
):

    item = check_inventory(
        db,
        payload.power,
        payload.lens_type,
        payload.lens_index
    )

    if item:

        return {
            "available": True,
            "quantity": item.quantity
        }

    return {
        "available": False,
        "quantity": 0
    }