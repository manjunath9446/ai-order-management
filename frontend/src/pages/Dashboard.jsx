import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [actions, setActions] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const ai =
        await api.get("/ai/summary");

      const alertSummary =
        await api.get("/alerts/summary");

      const actionData =
        await api.get("/actions/");

      setSummary(ai.data);
      setAlerts(alertSummary.data);
      setActions(actionData.data);

    } catch (err) {

      console.log(err);

    }

  }

  async function askCopilot() {

    try {

      const response =
        await api.post(
          "/ai/chat",
          {
            question
          }
        );

      setAnswer(
        response.data.answer
      );

    } catch (err) {

      console.log(err);

    }

  }

  if (!summary) {

    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading Dashboard...
      </div>
    );

  }

  return (

    <div className="bg-black text-white min-h-screen flex">

      {/* SIDEBAR */}

      <div className="w-64 bg-zinc-950 border-r border-zinc-800">

        <div className="p-6 border-b border-zinc-800">

          <h1 className="text-2xl font-bold">
            LensAI
          </h1>

          <p className="text-zinc-500 text-sm mt-1">
            Order Operations Platform
          </p>

        </div>

        <div className="p-4 space-y-2">

          <Link
            to="/"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            Dashboard
          </Link>

          <Link
            to="/orders"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            Orders
          </Link>

          <Link
            to="/create-order"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            Create Order
          </Link>

          <Link
            to="/inventory"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            Inventory
          </Link>

          <Link
            to="/sla-dashboard"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            SLA Dashboard
          </Link>

          <Link
            to="/alerts"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            Alerts
          </Link>

          <Link
            to="/actions"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            AI Actions
          </Link>

          <Link
            to="/simulator"
            className="block p-3 rounded-xl hover:bg-zinc-800"
          >
            Prediction Simulator
          </Link>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8 overflow-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            AI-Powered Order Management
          </h1>

          <p className="text-zinc-400 mt-3">
            Real-time monitoring, SLA prediction,
            inventory intelligence and AI operations.
          </p>

        </div>

        {/* KPI */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">

            <p className="text-zinc-400">
              Total Predictions
            </p>

            <h2 className="text-5xl font-bold mt-3">
              {summary.total_predictions}
            </h2>

          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-3xl">

            <p className="text-red-300">
              High Risk Orders
            </p>

            <h2 className="text-5xl font-bold mt-3 text-red-400">
              {summary.high_risk}
            </h2>

          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-3xl">

            <p className="text-yellow-300">
              Medium Risk
            </p>

            <h2 className="text-5xl font-bold mt-3 text-yellow-400">
              {summary.medium_risk}
            </h2>

          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-3xl">

            <p className="text-blue-300">
              Open Alerts
            </p>

            <h2 className="text-5xl font-bold mt-3 text-blue-400">
              {alerts.open_alerts}
            </h2>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* ACTIONS */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              Latest AI Actions
            </h2>

            {actions.slice(0, 5).map((action) => (

              <div
                key={action.id}
                className="border-b border-zinc-800 py-4"
              >

                <div className="font-semibold">
                  Order #{action.order_id}
                </div>

                <div className="text-zinc-400 mt-1">
                  {action.recommendation}
                </div>

                <span className="
                inline-block
                mt-3
                px-3
                py-1
                rounded-full
                bg-red-500/20
                text-red-400
                text-sm
                ">
                  {action.priority}
                </span>

              </div>

            ))}

          </div>

          {/* COPILOT */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-2xl font-bold mb-6">
              AI Copilot
            </h2>

            <input
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Ask AI about orders, delays, bottlenecks..."
              className="
              w-full
              bg-zinc-800
              border
              border-zinc-700
              p-4
              rounded-xl
              "
            />

            <button
              onClick={askCopilot}
              className="
              mt-4
              bg-white
              text-black
              px-6
              py-3
              rounded-xl
              font-semibold
              "
            >
              Ask AI
            </button>

            {answer && (

              <div className="
              mt-6
              bg-zinc-800
              p-5
              rounded-xl
              border
              border-zinc-700
              ">
                {answer}
              </div>

            )}

            <div className="mt-8">

              <p className="text-zinc-500 text-sm mb-3">
                Suggested Questions
              </p>

              <div className="space-y-2 text-sm">

                <div className="bg-zinc-800 p-3 rounded-lg">
                  Which orders may breach SLA?
                </div>

                <div className="bg-zinc-800 p-3 rounded-lg">
                  Show inventory shortages
                </div>

                <div className="bg-zinc-800 p-3 rounded-lg">
                  Identify production bottlenecks
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}