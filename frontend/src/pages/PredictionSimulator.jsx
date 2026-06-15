import { useState } from "react";
import api from "../api/api";

export default function PredictionSimulator() {
  const [form, setForm] = useState({
    power: -2.5,
    inventory_available: 1,
    queue_depth: 15,
    machine_load: 75,
    utilization_percent: 80,
    qc_failures: 1,
    sla_hours: 72,
  });

  const [result, setResult] = useState(null);

  async function predictRisk() {
    try {
      const response = await api.post(
        "/predict/risk",
        form
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function savePrediction() {
    try {
      const response = await api.post(
        "/predict/save",
        form
      );

      alert(
        `Prediction Saved Successfully (#${response.data.id})`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to save prediction");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        AI Operations Simulator
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* LEFT PANEL */}

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-3xl font-bold mb-8">
            Operational Inputs
          </h2>

          <div className="space-y-4">

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="Power"
              value={form.power}
              onChange={(e) =>
                setForm({
                  ...form,
                  power: Number(e.target.value),
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="Inventory Available"
              value={form.inventory_available}
              onChange={(e) =>
                setForm({
                  ...form,
                  inventory_available: Number(
                    e.target.value
                  ),
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="Queue Depth"
              value={form.queue_depth}
              onChange={(e) =>
                setForm({
                  ...form,
                  queue_depth: Number(
                    e.target.value
                  ),
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="Machine Load"
              value={form.machine_load}
              onChange={(e) =>
                setForm({
                  ...form,
                  machine_load: Number(
                    e.target.value
                  ),
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="Utilization %"
              value={form.utilization_percent}
              onChange={(e) =>
                setForm({
                  ...form,
                  utilization_percent: Number(
                    e.target.value
                  ),
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="QC Failures"
              value={form.qc_failures}
              onChange={(e) =>
                setForm({
                  ...form,
                  qc_failures: Number(
                    e.target.value
                  ),
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              type="number"
              placeholder="SLA Hours"
              value={form.sla_hours}
              onChange={(e) =>
                setForm({
                  ...form,
                  sla_hours: Number(
                    e.target.value
                  ),
                })
              }
            />

            <button
              onClick={predictRisk}
              className="
              w-full
              bg-white
              text-black
              py-3
              rounded-xl
              font-bold
              "
            >
              Run AI Simulation
            </button>

            {result && (
              <button
                onClick={savePrediction}
                className="
                w-full
                bg-green-500
                text-black
                py-3
                rounded-xl
                font-bold
                "
              >
                Save Prediction
              </button>
            )}

          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-3xl font-bold mb-8">
            AI Analysis
          </h2>

          {result ? (
            <div className="space-y-8">

              <div>
                <p className="text-zinc-400">
                  Predicted Completion Time
                </p>

                <h3 className="text-6xl font-bold mt-2">
                  {result.predicted_completion_hours}
                  hrs
                </h3>
              </div>

              <div>
                <p className="text-zinc-400">
                  Risk Level
                </p>

                <h3
                  className={`text-5xl font-bold mt-2 ${
                    result.risk === "HIGH"
                      ? "text-red-500"
                      : result.risk === "MEDIUM"
                      ? "text-yellow-400"
                      : "text-green-500"
                  }`}
                >
                  {result.risk}
                </h3>
              </div>

              <div className="bg-zinc-800 p-5 rounded-xl">
                <h4 className="font-semibold mb-2">
                  AI Recommendation
                </h4>

                <p className="text-zinc-300">
                  {result.risk === "HIGH"
                    ? "Immediate intervention required. Reduce queue depth and machine utilization."
                    : result.risk === "MEDIUM"
                    ? "Monitor production closely and optimize workload."
                    : "Operations are healthy."}
                </p>
              </div>

            </div>
          ) : (
            <p className="text-zinc-500">
              Run simulation to view AI insights.
            </p>
          )}

        </div>

      </div>
    </div>
  );
}