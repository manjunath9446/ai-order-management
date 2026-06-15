import { useEffect, useState } from "react";
import api from "../api/api";

export default function Inventory() {

  const [inventory, setInventory] =
    useState([]);

  const [checkForm, setCheckForm] =
    useState({
      power: "",
      lens_type: "",
      lens_index: "",
      coating: ""
    });

  const [newInventory, setNewInventory] =
    useState({
      power: "",
      lens_type: "",
      lens_index: "",
      coating: "",
      quantity: 0
    });

  const [result, setResult] =
    useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {

    try {

      const response =
        await api.get("/inventory/");

      setInventory(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  async function checkInventory() {

    try {

      const response =
        await api.post(
          "/inventory/check",
          checkForm
        );

      setResult(
        response.data
      );

    } catch (error) {

      console.error(error);

    }
  }

  async function addInventory() {

    try {

      await api.post(
        "/inventory/",
        newInventory
      );

      alert(
        "Inventory Added Successfully"
      );

      setNewInventory({
        power: "",
        lens_type: "",
        lens_index: "",
        coating: "",
        quantity: 0
      });

      loadInventory();

    } catch (error) {

      console.error(error);

      alert(
        "Failed To Add Inventory"
      );

    }
  }

  return (

    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-10">
        Lens Inventory Management
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Add Inventory */}

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-2xl font-bold mb-6">
            Add Inventory
          </h2>

          <div className="space-y-4">

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Power"
              value={newInventory.power}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  power: e.target.value
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Lens Type"
              value={newInventory.lens_type}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  lens_type: e.target.value
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Lens Index"
              value={newInventory.lens_index}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  lens_index: e.target.value
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Coating"
              value={newInventory.coating}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  coating: e.target.value
                })
              }
            />

            <input
              type="number"
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Quantity"
              value={newInventory.quantity}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  quantity: Number(
                    e.target.value
                  )
                })
              }
            />

            <button
              onClick={addInventory}
              className="
              w-full
              bg-green-500
              text-black
              py-3
              rounded-xl
              font-bold
              "
            >
              Add Inventory
            </button>

          </div>

        </div>

        {/* Check Inventory */}

        <div className="bg-zinc-900 p-8 rounded-3xl">

          <h2 className="text-2xl font-bold mb-6">
            Inventory Availability Check
          </h2>

          <div className="space-y-4">

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Power"
              value={checkForm.power}
              onChange={(e) =>
                setCheckForm({
                  ...checkForm,
                  power: e.target.value
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Lens Type"
              value={checkForm.lens_type}
              onChange={(e) =>
                setCheckForm({
                  ...checkForm,
                  lens_type: e.target.value
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Lens Index"
              value={checkForm.lens_index}
              onChange={(e) =>
                setCheckForm({
                  ...checkForm,
                  lens_index: e.target.value
                })
              }
            />

            <input
              className="w-full p-3 rounded bg-zinc-800"
              placeholder="Coating"
              value={checkForm.coating}
              onChange={(e) =>
                setCheckForm({
                  ...checkForm,
                  coating: e.target.value
                })
              }
            />

            <button
              onClick={checkInventory}
              className="
              w-full
              bg-white
              text-black
              py-3
              rounded-xl
              font-bold
              "
            >
              Check Inventory
            </button>

          </div>

          {result && (

            <div className="mt-6 bg-zinc-800 p-4 rounded-xl">

              <h3 className="font-bold mb-2">
                Result
              </h3>

              <p>
                Available:
                {" "}
                {result.available
                  ? "✅ Yes"
                  : "❌ No"}
              </p>

              <p>
                Quantity:
                {" "}
                {result.quantity}
              </p>

            </div>

          )}

        </div>

      </div>

      {/* Inventory Table */}

      <div className="bg-zinc-900 p-8 rounded-3xl mt-10">

        <h2 className="text-2xl font-bold mb-6">
          Available Inventory
        </h2>

        <div className="overflow-auto">

          <table className="w-full">

            <thead>

              <tr className="text-left border-b border-zinc-700">

                <th className="p-3">
                  Power
                </th>

                <th className="p-3">
                  Lens Type
                </th>

                <th className="p-3">
                  Lens Index
                </th>

                <th className="p-3">
                  Coating
                </th>

                <th className="p-3">
                  Quantity
                </th>

              </tr>

            </thead>

            <tbody>

              {inventory.map((item) => (

                <tr
                  key={item.id}
                  className="
                  border-b
                  border-zinc-800
                  "
                >

                  <td className="p-3">
                    {item.power}
                  </td>

                  <td className="p-3">
                    {item.lens_type}
                  </td>

                  <td className="p-3">
                    {item.lens_index}
                  </td>

                  <td className="p-3">
                    {item.coating}
                  </td>

                  <td className="p-3">
                    {item.quantity}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}