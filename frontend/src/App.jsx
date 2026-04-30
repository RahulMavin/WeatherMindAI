import { useState, useEffect } from "react";
import axios from "axios";
import HeroCard from "./components/HeroCard";
import HourlyRow from "./components/HourlyRow";
import ForecastRow from "./components/ForecastRow";
import AIBox from "./components/AIBox";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Maps OpenWeatherMap condition codes to our weather types
function getWeatherType(code) {
  if (code >= 200 && code < 300) return "stormy";
  if (code >= 300 && code < 600) return "rainy";
  if (code >= 600 && code < 700) return "snowy";
  if (code >= 700 && code < 800) return "cloudy";
  if (code === 800)               return "sunny";
  return "cloudy";
}

// Maps weather type to an emoji icon
function getIcon(code) {
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 300 && code < 400) return "🌦️";
  if (code >= 400 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫️";
  if (code === 800)               return "☀️";
  if (code === 801)               return "🌤️";
  if (code === 802)               return "⛅";
  return "☁️";
}

// Converts day number to short name
function getDayName(timestamp) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(timestamp * 1000).getDay()];
}

function App() {
  const [weather, setWeather]   = useState(null);
  const [hours, setHours]       = useState([]);
  const [days, setDays]         = useState([]);
  const [city, setCity]         = useState("");
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Fetch weather by city name
  async function fetchByCity(cityName) {
    try {
      setLoading(true);
      setError("");

      // Current weather
      const current = await axios.get(`${BASE_URL}/weather`, {
        params: { q: cityName, appid: API_KEY, units: "imperial" }
      });

      // Forecast (hourly + 5-day)
      const forecast = await axios.get(`${BASE_URL}/forecast`, {
        params: { q: cityName, appid: API_KEY, units: "imperial" }
      });

      processData(current.data, forecast.data);

    } catch (err) {
      setError("City not found. Please check the spelling and try again.");
      setLoading(false);
    }
  }

  // Fetch weather by GPS coordinates
  async function fetchByCoords(lat, lon) {
    try {
      setLoading(true);
      setError("");

      const current = await axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, appid: API_KEY, units: "imperial" }
      });

      const forecast = await axios.get(`${BASE_URL}/forecast`, {
        params: { lat, lon, appid: API_KEY, units: "imperial" }
      });

      processData(current.data, forecast.data);

    } catch (err) {
      setError("Could not fetch weather. Please try searching a city.");
      setLoading(false);
    }
  }

  // Process API response into our component data format
  function processData(current, forecast) {
    const code = current.weather[0].id;

    // Build weather object for HeroCard
    setWeather({
      city:      `${current.name}, ${current.sys.country}`,
      temp:      Math.round(current.main.temp),
      feels:     Math.round(current.main.feels_like),
      humidity:  current.main.humidity,
      condition: current.weather[0].description
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      icon: getIcon(code),
      type: getWeatherType(code),
    });

    setCity(current.name);

    // Build hourly data — next 8 entries (every 3hrs = 24hrs)
    const hourlyData = forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "numeric", hour12: true
      }),
      icon: getIcon(item.weather[0].id),
      temp: Math.round(item.main.temp),
    }));
    setHours(hourlyData);

    // Build 5-day forecast — one entry per day (every 8th item = 24hrs apart)
    const dailyData = forecast.list
      .filter((_, index) => index % 8 === 0)
      .slice(0, 5)
      .map(item => ({
        name: getDayName(item.dt),
        icon: getIcon(item.weather[0].id),
        high: Math.round(item.main.temp_max),
        low:  Math.round(item.main.temp_min),
        type: getWeatherType(item.weather[0].id),
      }));
    setDays(dailyData);

    setLoading(false);
  }

  // Auto-detect location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
        ()    => fetchByCity("Dallas")
      );
    } else {
      fetchByCity("Dallas");
    }
  }, []);

  // Handle search
  function handleSearch() {
    if (search.trim()) fetchByCity(search.trim());
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 max-w-xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-white text-xl font-bold">WeatherMind AI 🌤️</h1>
        <span className="text-gray-400 text-sm">{city}</span>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
                ()    => fetchByCity("Dallas")
              );
            }
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded-lg transition-colors"
        >
          📍
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search any city worldwide..."
          className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 outline-none placeholder-gray-500 focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Search
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400 text-lg animate-pulse">
            Fetching weather data...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-900 border border-red-700 rounded-xl p-4 mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && weather && (
        <>
          <HeroCard
            city={weather.city}
            temp={weather.temp}
            condition={weather.condition}
            feels={weather.feels}
            humidity={weather.humidity}
            icon={weather.icon}
            type={weather.type}
          />
          <HourlyRow hours={hours} />
          <ForecastRow days={days} />
          <AIBox
            city={weather.city}
            temp={weather.temp}
            condition={weather.condition}
          />
        </>
      )}

    </div>
  );
}

export default App;