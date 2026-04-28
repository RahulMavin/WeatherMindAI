import { useState } from "react";

function App() {
  const [city, setCity] = useState("Dallas");

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-blue-400 mb-2">
        WeatherMind AI 🌤️
      </h1>
      <p className="text-gray-400 text-lg mb-6">
        Your AI-powered global weather assistant
      </p>
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md text-center">
        <p className="text-gray-300 text-xl">App is live and running!</p>
        <p className="text-gray-500 mt-2">Weather data coming on Day 4 🚀</p>
      </div>
    </div>
  );
}

export default App;