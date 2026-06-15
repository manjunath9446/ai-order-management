import { useState } from "react";
import api from "../api/api";

export default function RootCause() {
  const [orderId, setOrderId] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    try {
      setLoading(true);

      const response = await api.get(
        `/ai/root-cause/${orderId}`
      );

      setResult(response.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        AI Root Cause Analysis
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-zinc-900 rounded-3xl p-8">

          <label className="block mb-3 text-zinc-400">
            Order ID
          </label>

          <input
            type="number"
            value={orderId}
            onChange={(e) =>
              setOrderId(e.target.value)
            }
            className="w-full p-3 rounded-xl bg-zinc-800"
          />

          <button
            onClick={analyze}
            className="
            mt-6
            bg-white
            text-black
            px-6
            py-3
            rounded-xl
            font-semibold
            "
          >
            Analyze Order
          </button>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-8">

          {loading ? (
            <p>Analyzing...</p>
          ) : result ? (
            <div className="space-y-8">

              <div>
                <h3 className="text-xl font-bold mb-3">
                  Root Causes
                </h3>

                <ul className="list-disc ml-5 space-y-2">
                  {result.root_causes?.map(
                    (cause, idx) => (
                      <li key={idx}>
                        {cause}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  Business Impact
                </h3>

                <p className="text-zinc-300">
                  {result.business_impact}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  Recommended Fixes
                </h3>

                <ul className="list-disc ml-5 space-y-2">
                  {result.recommended_fix?.map(
                    (fix, idx) => (
                      <li key={idx}>
                        {fix}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">
                  Priority
                </h3>

                <span
                  className={`
                  px-4 py-2 rounded-xl font-bold
                  ${
                    result.priority === "HIGH"
                      ? "bg-red-600"
                      : result.priority === "MEDIUM"
                      ? "bg-yellow-500 text-black"
                      : "bg-green-600"
                  }
                  `}
                >
                  {result.priority}
                </span>
              </div>

            </div>
          ) : (
            <p className="text-zinc-500">
              Select an order and run analysis.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}