import { useEffect, useState } from "react";
import api from "../api/api";

export default function Alerts() {

  const [alerts, setAlerts] =
    useState([]);

  const [summary, setSummary] =
    useState(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {

    try {

      const alertData =
        await api.get("/alerts/");

      const summaryData =
        await api.get(
          "/alerts/summary"
        );

      setAlerts(
        alertData.data
      );

      setSummary(
        summaryData.data
      );

    } catch(error) {

      console.error(error);

    }

  }

  async function generateAlerts() {

    try {

      await api.post(
        "/alerts/generate"
      );

      alert(
        "Alerts Generated"
      );

      loadAlerts();

    } catch(error) {

      console.error(error);

    }

  }

  return (

    <div className="bg-black text-white min-h-screen p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">
          AI Alerts Center
        </h1>

        <button
          onClick={generateAlerts}
          className="
          bg-red-500
          text-white
          px-6
          py-3
          rounded-xl
          font-semibold
          "
        >
          Generate Alerts
        </button>

      </div>

      {summary && (

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 p-6 rounded-3xl">
            <h3>Open Alerts</h3>

            <p className="text-5xl mt-4">
              {summary.open_alerts}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl">
            <h3>Critical</h3>

            <p className="text-5xl mt-4 text-red-500">
              {summary.high_severity || 0}
            </p>
          </div>

          <div className="bg-zinc-900 p-6 rounded-3xl">
            <h3>Medium</h3>

            <p className="text-5xl mt-4 text-yellow-400">
              {summary.medium_severity || 0}
            </p>
          </div>

        </div>

      )}

      <div className="bg-zinc-900 rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="p-4 text-left">
                ID
              </th>

              <th className="p-4 text-left">
                Severity
              </th>

              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Message
              </th>

              <th className="p-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {alerts.map((alert) => (

              <tr
                key={alert.id}
                className="
                border-t
                border-zinc-800
                "
              >

                <td className="p-4">
                  {alert.id}
                </td>

                <td className="p-4">

                  <span
                    className={
                      alert.severity === "HIGH"
                      ? "text-red-500 font-bold"
                      : "text-yellow-400"
                    }
                  >
                    {alert.severity}
                  </span>

                </td>

                <td className="p-4">
                  {alert.title}
                </td>

                <td className="p-4">
                  {alert.message}
                </td>

                <td className="p-4">
                  {alert.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}