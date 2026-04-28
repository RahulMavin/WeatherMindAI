import { useState } from "react";
import HeroCard from "./components/HeroCard";
import HourlyRow from "./components/HourlyRow";
import ForecastRow from "./components/ForecastRow";
import AIBox from "./components/AIBox";

// Placeholder data — real API data connects on Day 4
const mockWeather = {
  city: "Dallas, Texas, US",
  temp: 88,
  feels: 93,
  humidity: 48,
  condition: "Sunny & Clear",
  icon: "☀️",
  type: "sunny",
};

const mockHours = [
  { time: "Now",  icon: "☀️", temp: 88 },
  { time: "1PM",  icon: "☀️", temp: 90 },
  { time: "2PM",  icon: "🌤️", temp: 91 },
  { time: "3PM",  icon: "🌤️", temp: 92 },
  { time: "4PM",  icon: "⛅", temp: 90 },
  { time: "5PM",  icon: "⛅", temp: 87 },
  { time: "6PM",  icon: "🌇", temp: 84 },
  { time: "7PM",  icon: "🌆", temp: 80 },
  { time: "8PM",  icon: "🌙", temp: 76 },
  { time: "9PM",  icon: "🌙", temp: 73 },
  { time: "10PM", icon: "🌙", temp: 71 },
  { time: "11PM", icon: "🌙", temp: 69 },
];

const mockDays = [
  { name: "Mon", icon: "☀️", high: 90, low: 72, type: "sunny"  },
  { name: "Tue", icon: "🌤️", high: 87, low: 70, type: "cloudy" },
  { name: "Wed", icon: "⛅", high: 82, low: 66, type: "cloudy" },
  { name: "Thu", icon: "🌧️", high: 74, low: 60, type: "rainy"  },
  { name: "Fri", icon: "☀️", high: 85, low: 68, type: "sunny"  },
];

function App() {
  const [weather] = useState(mockWeather);
  const [hours] = useState(mockHours);
  const [days] = useState(mockDays);

  return (
    <div className="min-h-screen bg-gray-900 p-4 max-w-xl mx-auto">

      {/* App Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white text-xl font-bold">WeatherMind AI 🌤️</h1>
        <span className="text-gray-400 text-sm">Dallas, TX</span>
      </div>

      {/* Search Bar — real search connects Day 4 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search any city worldwide..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-500 focus:border-blue-500 transition-colors"
        />
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">
          Search
        </button>
      </div>

      {/* Current Weather */}
      <HeroCard
        city={weather.city}
        temp={weather.temp}
        condition={weather.condition}
        feels={weather.feels}
        humidity={weather.humidity}
        icon={weather.icon}
        type={weather.type}
      />

      {/* Hourly Forecast */}
      <HourlyRow hours={hours} />

      {/* 5-Day Forecast */}
      <ForecastRow days={days} />

      {/* AI Assistant */}
      <AIBox
        city={weather.city}
        temp={weather.temp}
        condition={weather.condition}
      />

    </div>
  );
}

export default App;