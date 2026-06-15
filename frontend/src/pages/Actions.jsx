import { useEffect, useState } from "react";
import api from "../api/api";

export default function Actions() {

  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActions();
  }, []);

  async function loadActions() {
    try {

      const response =
        await api.get("/actions/");

      setActions(response.data);

    } catch (err) {

      console.log(err);

    }
  }

  async function generateActions() {

    try {

      setLoading(true);

      await api.post(
        "/actions/generate"
      );

      await loadActions();

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  }

  async function approveAction(id) {

    try {

      await api.patch(
        `/actions/${id}/approve`
      );

      await loadActions();

    } catch (err) {

      console.log(err);

    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">
          AI Actions Center
        </h1>

        <button
          onClick={generateActions}
          className="
          bg-white
          text-black
          px-6
          py-3
          rounded-xl
          font-semibold
          "
        >
          {loading
            ? "Generating..."
            : "Generate Actions"}
        </button>

      </div>

      <div className="grid gap-6">

        {actions.map((action) => (

          <div
            key={action.id}
            className="
            bg-zinc-900
            rounded-3xl
            p-8
            border border-zinc-800
            "
          >

            <div className="flex justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Order #{action.order_id}
                </h2>

                <p className="text-zinc-400 mt-2">
                  {action.recommendation}
                </p>

              </div>

              <div>

                <span
                  className="
                  bg-red-500
                  px-4
                  py-2
                  rounded-xl
                  font-bold
                  "
                >
                  {action.priority}
                </span>

              </div>

            </div>

            <div className="mt-6 flex gap-4">

              <button
                onClick={() =>
                  approveAction(action.id)
                }
                className="
                bg-green-600
                px-5
                py-2
                rounded-xl
                "
              >
                Approve
              </button>

              <div
                className="
                px-4
                py-2
                rounded-xl
                bg-zinc-800
                "
              >
                {action.status}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}