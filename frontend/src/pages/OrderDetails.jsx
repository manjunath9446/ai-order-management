import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function OrderDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);

  const [newStatus, setNewStatus] =
    useState("");

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {

    try {

      const response =
        await api.get(
          `/orders/${id}`
        );

      const historyResponse =
        await api.get(
          `/orders/${id}/history`
        );

      setOrder(
        response.data
      );

      setHistory(
        historyResponse.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  async function openRootCause() {

    try {

      const response =
        await api.get(
          `/ai/root-cause/${id}`
        );

      alert(
        JSON.stringify(
          response.data,
          null,
          2
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Root Cause Analysis Failed"
      );

    }
  }

  function openPredictionSimulator() {

    navigate(
      "/simulator"
    );

  }

  async function updateStatus() {

    if (!newStatus) {

      alert(
        "Please Select Status"
      );

      return;
    }

    try {

      await api.patch(
        `/orders/${id}/status`,
        {
          status: newStatus,
          reason: reason
        }
      );

      alert(
        "Status Updated Successfully"
      );

      setNewStatus("");
      setReason("");

      loadOrder();

    } catch (error) {

      console.error(error);

      alert(
        "Failed To Update Status"
      );

    }
  }

  if (!order) {

    return (
      <div className="bg-black text-white min-h-screen p-10">
        Loading...
      </div>
    );

  }

  return (

    <div className="bg-black text-white min-h-screen p-10">

      <button
        onClick={() =>
          navigate("/orders")
        }
        className="
        mb-8
        bg-zinc-800
        px-4
        py-2
        rounded-xl
        "
      >
        ← Back To Orders
      </button>

      <h1 className="text-5xl font-bold mb-10">
        Order {order.order_number}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-2xl font-bold mb-6">
            Order Information
          </h2>

          <div className="space-y-4">

            <p>
              <strong>Status:</strong>{" "}
              {order.status}
            </p>

            <p>
              <strong>Lens Type:</strong>{" "}
              {order.lens_type}
            </p>

            <p>
              <strong>Lens Index:</strong>{" "}
              {order.lens_index}
            </p>

            <p>
              <strong>Power:</strong>{" "}
              {order.power}
            </p>

            <p>
              <strong>Coating:</strong>{" "}
              {order.coating}
            </p>

            <p>
              <strong>Frame:</strong>{" "}
              {order.frame_name}
            </p>

            <p>
              <strong>Inventory:</strong>{" "}
              {order.inventory_available
                ? "Available"
                : "Not Available"}
            </p>

          </div>

        </div>

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-2xl font-bold mb-6">
            SLA & Operations
          </h2>

          <div className="space-y-4">

            <p>
              <strong>SLA:</strong>{" "}
              {order.sla_hours} hrs
            </p>

            <p>
              <strong>Queue Depth:</strong>{" "}
              {order.queue_depth}
            </p>

            <p>
              <strong>Machine Load:</strong>{" "}
              {order.machine_load}
            </p>

            <p>
              <strong>Utilization:</strong>{" "}
              {order.utilization_percent}%
            </p>

            <p>
              <strong>QC Failures:</strong>{" "}
              {order.qc_failures}
            </p>

            <p>
              <strong>Breached:</strong>{" "}
              {order.is_breached
                ? "Yes"
                : "No"}
            </p>

          </div>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <button
          onClick={updateStatus}
          className="
          bg-white
          text-black
          p-4
          rounded-2xl
          font-semibold
          "
        >
          Update Status
        </button>

        <button
          onClick={openRootCause}
          className="
          bg-zinc-800
          p-4
          rounded-2xl
          hover:bg-zinc-700
          "
        >
          Root Cause Analysis
        </button>

        <button
          onClick={openPredictionSimulator}
          className="
          bg-zinc-800
          p-4
          rounded-2xl
          hover:bg-zinc-700
          "
        >
          Predict Risk
        </button>

      </div>

      <div className="mt-10 bg-zinc-900 p-8 rounded-3xl">

        <h2 className="text-2xl font-bold mb-6">
          Update Order Status
        </h2>

        <select
          value={newStatus}
          onChange={(e) =>
            setNewStatus(
              e.target.value
            )
          }
          className="
          w-full
          p-3
          rounded-xl
          bg-zinc-800
          mb-4
          "
        >
          <option value="">
            Select Status
          </option>

          <option value="PLACED">
            PLACED
          </option>

          <option value="IN_PRODUCTION">
            IN_PRODUCTION
          </option>

          <option value="QC">
            QC
          </option>

          <option value="READY">
            READY
          </option>

          <option value="DELIVERED">
            DELIVERED
          </option>

        </select>

        <textarea
          rows="4"
          placeholder="Reason for delay / remarks"
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
          className="
          w-full
          p-3
          rounded-xl
          bg-zinc-800
          "
        />

        <button
          onClick={updateStatus}
          className="
          mt-4
          bg-green-500
          text-black
          px-6
          py-3
          rounded-xl
          font-bold
          "
        >
          Save Status
        </button>

      </div>

      <div className="mt-10 bg-zinc-900 p-8 rounded-3xl">

        <h2 className="text-2xl font-bold mb-6">
          Status Timeline
        </h2>

        {history.length > 0 ? (

          history.map((item) => (

            <div
              key={item.id}
              className="
              border-b
              border-zinc-800
              py-4
              "
            >

              <p>
                <strong>
                  {item.old_status}
                </strong>{" "}
                →
                <strong>
                  {" "}
                  {item.new_status}
                </strong>
              </p>

              <p className="text-zinc-400">
                {item.reason}
              </p>

            </div>

          ))

        ) : (

          <p className="text-zinc-500">
            No Status History Found
          </p>

        )}

      </div>

    </div>

  );
}
async function runAI() {

  try {

    await api.post(
      `/ai/predict-order/${id}`
    );

    await api.post(
      "/alerts/generate"
    );

    await api.post(
      "/actions/generate"
    );

    alert(
      "AI Analysis Completed"
    );

  } catch(error) {

    console.error(error);

    alert(
      "AI Analysis Failed"
    );

  }

}