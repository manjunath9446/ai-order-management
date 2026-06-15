from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas import (
    MachineCreate,
    QueueCreate,
    MachineEventCreate
)

from app.crud import (
    create_machine,
    get_machines,
    add_to_queue,
    get_queue,
    create_machine_event,
    get_machine_events
)
from app.crud import (
    get_machine_utilization,
    get_bottlenecks,
    get_throughput
)

from app.models import Machine
from app.models import ProductionQueue


router = APIRouter(
    prefix="/operations",
    tags=["Operations"]
)


# ==================================
# MACHINES
# ==================================

@router.post("/machines")
def create_new_machine(
    payload: MachineCreate,
    db: Session = Depends(get_db)
):

    return create_machine(
        db=db,
        name=payload.name,
        machine_type=payload.machine_type,
        capacity=payload.capacity
    )


@router.get("/machines")
def list_machines(
    db: Session = Depends(get_db)
):

    return get_machines(db)


# ==================================
# PRODUCTION QUEUE
# ==================================

@router.post("/queue")
def add_order_queue(
    payload: QueueCreate,
    db: Session = Depends(get_db)
):

    return add_to_queue(
        db=db,
        order_id=payload.order_id,
        machine_id=payload.machine_id
    )


@router.get("/queue")
def list_queue(
    db: Session = Depends(get_db)
):

    return get_queue(db)


# ==================================
# MACHINE EVENTS
# ==================================

@router.post("/events")
def create_event(
    payload: MachineEventCreate,
    db: Session = Depends(get_db)
):

    return create_machine_event(
        db=db,
        machine_id=payload.machine_id,
        event_type=payload.event_type,
        description=payload.description
    )


@router.get("/events")
def list_events(
    db: Session = Depends(get_db)
):

    return get_machine_events(db)


# ==================================
# OPERATIONS METRICS
# ==================================

@router.get("/metrics")
def operations_metrics(
    db: Session = Depends(get_db)
):

    total_machines = db.query(
        Machine
    ).count()

    active_machines = (
        db.query(Machine)
        .filter(
            Machine.status == "AVAILABLE"
        )
        .count()
    )

    queue_depth = db.query(
        ProductionQueue
    ).count()

    total_load = sum(
        m.current_load
        for m in db.query(Machine).all()
    )

    utilization = 0

    if total_machines > 0:

        utilization = round(
            (total_load / (total_machines * 100)) * 100,
            2
        )

    avg_wait = 0

    queue_items = db.query(
        ProductionQueue
    ).all()

    if queue_items:

        avg_wait = round(
            sum(
                q.estimated_wait_hours
                for q in queue_items
            ) / len(queue_items),
            2
        )

    return {
        "total_machines": total_machines,
        "active_machines": active_machines,
        "queue_depth": queue_depth,
        "avg_wait_hours": avg_wait,
        "utilization_percent": utilization
    }
@router.get("/utilization")
def machine_utilization(
    db: Session = Depends(get_db)
):

    return get_machine_utilization(db)


@router.get("/bottlenecks")
def bottlenecks(
    db: Session = Depends(get_db)
):

    return get_bottlenecks(db)


@router.get("/throughput")
def throughput(
    db: Session = Depends(get_db)
):

    return get_throughput(db)


@router.get("/dashboard")
def operations_dashboard(
    db: Session = Depends(get_db)
):

    return {
        "utilization": get_machine_utilization(db),
        "bottlenecks": get_bottlenecks(db),
        "throughput": get_throughput(db)
    }