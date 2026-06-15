import { useState } from "react";
import api from "../api/api";

export default function CreateOrder() {
  const [order, setOrder] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",

    store_id: 1,

    power: "",
    lens_type: "",
    lens_index: "",
    coating: "",
    frame_name: "",

    sla_hours: 72
  });

  const [inventoryResult, setInventoryResult] =
    useState(null);

  async function checkInventory() {
    try {
      const response =
        await api.post(
          "/inventory/check",
          {
            power: order.power,
            lens_type: order.lens_type,
            lens_index: order.lens_index
          }
        );

      setInventoryResult(
        response.data
      );
    } catch (error) {
      console.error(error);

      alert(
        "Inventory Check Failed"
      );
    }
  }

  async function createOrder() {
    try {
      const response =
        await api.post(
          "/orders/",
          order
        );

      alert(
        `Order Created Successfully: ${response.data.order_number}`
      );

      setOrder({
        customer_name: "",
        customer_phone: "",
        customer_email: "",

        store_id: 1,

        power: "",
        lens_type: "",
        lens_index: "",
        coating: "",
        frame_name: "",

        sla_hours: 72
      });

      setInventoryResult(null);

    } catch (error) {
      console.error(error);

      if (
        error.response?.data
      ) {
        alert(
          JSON.stringify(
            error.response.data,
            null,
            2
          )
        );
      } else {
        alert(
          "Failed To Create Order"
        );
      }
    }
  }

  return (
    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-10">
        Create New Order
      </h1>

      <div className="bg-zinc-900 p-8 rounded-3xl max-w-6xl">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Customer Name"
            className="p-3 rounded bg-zinc-800"
            value={order.customer_name}
            onChange={(e) =>
              setOrder({
                ...order,
                customer_name:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Customer Phone"
            className="p-3 rounded bg-zinc-800"
            value={order.customer_phone}
            onChange={(e) =>
              setOrder({
                ...order,
                customer_phone:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Customer Email"
            className="p-3 rounded bg-zinc-800"
            value={order.customer_email}
            onChange={(e) =>
              setOrder({
                ...order,
                customer_email:
                  e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Store ID"
            className="p-3 rounded bg-zinc-800"
            value={order.store_id}
            onChange={(e) =>
              setOrder({
                ...order,
                store_id: Number(
                  e.target.value
                )
              })
            }
          />

          <input
            placeholder="Power"
            className="p-3 rounded bg-zinc-800"
            value={order.power}
            onChange={(e) =>
              setOrder({
                ...order,
                power:
                  e.target.value
              })
            }
          />

          <select
            className="p-3 rounded bg-zinc-800"
            value={order.lens_type}
            onChange={(e) =>
              setOrder({
                ...order,
                lens_type:
                  e.target.value
              })
            }
          >
            <option value="">
              Select Lens Type
            </option>

            <option value="Single Vision">
              Single Vision
            </option>

            <option value="Progressive">
              Progressive
            </option>

            <option value="Bifocal">
              Bifocal
            </option>
          </select>

          <input
            placeholder="Lens Index"
            className="p-3 rounded bg-zinc-800"
            value={order.lens_index}
            onChange={(e) =>
              setOrder({
                ...order,
                lens_index:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Coating"
            className="p-3 rounded bg-zinc-800"
            value={order.coating}
            onChange={(e) =>
              setOrder({
                ...order,
                coating:
                  e.target.value
              })
            }
          />

          <input
            placeholder="Frame Name"
            className="p-3 rounded bg-zinc-800"
            value={order.frame_name}
            onChange={(e) =>
              setOrder({
                ...order,
                frame_name:
                  e.target.value
              })
            }
          />

          <select
            className="p-3 rounded bg-zinc-800"
            value={order.sla_hours}
            onChange={(e) =>
              setOrder({
                ...order,
                sla_hours: Number(
                  e.target.value
                )
              })
            }
          >
            <option value={24}>
              24 Hours
            </option>

            <option value={48}>
              48 Hours
            </option>

            <option value={72}>
              72 Hours
            </option>
          </select>

        </div>

        <button
          onClick={checkInventory}
          className="
          mt-6
          w-full
          bg-blue-600
          py-3
          rounded-xl
          font-bold
          "
        >
          Check Inventory
        </button>

        {inventoryResult && (
          <div
            className="
            mt-6
            bg-zinc-800
            p-5
            rounded-xl
            "
          >
            <h3 className="font-bold mb-3">
              Inventory Result
            </h3>

            <p>
              Status:
              {" "}
              {inventoryResult.available ? (
                <span className="text-green-400">
                  ✅ Available
                </span>
              ) : (
                <span className="text-red-500">
                  ❌ Not Available
                </span>
              )}
            </p>

            <p className="mt-2">
              Quantity:
              {" "}
              {inventoryResult.quantity}
            </p>
          </div>
        )}

        <button
          onClick={createOrder}
          disabled={!inventoryResult}
          className="
          mt-6
          w-full
          bg-green-500
          text-black
          py-3
          rounded-xl
          font-bold
          disabled:opacity-50
          "
        >
          Create Order
        </button>

      </div>
    </div>
  );
}