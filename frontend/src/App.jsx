import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Predictions from "./pages/Predictions";
import Alerts from "./pages/Alerts";
import Copilot from "./pages/Copilot";
import Actions from "./pages/Actions";
import OperationsLab from "./pages/OperationsLab";
import RootCause from "./pages/RootCause";
import PredictionSimulator from "./pages/PredictionSimulator";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Inventory from "./pages/Inventory";
import CreateOrder from "./pages/CreateOrder";
import OrderAI from "./pages/OrderAI";
import SLADashboard from "./pages/SLADashboard";
export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/predictions"
          element={<Predictions />}
        />

        <Route
          path="/alerts"
          element={<Alerts />}
        />

        <Route
          path="/copilot"
          element={<Copilot />}
        />

        <Route
          path="/actions"
          element={<Actions />}
        />
        <Route
        path="/simulator"
        element={<PredictionSimulator />}
        />
        <Route
  path="/lab"
  element={<OperationsLab />}
/>
        <Route
  path="/root-cause"
  element={<RootCause />}
/>
<Route
  path="/orders"
  element={<Orders />}
/>
<Route
  path="/orders/:id"
  element={<OrderDetails />}
/>
<Route
  path="/inventory"
  element={<Inventory />}
/>
<Route
  path="/create-order"
  element={<CreateOrder />}
/>
<Route
  path="/order-ai/:id"
  element={<OrderAI />}
/>
<Route
  path="/sla-dashboard"
  element={<SLADashboard />}
/>
      </Routes>

    </BrowserRouter>
  );
}