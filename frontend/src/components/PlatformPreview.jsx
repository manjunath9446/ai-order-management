import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function PlatformPreview() {

const [summary, setSummary] = useState(null);
const [alerts, setAlerts] = useState(null);

useEffect(() => {
loadData();
}, []);

async function loadData() {


try {

  const ai =
    await api.get("/ai/summary");

  const alertData =
    await api.get("/alerts/summary");

  setSummary(ai.data);
  setAlerts(alertData.data);

} catch (err) {

  console.log(err);

}


}

if (!summary || !alerts) {
return null;
}

const total =
summary.total_predictions || 1;

const riskPercent =
Math.round(
(summary.high_risk / total) * 100
);

return ( <section className="py-32 px-8 max-w-7xl mx-auto">


  <div className="mb-16">

    <p className="text-zinc-500 uppercase tracking-widest">
      Platform
    </p>

    <h2 className="text-6xl font-bold mt-4">
      Control Center
    </h2>

  </div>

  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="
    rounded-[40px]
    border
    border-zinc-800
    bg-gradient-to-b
    from-zinc-900
    to-black
    p-10
    "
  >

    {/* TOP METRICS */}

    <div className="grid md:grid-cols-4 gap-6 mb-12">

      <div className="bg-black rounded-3xl p-6 border border-zinc-800">

        <h3 className="text-zinc-400">
          Predictions
        </h3>

        <p className="text-5xl font-bold mt-4">
          {summary.total_predictions}
        </p>

      </div>

      <div className="bg-black rounded-3xl p-6 border border-zinc-800">

        <h3 className="text-zinc-400">
          High Risk
        </h3>

        <p className="text-5xl font-bold mt-4 text-red-400">
          {summary.high_risk}
        </p>

      </div>

      <div className="bg-black rounded-3xl p-6 border border-zinc-800">

        <h3 className="text-zinc-400">
          Open Alerts
        </h3>

        <p className="text-5xl font-bold mt-4">
          {alerts.open_alerts}
        </p>

      </div>

      <div className="bg-black rounded-3xl p-6 border border-zinc-800">

        <h3 className="text-zinc-400">
          Risk %
        </h3>

        <p className="text-5xl font-bold mt-4">
          {riskPercent}%
        </p>

      </div>

    </div>

    {/* VISUAL SECTION */}

    <div className="grid md:grid-cols-2 gap-8">

      <div className="bg-black rounded-3xl p-8 border border-zinc-800">

        <h3 className="text-xl font-bold mb-6">
          Risk Distribution
        </h3>

        <div className="space-y-6">

          <div>
            <div className="flex justify-between mb-2">
              <span>High Risk</span>
              <span>{summary.high_risk}</span>
            </div>

            <div className="w-full h-3 bg-zinc-800 rounded-full">
              <div
                className="h-3 bg-red-500 rounded-full"
                style={{
                  width: `${riskPercent}%`
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>Medium Risk</span>
              <span>{summary.medium_risk}</span>
            </div>

            <div className="w-full h-3 bg-zinc-800 rounded-full">
              <div
                className="h-3 bg-yellow-500 rounded-full"
                style={{
                  width: "40%"
                }}
              />
            </div>
          </div>

        </div>

      </div>

      <div className="bg-black rounded-3xl p-8 border border-zinc-800">

        <h3 className="text-xl font-bold mb-6">
          AI Activity Feed
        </h3>

        <div className="space-y-4 text-zinc-300">

          <div>
            AI prediction engine analyzed orders
          </div>

          <div>
            Root cause analysis generated
          </div>

          <div>
            Copilot recommendations created
          </div>

          <div>
            AI actions generated automatically
          </div>

        </div>

      </div>

    </div>

  </motion.div>

</section>

);
}
