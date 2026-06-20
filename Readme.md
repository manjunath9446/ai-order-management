# AI-Powered Order Management System

An intelligent order fulfillment platform that combines Order Management, Inventory Management, SLA Monitoring, Machine Learning Risk Prediction, Root Cause Analysis, AI Alerts, and AI Recommendations into a single operational dashboard.

---

# Overview

Traditional order management systems are reactive and identify delays only after SLA breaches occur.

This project introduces an AI-driven operations platform that proactively predicts delays, identifies bottlenecks, generates alerts, and recommends corrective actions before customer commitments are impacted.

---

# Key Features

### Order Management

* Create and manage customer orders
* Track order lifecycle
* Status history tracking
* SLA monitoring

### Inventory Management

* Lens inventory tracking
* Inventory availability validation
* Stock visibility

### AI Risk Prediction

* Turnaround Time (TAT) prediction
* Delay probability estimation
* SLA breach detection

### Root Cause Analysis

* Inventory shortage detection
* Machine overload detection
* Queue bottleneck analysis
* QC failure analysis

### AI Operations Center

* AI-generated alerts
* Recommended actions
* Operational intelligence dashboard

### AI Copilot

* Natural language operational queries
* Business insights generation
* Order risk explanation

### SLA Dashboard

* SLA tracking
* High-risk order monitoring
* Performance visibility

---

# System Architecture

Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

Backend

* FastAPI
* SQLAlchemy
* Pydantic

Database

* SQLite

AI Layer

* Scikit-Learn
* Pandas
* Joblib
* Groq LLM API

Deployment

* Render

---

# Project Structure

```bash
ai-order-management/

├── backend/
│
├── app/
│ ├── routes/
│ ├── services/
│ ├── models.py
│ ├── schemas.py
│ ├── crud.py
│ ├── database.py
│ └── main.py
│
├── models_ai/
│ ├── risk_model.pkl
│ ├── train_model.py
│ └── datasets
│
└── requirements.txt

frontend/

├── src/
│ ├── pages/
│ ├── components/
│ ├── layouts/
│ ├── api/
│ └── App.jsx
│
└── package.json
```

---

# AI Workflow

Whenever a new order is created:

1. Inventory Validation
2. Order Creation
3. AI Prediction
4. Risk Classification
5. Root Cause Analysis
6. Alert Generation
7. Recommended Action Generation
8. Dashboard Update

This creates a fully automated operational intelligence workflow.

---

# Machine Learning Model

### Input Features

* Power
* Inventory Availability
* Queue Depth
* Machine Load
* Utilization Percentage
* QC Failures
* SLA Hours

### Outputs

* Predicted Completion Time
* Delay Probability
* Risk Level

### Risk Categories

| Risk Level | Description                    |
| ---------- | ------------------------------ |
| LOW        | Order expected within SLA      |
| MEDIUM     | Potential SLA breach risk      |
| HIGH       | High probability of SLA breach |

---

# API Endpoints

### Orders

```http
POST /orders/
GET /orders/
GET /orders/{id}
PATCH /orders/{id}/status
```

### Inventory

```http
POST /inventory/
GET /inventory/
POST /inventory/check
```

### AI Prediction

```http
POST /predict/tat
POST /predict/risk
POST /predict/save
```

### Alerts

```http
GET /alerts/
GET /alerts/summary
```

### AI Actions

```http
GET /actions/
```

### AI Operations

```http
GET /ai/summary
POST /ai/chat
```

---

# Deployment URLs

### Frontend

```text
https://ai-order-management-1.onrender.com
```

### Backend

```text
https://ai-order-management.onrender.com
```

### Swagger API Documentation

```text
https://ai-order-management.onrender.com/docs
```

---

# Challenges Solved

### AI Integration

Integrated prediction engines, alerts, recommendations, and Copilot into a single workflow.

### Full Stack Synchronization

Connected React frontend with FastAPI backend using REST APIs.

### Deployment Challenges

Resolved:

* CORS issues
* Environment variable configuration
* Model loading issues
* Cloud deployment compatibility

### Operational Intelligence

Implemented proactive monitoring instead of traditional reactive tracking.

---

# Future Enhancements

* Real-time notifications
* Email and SMS alerts
* PostgreSQL migration
* Multi-factory support
* Advanced forecasting models
* Agentic AI Operations Assistant
* Real-time analytics dashboards

---

# Author

Manjunath R Karaguppi

GitHub:
https://github.com/manjunath9446

LinkedIn:
https://linkedin.com/in/manjunathrk

Email:
[manju.r.k9446@gmail.com](mailto:manju.r.k9446@gmail.com)

---
