import { useEffect, useState } from "react";
import api from "../api/api";

export default function SLADashboard() {

  const [sla, setSla] = useState([]);
  const [riskOrders, setRiskOrders] =
    useState([]);
  const [lowStock, setLowStock] =
    useState([]);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      const slaResponse =
        await api.get(
          "/dashboard/sla"
        );

      const riskResponse =
        await api.get(
          "/dashboard/at-risk"
        );

      const stockResponse =
        await api.get(
          "/dashboard/low-stock"
        );

      setSla(
        slaResponse.data
      );

      setRiskOrders(
        riskResponse.data
      );

      setLowStock(
        stockResponse.data
      );

    } catch(error) {

      console.error(error);

    }

  }

  return (

    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-10">
        SLA & Breach Dashboard
      </h1>

      {/* SLA ORDERS */}

      <div className="mb-10">

        <h2 className="text-3xl font-bold mb-4">
          SLA Monitoring
        </h2>

        <div className="bg-zinc-900 rounded-3xl overflow-hidden">

          <table className="w-full">

            <thead className="bg-zinc-800">

              <tr>

                <th className="p-4 text-left">
                  Order
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  SLA
                </th>

                <th className="p-4 text-left">
                  Remaining
                </th>

              </tr>

            </thead>

            <tbody>

              {sla.map((order) => (

                <tr
                  key={order.id}
                  className="border-t border-zinc-800"
                >

                  <td className="p-4">
                    {order.order_number}
                  </td>

                  <td className="p-4">
                    {order.status}
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
                        {order.remaining_hours ?? "N/A"}
                            {" "}
                             hrs
                        </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* AT RISK */}

      <div className="mb-10">

        <h2 className="text-3xl font-bold mb-4">
          At Risk Orders
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          {riskOrders.map((order) => (

            <div
              key={order.id}
              className="
              bg-zinc-900
              p-6
              rounded-3xl
              "
            >

              <h3 className="font-bold">
                {order.order_number}
              </h3>

              <p className="mt-2 text-red-400">
                High Risk
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* LOW STOCK */}

      <div>

        <h2 className="text-3xl font-bold mb-4">
          Low Stock Inventory
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          {lowStock.map((item) => (

            <div
              key={item.id}
              className="
              bg-zinc-900
              p-6
              rounded-3xl
              "
            >

              <h3 className="font-bold">
                {item.lens_type}
              </h3>

              <p>
                Power:
                {" "}
                {item.power}
              </p>

              <p>
                Qty:
                {" "}
                {item.quantity}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}