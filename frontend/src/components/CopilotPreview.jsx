import { useState } from "react";
import axios from "axios";

export default function CopilotPreview() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askCopilot = async () => {

    if (!question.trim()) return;

    setLoading(true);

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/ai/copilot?q=${question}`
      );

      setAnswer(
        res.data.response ||
        JSON.stringify(res.data)
      );

    } catch (err) {

      setAnswer(
        "Unable to get AI response."
      );

    }

    setLoading(false);
  };

  return (
    <section
      className="
      py-24
      px-8
      max-w-7xl
      mx-auto
      "
    >

      <p
        className="
        uppercase
        tracking-[0.3em]
        text-zinc-500
        mb-4
        "
      >
        AI COPILOT
      </p>

      <h2
        className="
        text-5xl
        font-bold
        mb-12
        "
      >
        Ask Operations Questions
      </h2>

      <div
        className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-3xl
        p-8
        "
      >

        <div className="flex gap-4">

          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Why are orders delayed today?"
            className="
            flex-1
            bg-black
            border
            border-zinc-700
            rounded-xl
            px-4
            py-4
            "
          />

          <button
            onClick={askCopilot}
            className="
            bg-white
            text-black
            px-6
            rounded-xl
            font-semibold
            "
          >
            Ask AI
          </button>

        </div>

        <div
          className="
          mt-8
          bg-black
          rounded-xl
          p-6
          min-h-[120px]
          "
        >

          {loading
            ? "Thinking..."
            : answer || "Ask a question above"}

        </div>

      </div>

    </section>
  );
}