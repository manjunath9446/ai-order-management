from app.models import (
    Order
)

from app.models import (
    ProductionQueue
)

from app.models import (
    Machine
)


def build_features(
    db,
    order_id
):

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )

    if not order:
        return None

    queue = (
        db.query(ProductionQueue)
        .filter(
            ProductionQueue.order_id
            == order_id
        )
        .first()
    )

    machine = None

    if queue:

        machine = (
            db.query(Machine)
            .filter(
                Machine.id
                == queue.machine_id
            )
            .first()
        )

    return {

        "power":
            float(
                order.power or 0
            ),

        "inventory_available":
            int(
                order.inventory_available
            ),

        "queue_depth":
            order.queue_depth or 0,

        "machine_load":
            order.machine_load or 0,

        "utilization_percent":
            order.utilization_percent or 0,

        "qc_failures":
            order.qc_failures or 0,

        "sla_hours":
            order.sla_hours or 72
    }