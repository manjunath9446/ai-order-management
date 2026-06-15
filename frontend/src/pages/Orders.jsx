import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [statusFilter, setStatusFilter] =
    useState("");

  const [lensFilter, setLensFilter] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    try {

      const response =
        await api.get("/orders/");

      setOrders(response.data);
      setFilteredOrders(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  function applyFilters(
    status,
    lens
  ) {

    let data = [...orders];

    if (status) {

      data = data.filter(
        (o) =>
          o.status === status
      );

    }

    if (lens) {

      data = data.filter(
        (o) =>
          o.lens_type === lens
      );

    }

    setFilteredOrders(data);
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

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-5xl font-bold">
          Order Management
        </h1>

        <button
          onClick={loadOrders}
          className="
          bg-white
          text-black
          px-6
          py-3
          rounded-xl
          font-semibold
          "
        >
          Refresh
        </button>

      </div>

      {/* FILTERS */}

      <div className="flex gap-4 mb-6">

        <select
          value={statusFilter}
          onChange={(e) => {

            setStatusFilter(
              e.target.value
            );

            applyFilters(
              e.target.value,
              lensFilter
            );

          }}
          className="
          bg-zinc-800
          p-3
          rounded-xl
          "
        >

          <option value="">
            All Status
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

        <select
          value={lensFilter}
          onChange={(e) => {

            setLensFilter(
              e.target.value
            );

            applyFilters(
              statusFilter,
              e.target.value
            );

          }}
          className="
          bg-zinc-800
          p-3
          rounded-xl
          "
        >

          <option value="">
            All Lens Types
          </option>

          <option value="Single Vision">
            Single Vision
          </option>

          <option value="Progressive">
            Progressive
          </option>

        </select>

      </div>

      <div
        className="
        bg-zinc-900
        rounded-3xl
        overflow-hidden
        border
        border-zinc-800
        "
      >

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
                SLA Status
              </th>

              <th className="p-4 text-left">
                Inventory
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="
                  p-10
                  text-center
                  text-zinc-500
                  "
                >
                  No Orders Found
                </td>

              </tr>

            ) : (

              filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="
                  border-t
                  border-zinc-800
                  hover:bg-zinc-800/40
                  "
                >

                  <td className="p-4 font-medium">
                    {order.order_number}
                  </td>

                  <td className="p-4">
                    {order.lens_type}
                  </td>

                  <td className="p-4">

                    <span
                      className="
                      px-3
                      py-1
                      rounded-lg
                      bg-zinc-800
                      "
                    >
                      {order.status}
                    </span>

                  </td>

                  <td className="p-4">
                    {order.sla_hours} hrs
                  </td>

                  <td className="p-4">

                    {order.is_breached ? (

                      <span className="text-red-500 font-bold">
                        🔴 BREACHED
                      </span>

                    ) : (

                      <span className="text-green-400">
                        🟢 ACTIVE
                      </span>

                    )}

                  </td>

                  <td className="p-4">

                    {order.inventory_available ? (

                      <span className="text-green-400">
                        ✅ Available
                      </span>

                    ) : (

                      <span className="text-red-400">
                        ❌ Not Available
                      </span>

                    )}

                  </td>

                  <td className="p-4">

                    <Link
                      to={`/orders/${order.id}`}
                      className="
                      bg-white
                      text-black
                      px-4
                      py-2
                      rounded-xl
                      font-semibold
                      "
                    >
                      View
                    </Link>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );
}