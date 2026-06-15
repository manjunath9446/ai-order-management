from datetime import datetime

from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    Order,
    LensInventory,
    OrderPrediction
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ======================================
# DASHBOARD SUMMARY
# ======================================

@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):

    total_orders = (
        db.query(Order)
        .count()
    )

    active_orders = (
        db.query(Order)
        .filter(
            Order.status != "DELIVERED"
        )
        .count()
    )

    completed_orders = (
        db.query(Order)
        .filter(
            Order.status == "DELIVERED"
        )
        .count()
    )

    low_stock_items = (
        db.query(LensInventory)
        .filter(
            LensInventory.quantity < 5
        )
        .count()
    )

    breached_orders = (
        db.query(Order)
        .filter(
            Order.is_breached == True
        )
        .count()
    )

    return {
        "total_orders": total_orders,
        "active_orders": active_orders,
        "completed_orders": completed_orders,
        "low_stock_items": low_stock_items,
        "breached_orders": breached_orders
    }


# ======================================
# SLA DASHBOARD
# ======================================

@router.get("/sla")
def sla_dashboard(
    db: Session = Depends(get_db)
):

    orders = (
        db.query(Order)
        .all()
    )

    results = []

    for order in orders:

        created_time = (
            order.created_at.replace(
                tzinfo=None
            )
        )

        hours_used = (
            datetime.utcnow() -
            created_time
        ).total_seconds() / 3600

        remaining_hours = max(
            0,
            order.sla_hours - hours_used
        )

        results.append({

            "id": order.id,

            "order_number":
                order.order_number,

            "status":
                order.status,

            "sla_hours":
                order.sla_hours,

            "remaining_hours":
                round(
                    remaining_hours,
                    1
                ),

            "is_breached":
                remaining_hours <= 0

        })

    return results


# ======================================
# FILTER ORDERS
# ======================================

@router.get("/orders")
def filtered_orders(
    status: str = None,
    lens_type: str = None,
    db: Session = Depends(get_db)
):

    query = db.query(Order)

    if status:

        query = query.filter(
            Order.status == status
        )

    if lens_type:

        query = query.filter(
            Order.lens_type == lens_type
        )

    return query.all()


# ======================================
# AT RISK ORDERS
# ======================================

@router.get("/at-risk")
def at_risk_orders(
    db: Session = Depends(get_db)
):

    predictions = (

        db.query(OrderPrediction)

        .filter(
            OrderPrediction.risk_level == "HIGH"
        )

        .all()

    )

    results = []

    for prediction in predictions:

        order = (

            db.query(Order)

            .filter(
                Order.id ==
                prediction.order_id
            )

            .first()

        )

        if order:

            results.append({

                "id":
                    order.id,

                "order_number":
                    order.order_number,

                "risk_level":
                    prediction.risk_level,

                "predicted_tat":
                    prediction.predicted_tat,

                "delay_probability":
                    prediction.delay_probability

            })

    return results


# ======================================
# LOW STOCK INVENTORY
# ======================================

@router.get("/low-stock")
def low_stock_items(
    db: Session = Depends(get_db)
):

    inventory = (

        db.query(LensInventory)

        .filter(
            LensInventory.quantity < 5
        )

        .all()

    )

    return inventory