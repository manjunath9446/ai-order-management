import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function OrderAI() {

  const { id } = useParams();

  const [risk, setRisk] =
    useState(null);

  useEffect(() => {

    load();

  }, []);

  async function load() {

    try {

      const response =
        await api.get(
          `/ai/order-risk/${id}`
        );

      setRisk(
        response.data
      );

    } catch(error) {

      console.error(error);

    }

  }

  if (!risk) {

    return (
      <div className="bg-black text-white p-10">
        Loading...
      </div>
    );

  }

  return (

    <div className="bg-black text-white min-h-screen p-10">

      <h1 className="text-5xl font-bold mb-10">
        AI Analysis
      </h1>

      <div className="bg-zinc-900 p-8 rounded-3xl">

        <h2 className="text-3xl mb-6">
          Risk Assessment
        </h2>

        <p>
          Predicted TAT:
          {" "}
          {risk.predicted_tat}
        </p>

        <p>
          Delay Probability:
          {" "}
          {risk.delay_probability}%
        </p>

        <p>
          Risk:
          {" "}
          {risk.risk_level}
        </p>

      </div>

    </div>

  );
}