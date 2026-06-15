import { useState } from "react";
import api from "../api/api";

export default function OperationsLab() {

  const [form, setForm] = useState({
    power: -2.5,
    inventory_available: 1,
    queue_depth: 15,
    machine_load: 70,
    utilization_percent: 75,
    qc_failures: 1,
    sla_hours: 72
  });

  const [prediction, setPrediction] = useState(null);

  async function runSimulation() {

    try {

      const riskResponse =
        await api.post(
          "/predict/risk",
          form
        );

      setPrediction(
        riskResponse.data
      );

    } catch (err) {

      console.log(err);

    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-4">
        AI Operations Simulator
      </h1>

      <p className="text-zinc-400 mb-10">
        Simulate operational conditions and see how AI responds.
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        {/* INPUTS */}

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-2xl font-bold mb-6">
            Operational Inputs
          </h2>

          <div className="space-y-4">

            <input
              type="number"
              placeholder="Power"
              value={form.power}
              onChange={(e)=>
                setForm({
                  ...form,
                  power:Number(e.target.value)
                })
              }
              className="w-full p-3 bg-zinc-800 rounded-xl"
            />

            <input
              type="number"
              placeholder="Inventory"
              value={form.inventory_available}
              onChange={(e)=>
                setForm({
                  ...form,
                  inventory_available:Number(e.target.value)
                })
              }
              className="w-full p-3 bg-zinc-800 rounded-xl"
            />

            <input
              type="number"
              placeholder="Queue Depth"
              value={form.queue_depth}
              onChange={(e)=>
                setForm({
                  ...form,
                  queue_depth:Number(e.target.value)
                })
              }
              className="w-full p-3 bg-zinc-800 rounded-xl"
            />

            <input
              type="number"
              placeholder="Machine Load"
              value={form.machine_load}
              onChange={(e)=>
                setForm({
                  ...form,
                  machine_load:Number(e.target.value)
                })
              }
              className="w-full p-3 bg-zinc-800 rounded-xl"
            />

            <input
              type="number"
              placeholder="Utilization %"
              value={form.utilization_percent}
              onChange={(e)=>
                setForm({
                  ...form,
                  utilization_percent:Number(e.target.value)
                })
              }
              className="w-full p-3 bg-zinc-800 rounded-xl"
            />

            <input
              type="number"
              placeholder="QC Failures"
              value={form.qc_failures}
              onChange={(e)=>
                setForm({
                  ...form,
                  qc_failures:Number(e.target.value)
                })
              }
              className="w-full p-3 bg-zinc-800 rounded-xl"
            />

            <button
              onClick={runSimulation}
              className="
              w-full
              bg-white
              text-black
              py-3
              rounded-xl
              font-semibold
              "
            >
              Run AI Simulation
            </button>

          </div>

        </div>

        {/* OUTPUT */}

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-2xl font-bold mb-6">
            AI Analysis
          </h2>

          {prediction ? (

            <div className="space-y-8">

              <div>
                <p className="text-zinc-400">
                  Predicted Completion Time
                </p>

                <h3 className="text-5xl font-bold">
                  {prediction.predicted_completion_hours}
                  hrs
                </h3>
              </div>

              <div>
                <p className="text-zinc-400">
                  Risk Level
                </p>

                <h3
                  className={
                    prediction.risk === "HIGH"
                      ? "text-red-500 text-5xl font-bold"
                      : prediction.risk === "MEDIUM"
                      ? "text-yellow-500 text-5xl font-bold"
                      : "text-green-500 text-5xl font-bold"
                  }
                >
                  {prediction.risk}
                </h3>
              </div>

              <div className="bg-zinc-800 p-5 rounded-xl">

                <h4 className="font-bold mb-2">
                  AI Recommendation
                </h4>

                {
                  prediction.risk === "HIGH"
                    ? "Increase inventory, reduce queue depth and rebalance machine capacity."
                    : prediction.risk === "MEDIUM"
                    ? "Monitor operational load and prevent bottlenecks."
                    : "Operations are healthy."
                }

              </div>

            </div>

          ) : (

            <div className="text-zinc-500">
              Run simulation to view AI analysis.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}