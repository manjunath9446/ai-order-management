import { useState } from "react";
import api from "../api/api";

export default function Copilot() {

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  async function askCopilot() {

    if (!question.trim()) return;

    try {

      setLoading(true);

      const userMessage = {
        type: "user",
        text: question
      };

      setMessages((prev) => [
        ...prev,
        userMessage
      ]);

      const response = await api.post(
        "/ai/chat",
        {
          question
        }
      );

      const aiMessage = {
        type: "ai",
        text: response.data.answer
      };

      setMessages((prev) => [
        ...prev,
        aiMessage
      ]);

      setQuestion("");

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        AI Operations Copilot
      </h1>

      <div className="bg-zinc-900 rounded-3xl p-6">

        <div
          className="
          h-[500px]
          overflow-y-auto
          space-y-4
          mb-6
          "
        >

          {messages.length === 0 && (
            <div className="text-zinc-500">

              Example Questions:

              <ul className="mt-4 space-y-2">
                <li>
                  • Why are orders delayed today?
                </li>

                <li>
                  • How many high risk orders exist?
                </li>

                <li>
                  • What should operations team do now?
                </li>

                <li>
                  • Which bottleneck affects production?
                </li>
              </ul>

            </div>
          )}

          {messages.map((msg, idx) => (

            <div
              key={idx}
              className={`flex ${
                msg.type === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                max-w-[70%]
                px-5
                py-3
                rounded-2xl
                ${
                  msg.type === "user"
                    ? "bg-white text-black"
                    : "bg-zinc-800 text-white"
                }
                `}
              >
                {msg.text}
              </div>

            </div>

          ))}

          {loading && (

            <div className="bg-zinc-800 inline-block px-5 py-3 rounded-2xl">
              Thinking...
            </div>

          )}

        </div>

        <div className="flex gap-4">

          <input
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask AI Copilot..."
            className="
            flex-1
            bg-zinc-800
            rounded-xl
            px-4
            py-3
            outline-none
            "
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askCopilot();
              }
            }}
          />

          <button
            onClick={askCopilot}
            className="
            bg-white
            text-black
            px-6
            py-3
            rounded-xl
            font-semibold
            "
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}