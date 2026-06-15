from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import *

import random

router = APIRouter(
    prefix="/seed",
    tags=["Demo Data"]
)


@router.post("/demo-data")
def seed_demo_data(
    db: Session = Depends(get_db)
):

    store = Store(
        name="Bangalore Store",
        location="Bangalore"
    )

    db.add(store)
    db.commit()
    db.refresh(store)

    machines = []

    machine_configs = [
        ("Surfacing Machine", "SURFACING", 100),
        ("Coating Machine", "COATING", 80),
        ("Finishing Machine", "FINISHING", 60)
    ]

    for name, mtype, cap in machine_configs:

        machine = Machine(
            name=name,
            machine_type=mtype,
            capacity=cap
        )

        db.add(machine)
        machines.append(machine)

    db.commit()

    for machine in machines:
        db.refresh(machine)

    created_orders = []

    for i in range(1, 21):

        customer = Customer(
            name=f"Customer {i}",
            phone=f"90000000{i:02d}",
            email=f"customer{i}@gmail.com",
            store_id=store.id
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        # LOW RISK
        if i <= 5:

            inventory_available = True
            qc_failures = 0
            queue_depth = 3
            machine_load = 20
            utilization_percent = 25
            sla_hours = 72

        # MEDIUM RISK
        elif i <= 10:

            inventory_available = True
            qc_failures = 2
            queue_depth = 15
            machine_load = 60
            utilization_percent = 65
            sla_hours = 72

        # HIGH RISK
        elif i <= 15:

            inventory_available = False
            qc_failures = 5
            queue_depth = 40
            machine_load = 90
            utilization_percent = 90
            sla_hours = 48

        # CRITICAL RISK
        else:

            inventory_available = False
            qc_failures = 8
            queue_depth = 80
            machine_load = 100
            utilization_percent = 100
            sla_hours = 24

        order = Order(
            order_number=f"ORD{i:05d}",
            customer_id=customer.id,
            store_id=store.id,
            status="PLACED",

            power=str(
                round(
                    random.uniform(-8, 8),
                    2
                )
            ),

            lens_type=(
                "Progressive"
                if i % 3 == 0
                else "Single Vision"
            ),

            lens_index=(
                "1.74"
                if i > 15
                else "1.67"
            ),

            coating="Blue Cut",

            frame_name="RayBan",

            inventory_available=inventory_available,

            qc_failures=qc_failures,

            queue_depth=queue_depth,

            machine_load=machine_load,

            utilization_percent=utilization_percent,

            sla_hours=sla_hours
        )

        db.add(order)
        db.commit()
        db.refresh(order)

        created_orders.append(order)

    # Queue Allocation

    for idx, order in enumerate(created_orders):

        if idx < 7:
            machine_id = machines[0].id

        elif idx < 14:
            machine_id = machines[1].id

        else:
            machine_id = machines[2].id

        queue = ProductionQueue(
            order_id=order.id,
            machine_id=machine_id,
            queue_position=idx + 1,
            estimated_wait_hours=(idx + 1) * 2,
            status="WAITING"
        )

        db.add(queue)

    # Machine Events

    db.add(
        MachineEvent(
            machine_id=machines[0].id,
            event_type="BREAKDOWN",
            description="Motor overheating"
        )
    )

    db.add(
        MachineEvent(
            machine_id=machines[1].id,
            event_type="MAINTENANCE",
            description="Routine maintenance"
        )
    )

    db.add(
        MachineEvent(
            machine_id=machines[2].id,
            event_type="STOPPED",
            description="Power failure"
        )
    )

    db.commit()

    return {
        "message": "AI Demo Data Created",
        "orders": 20,
        "machines": 3
    }