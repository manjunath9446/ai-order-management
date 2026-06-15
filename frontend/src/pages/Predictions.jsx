import { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {

      const response =
        await api.get("/orders/");

      setOrders(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen p-10">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-10">
        Order Management
      </h1>

      <div className="bg-zinc-900 rounded-3xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="p-4 text-left">
                Order
              </th>

              <th className="p-4 text-left">
                Lens Type
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                SLA
              </th>

              <th className="p-4 text-left">
                Inventory
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t border-zinc-800"
              >

                <td className="p-4">
                  {order.order_number}
                </td>

                <td className="p-4">
                  {order.lens_type}
                </td>

                <td className="p-4">
                  {order.status}
                </td>

                <td className="p-4">
                  {order.sla_hours} hrs
                </td>

                <td className="p-4">
                  {order.inventory_available
                    ? "✅"
                    : "❌"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}