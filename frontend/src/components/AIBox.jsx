import { useState } from "react";

function AIBox({ city, temp, condition }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(
    "Ask me anything about the weather — I'll give you a smart answer!"
  );
  const [loading, setLoading] = useState(false);

  function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");

    // Placeholder response for now — real Claude API connects on Day 9
    setTimeout(() => {
      setAnswer(
        `You asked: "${question}" — In ${city}, it is currently ${temp}°F and ${condition}. 
        Claude AI will give you a full answer starting Day 9 when the backend connects!`
      );
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="bg-gray-800 border border-blue-900 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <p className="text-white font-medium text-sm">Ask AI about the weather</p>
        <span className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded-md font-medium">
          Claude AI
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="e.g. Should I carry an umbrella tomorrow?"
          className="flex-1 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-500 focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleAsk}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
        >
          Ask
        </button>
      </div>

      <div className="min-h-[40px]">
        {loading ? (
          <p className="text-gray-400 text-sm italic">Claude is thinking...</p>
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed">{answer}</p>
        )}
      </div>
    </div>
  );
}

export default AIBox;