from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# =========================
# STORE
# =========================

class StoreCreate(BaseModel):
    name: str
    location: Optional[str] = None


# =========================
# ORDER
# =========================

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None

    store_id: int

    power: str

    lens_type: str
    lens_index: str

    coating: Optional[str] = None
    frame_name: Optional[str] = None

    sla_hours: int = 72


class OrderStatusUpdate(BaseModel):
    status: str
    reason: Optional[str] = None


# =========================
# INVENTORY
# =========================

class InventoryCreate(BaseModel):
    power: str
    lens_type: str
    lens_index: str
    coating: str
    quantity: int


class InventoryCheck(BaseModel):
    power: str
    lens_type: str
    lens_index: str
# =========================
# MACHINE
# =========================

class MachineCreate(BaseModel):
    name: str
    machine_type: str
    capacity: int = 100


# =========================
# QUEUE
# =========================

class QueueCreate(BaseModel):
    order_id: int
    machine_id: int


# =========================
# MACHINE EVENTS
# =========================

class MachineEventCreate(BaseModel):
    machine_id: int
    event_type: str
    description: str