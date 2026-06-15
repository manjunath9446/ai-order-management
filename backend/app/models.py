from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(String(200))
    active = Column(Boolean, default=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    customers = relationship("Customer", back_populates="store")
    users = relationship("User", back_populates="store")
    orders = relationship("Order", back_populates="store")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))
    email = Column(String(255), unique=True)

    role = Column(String(50), default="staff")

    store_id = Column(
        Integer,
        ForeignKey("stores.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    store = relationship("Store", back_populates="users")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(255))

    store_id = Column(
        Integer,
        ForeignKey("stores.id")
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    store = relationship("Store", back_populates="customers")
    orders = relationship("Order", back_populates="customer")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    order_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id")
    )

    store_id = Column(
        Integer,
        ForeignKey("stores.id")
    )

    status = Column(
        String(50),
        default="PLACED"
    )

    power = Column(String(20))

    lens_type = Column(String(100))

    lens_index = Column(String(50))

    coating = Column(String(100))

    frame_name = Column(String(100))

    inventory_available = Column(
        Boolean,
        default=False
    )

    # ==========================
    # NEW AI FEATURES
    # ==========================

    qc_failures = Column(
        Integer,
        default=0
    )

    queue_depth = Column(
        Integer,
        default=0
    )

    machine_load = Column(
        Integer,
        default=0
    )

    utilization_percent = Column(
        Integer,
        default=0
    )

    # ==========================

    sla_hours = Column(Integer)

    remaining_hours = Column(Integer)

    is_breached = Column(
        Boolean,
        default=False
    )

    delay_reason = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    customer = relationship(
        "Customer",
        back_populates="orders"
    )

    store = relationship(
        "Store",
        back_populates="orders"
    )

    status_history = relationship(
        "OrderStatusHistory",
        back_populates="order",
        cascade="all, delete"
    )


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    old_status = Column(String(50))
    new_status = Column(String(50))
    reason = Column(Text)

    changed_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    order = relationship(
        "Order",
        back_populates="status_history"
    )


# NEW TABLE
class LensInventory(Base):
    __tablename__ = "lens_inventory"

    id = Column(Integer, primary_key=True, index=True)

    power = Column(String(20))

    lens_type = Column(String(100))

    lens_index = Column(String(50))

    coating = Column(String(100))

    quantity = Column(Integer, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
# ==================================
# MACHINE
# ==================================

class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    machine_type = Column(String(100))

    status = Column(
        String(50),
        default="AVAILABLE"
    )

    capacity = Column(Integer, default=100)

    current_load = Column(Integer, default=0)

    maintenance_due = Column(
        DateTime(timezone=True),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==================================
# PRODUCTION QUEUE
# ==================================

class ProductionQueue(Base):
    __tablename__ = "production_queue"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    machine_id = Column(
        Integer,
        ForeignKey("machines.id")
    )

    queue_position = Column(Integer)

    estimated_wait_hours = Column(Integer)

    status = Column(
        String(50),
        default="WAITING"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


# ==================================
# MACHINE EVENTS
# ==================================

class MachineEvent(Base):
    __tablename__ = "machine_events"

    id = Column(Integer, primary_key=True, index=True)

    machine_id = Column(
        Integer,
        ForeignKey("machines.id")
    )

    event_type = Column(
        String(50)
    )

    description = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
class OrderPrediction(Base):
    __tablename__ = "order_predictions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    predicted_tat = Column(Integer)

    delay_probability = Column(Integer)

    risk_level = Column(
        String(20)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
class AIAlert(Base):
    __tablename__ = "ai_alerts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        nullable=True
    )

    severity = Column(
        String(20)
    )

    title = Column(
        String(255)
    )

    message = Column(
        Text
    )

    status = Column(
        String(20),
        default="OPEN"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
class AIAction(Base):
    __tablename__ = "ai_actions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(Integer)

    action_type = Column(
        String(100)
    )

    recommendation = Column(Text)

    priority = Column(
        String(20)
    )

    status = Column(
        String(20),
        default="PENDING"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )