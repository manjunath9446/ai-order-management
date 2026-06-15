from sqlalchemy.orm import Session


from app.models import (
    Store,
    Customer,
    Order,
    OrderStatusHistory,
    LensInventory,
    Machine,
    ProductionQueue,
    MachineEvent
)

# ==================================
# STORE CRUD
# ==================================

def create_store(
    db: Session,
    name: str,
    location: str = None
):

    store = Store(
        name=name,
        location=location
    )

    db.add(store)
    db.commit()
    db.refresh(store)

    return store


def get_all_stores(db: Session):

    return db.query(Store).all()


def get_store_by_id(
    db: Session,
    store_id: int
):

    return (
        db.query(Store)
        .filter(Store.id == store_id)
        .first()
    )


# ==================================
# CUSTOMER CRUD
# ==================================

def create_customer(
    db: Session,
    name: str,
    phone: str = None,
    email: str = None,
    store_id: int = None
):

    customer = Customer(
        name=name,
        phone=phone,
        email=email,
        store_id=store_id
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


# ==================================
# ORDER CRUD
# ==================================

def generate_order_number(order_id: int):
    return f"ORD{str(order_id).zfill(5)}"


from datetime import datetime


def create_order(
    db: Session,
    customer_id: int,
    store_id: int,
    power: str,
    lens_type: str,
    lens_index: str,
    coating: str,
    frame_name: str,
    sla_hours: int,
    inventory_available: bool
):

    remaining_hours = sla_hours

    order = Order(
        order_number="TEMP",
        customer_id=customer_id,
        store_id=store_id,
        power=power,
        lens_type=lens_type,
        lens_index=lens_index,
        coating=coating,
        frame_name=frame_name,
        sla_hours=sla_hours,
        remaining_hours=remaining_hours,
        inventory_available=inventory_available,
        is_breached=False,
        status="PLACED"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    order.order_number = generate_order_number(
        order.id
    )

    db.commit()
    db.refresh(order)

    history = OrderStatusHistory(
        order_id=order.id,
        old_status=None,
        new_status="PLACED",
        reason="Order Created"
    )

    db.add(history)
    db.commit()

    return order


# ==================================
# INVENTORY CRUD
# ==================================

def create_inventory(
    db: Session,
    power: str,
    lens_type: str,
    lens_index: str,
    coating: str,
    quantity: int
):

    item = LensInventory(
        power=power,
        lens_type=lens_type,
        lens_index=lens_index,
        coating=coating,
        quantity=quantity
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item


def get_inventory(
    db: Session
):

    return db.query(
        LensInventory
    ).all()


def check_inventory(
    db: Session,
    power: str,
    lens_type: str,
    lens_index: str
):

    return (
        db.query(LensInventory)
        .filter(
            LensInventory.power == power,
            LensInventory.lens_type == lens_type,
            LensInventory.lens_index == lens_index
        )
        .first()
    )
# ==================================
# MACHINE CRUD
# ==================================

def create_machine(
    db: Session,
    name: str,
    machine_type: str,
    capacity: int
):

    machine = Machine(
        name=name,
        machine_type=machine_type,
        capacity=capacity
    )

    db.add(machine)
    db.commit()
    db.refresh(machine)

    return machine


def get_machines(
    db: Session
):

    return db.query(Machine).all()


# ==================================
# QUEUE CRUD
# ==================================

def add_to_queue(
    db: Session,
    order_id: int,
    machine_id: int
):

    queue_count = (
        db.query(ProductionQueue)
        .filter(
            ProductionQueue.machine_id == machine_id
        )
        .count()
    )

    queue_item = ProductionQueue(
        order_id=order_id,
        machine_id=machine_id,
        queue_position=queue_count + 1,
        estimated_wait_hours=(queue_count + 1) * 2
    )

    db.add(queue_item)

    machine = (
        db.query(Machine)
        .filter(
            Machine.id == machine_id
        )
        .first()
    )

    if machine:
        machine.current_load += 1

    db.commit()
    db.refresh(queue_item)

    return queue_item


def get_queue(
    db: Session
):

    return db.query(
        ProductionQueue
    ).all()


# ==================================
# MACHINE EVENTS
# ==================================

def create_machine_event(
    db: Session,
    machine_id: int,
    event_type: str,
    description: str
):

    event = MachineEvent(
        machine_id=machine_id,
        event_type=event_type,
        description=description
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


def get_machine_events(
    db: Session
):

    return db.query(
        MachineEvent
    ).all()
def get_machine_utilization(
    db: Session
):

    machines = db.query(Machine).all()

    result = []

    for machine in machines:

        utilization = round(
            (machine.current_load / machine.capacity) * 100,
            2
        ) if machine.capacity > 0 else 0

        result.append({
            "machine_id": machine.id,
            "machine_name": machine.name,
            "current_load": machine.current_load,
            "capacity": machine.capacity,
            "utilization_percent": utilization
        })

    return result


def get_bottlenecks(
    db: Session
):

    machines = db.query(Machine).all()

    bottlenecks = []

    for machine in machines:

        utilization = (
            machine.current_load / machine.capacity
        ) * 100 if machine.capacity else 0

        if utilization >= 80:

            bottlenecks.append({
                "machine_id": machine.id,
                "machine_name": machine.name,
                "utilization": round(utilization, 2),
                "risk": "BOTTLENECK"
            })

    return bottlenecks


def get_throughput(
    db: Session
):

    total_orders = db.query(Order).count()

    completed_orders = (
        db.query(Order)
        .filter(
            Order.status == "COMPLETED"
        )
        .count()
    )

    return {
        "total_orders": total_orders,
        "completed_orders": completed_orders,
        "completion_rate": round(
            (completed_orders / total_orders) * 100,
            2
        ) if total_orders else 0
    }