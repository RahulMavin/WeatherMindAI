import { useState } from "react";

function AIBox({ city, temp, condition, unit }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Ask me anything about the weather — should I run outside? Need an umbrella? I've got you covered!"
  );
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("https://weathermindai-backend.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          city,
          temp: String(temp),
          condition,
          unit,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      setAnswer("Could not connect to AI backend. Make sure the backend server is running.");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  }

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl p-5 mb-4 backdrop-blur-sm">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-white font-semibold text-sm">
          Ask AI about the weather
        </p>
        <span className="bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs px-2 py-0.5 rounded-full font-medium">
          Groq AI
        </span>
      </div>

      {/* Input Row */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="e.g. Should I carry an umbrella tomorrow?"
          className="flex-1 bg-white/10 border border-white/15 text-white text-sm rounded-xl px-4 py-2.5 outline-none placeholder-white/30 focus:border-white/40 focus:bg-white/15 transition-all"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-400 disabled:bg-blue-500/50 text-white text-sm px-5 py-2.5 rounded-xl transition-all font-medium"
        >
          Ask
        </button>
      </div>

      {/* Response Area */}
      <div className="min-h-[48px] bg-white/5 rounded-2xl px-4 py-3">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200" />
            <p className="text-white/50 text-sm italic ml-1">
              AI is thinking...
            </p>
          </div>
        ) : (
          <p className="text-white/80 text-sm leading-relaxed">{answer}</p>
        )}
      </div>

    </div>
  );
}

export default AIBox;