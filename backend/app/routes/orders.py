from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas import OrderCreate
from app.schemas import OrderStatusUpdate

from app.models import Order
from app.models import OrderStatusHistory
from app.services.auto_ai_workflow import (
    run_ai_workflow
)
from app.crud import create_customer
from app.crud import create_order
from app.crud import check_inventory

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/")
@router.post("/")
def create_new_order(
    payload: OrderCreate,
    db: Session = Depends(get_db)
):
    print("CREATE ORDER API HIT")

    customer = create_customer(
        db,
        payload.customer_name,
        payload.customer_phone,
        payload.customer_email,
        payload.store_id
    )

    inventory_item = check_inventory(
        db,
        payload.power,
        payload.lens_type,
        payload.lens_index
    )

    inventory_available = (
        inventory_item is not None
        and inventory_item.quantity > 0
    )

    order = create_order(
        db=db,
        customer_id=customer.id,
        store_id=payload.store_id,
        power=payload.power,
        lens_type=payload.lens_type,
        lens_index=payload.lens_index,
        coating=payload.coating,
        frame_name=payload.frame_name,
        sla_hours=payload.sla_hours,
        inventory_available=inventory_available
    )
    ai_result = run_ai_workflow(
    db,
    order
)
    print("WORKFLOW EXECUTED")
    return {
    "message": "Order Created",

    "order_id":
        order.id,

    "order_number":
        order.order_number,

    "status":
        order.status,

    "inventory_available":
        inventory_available,

    "predicted_tat":
        ai_result[
            "predicted_tat"
        ],

    "risk":
        ai_result[
            "risk"
        ]
}

@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@router.patch("/{order_id}/status")
def update_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    old_status = order.status

    order.status = payload.status

    history = OrderStatusHistory(
        order_id=order.id,
        old_status=old_status,
        new_status=payload.status,
        reason=payload.reason
    )

    db.add(history)

    db.commit()
    db.refresh(order)

    return {
        "message": "Status Updated",
        "status": order.status
    }


@router.get("/{order_id}/history")
def get_order_history(
    order_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(OrderStatusHistory)
        .filter(
            OrderStatusHistory.order_id == order_id
        )
        .all()
    )