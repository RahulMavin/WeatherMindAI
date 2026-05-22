import { useState, useEffect } from "react";
import axios from "axios";
import HeroCard from "./components/HeroCard";
import HourlyRow from "./components/HourlyRow";
import ForecastRow from "./components/ForecastRow";
import AIBox from "./components/AIBox";
import StatsRow from "./components/StatsRow";
import SunriseSunset from "./components/SunriseSunset";
import WindInfo from "./components/WindInfo";
import WeatherBackground from "./components/WeatherBackground";
import AirQuality from "./components/AirQuality";
import WeatherSummary from "./components/WeatherSummary";
import TempChart from "./components/TempChart";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function getWeatherType(code, sunrise, sunset, timezone) {
  if (code >= 200 && code < 300) return "stormy";
  if (code >= 300 && code < 600) return "rainy";
  if (code >= 600 && code < 700) return "snowy";
  if (code >= 700 && code < 800) return "cloudy";
  if (code === 800) {
    if (sunrise && sunset && timezone !== undefined) {
      const nowUtc      = Math.floor(Date.now() / 1000);
      const localNow    = nowUtc + timezone;
      const localSunrise = sunrise + timezone;
      const localSunset  = sunset + timezone;
      if (localNow < localSunrise || localNow > localSunset) return "night";
    }
    return "sunny";
  }
  return "cloudy";
}

function getIcon(code, sunrise, sunset, timezone) {
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 300 && code < 400) return "🌦️";
  if (code >= 400 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫️";
  if (code === 800) {
    if (sunrise && sunset && timezone !== undefined) {
      const nowUtc      = Math.floor(Date.now() / 1000);
      const localNow    = nowUtc + timezone;
      const localSunrise = sunrise + timezone;
      const localSunset  = sunset + timezone;
      if (localNow < localSunrise || localNow > localSunset) return "🌙";
    }
    return "☀️";
  }
  if (code === 801) return "🌤️";
  if (code === 802) return "⛅";
  return "☁️";
}

function getDayName(timestamp) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date(timestamp * 1000).getDay()];
}

const pageBgs = {
  sunny:  "from-orange-900 via-gray-900 to-gray-900",
  cloudy: "from-gray-700 via-gray-900 to-gray-900",
  rainy:  "from-blue-900 via-gray-900 to-gray-900",
  stormy: "from-purple-950 via-gray-900 to-gray-900",
  snowy:  "from-blue-800 via-gray-900 to-gray-900",
  night:  "from-indigo-950 via-gray-900 to-gray-900",
};

function toCelsius(f) {
  return Math.round((f - 32) * 5 / 9);
}

function App() {
  const [weather, setWeather]           = useState(null);
  const [hours, setHours]               = useState([]);
  const [days, setDays]                 = useState([]);
  const [stats, setStats]               = useState(null);
  const [sunData, setSunData]           = useState(null);
  const [windData, setWindData]         = useState(null);
  const [aqiData, setAqiData]           = useState(null);
  const [city, setCity]                 = useState("");
  const [search, setSearch]             = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [lastUpdated, setLastUpdated]   = useState("");
  const [weatherType, setWeatherType]   = useState("sunny");
  const [isCelsius, setIsCelsius]       = useState(false);
  const [recentCities, setRecentCities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recentCities")) || [];
    } catch {
      return [];
    }
  });

  function addToRecent(cityName) {
    setRecentCities(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase());
      const updated  = [cityName, ...filtered].slice(0, 5);
      localStorage.setItem("recentCities", JSON.stringify(updated));
      return updated;
    });
  }

  async function fetchAQI(lat, lon) {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution`,
        { params: { lat, lon, appid: API_KEY } }
      );
      const data = res.data.list[0];
      setAqiData({
        aqi:        data.main.aqi,
        components: data.components,
      });
    } catch {
      setAqiData(null);
    }
  }

  async function fetchByCity(cityName) {
    try {
      setLoading(true);
      setError("");
      const current  = await axios.get(`${BASE_URL}/weather`, {
        params: { q: cityName, appid: API_KEY, units: "imperial" }
      });
      const forecast = await axios.get(`${BASE_URL}/forecast`, {
        params: { q: cityName, appid: API_KEY, units: "imperial" }
      });
      processData(current.data, forecast.data);
      addToRecent(current.data.name);
      fetchAQI(current.data.coord.lat, current.data.coord.lon);
    } catch (err) {
      setError("City not found. Please check the spelling and try again.");
      setLoading(false);
    }
  }

  async function fetchByCoords(lat, lon) {
    try {
      setLoading(true);
      setError("");
      const current  = await axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, appid: API_KEY, units: "imperial" }
      });
      const forecast = await axios.get(`${BASE_URL}/forecast`, {
        params: { lat, lon, appid: API_KEY, units: "imperial" }
      });
      processData(current.data, forecast.data);
      addToRecent(current.data.name);
      fetchAQI(lat, lon);
    } catch (err) {
      setError("Could not fetch weather. Please try searching a city.");
      setLoading(false);
    }
  }

  function processData(current, forecast) {
    const code = current.weather[0].id;
    const sr   = current.sys.sunrise;
    const ss   = current.sys.sunset;
    const tz   = current.timezone;
    const type = getWeatherType(code, sr, ss, tz);
    setWeatherType(type);

    setWeather({
      city:      `${current.name}, ${current.sys.country}`,
      temp:      Math.round(current.main.temp),
      feels:     Math.round(current.main.feels_like),
      humidity:  current.main.humidity,
      condition: current.weather[0].description
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      icon: getIcon(code, sr, ss, tz),
      type,
    });

    setSunData({
      sunrise:  current.sys.sunrise,
      sunset:   current.sys.sunset,
      timezone: current.timezone,
    });

    setWindData({
      speed: Math.round(current.wind.speed),
      deg:   current.wind.deg || 0,
      gust:  current.wind.gust ? Math.round(current.wind.gust) : null,
    });

    setStats({
      wind:       `${Math.round(current.wind.speed)} mph`,
      humidity:   `${current.main.humidity}%`,
      visibility: current.visibility
        ? `${(current.visibility / 1609).toFixed(1)} mi`
        : "N/A",
      pressure:   `${current.main.pressure} hPa`,
    });

    setCity(current.name);

    const hourlyData = forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "numeric", hour12: true
      }),
      icon: getIcon(item.weather[0].id, sr, ss, tz),
      temp: Math.round(item.main.temp),
    }));
    setHours(hourlyData);

    const dailyData = forecast.list
      .filter((_, index) => index % 8 === 0)
      .slice(0, 5)
      .map(item => ({
        name: getDayName(item.dt),
        icon: getIcon(item.weather[0].id, sr, ss, tz),
        high: Math.round(item.main.temp_max),
        low:  Math.round(item.main.temp_min),
        type: getWeatherType(item.weather[0].id, sr, ss, tz),
      }));
    setDays(dailyData);

    // Set last updated timestamp
    const now = new Date();
    setLastUpdated(
      now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
    );

    setLoading(false);
  }

  function displayTemp(tempF) {
    return isCelsius ? toCelsius(tempF) : tempF;
  }

  const unit = isCelsius ? "°C" : "°F";

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

  function handleSearch() {
    if (search.trim()) {
      fetchByCity(search.trim());
      setSearch("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function getCityDateTime() {
    if (!sunData) return { time: "", date: "" };
    const nowUtc  = Math.floor(Date.now() / 1000);
    const localMs = (nowUtc + sunData.timezone) * 1000;
    const d       = new Date(localMs);
    let hrs       = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const ampm    = hrs >= 12 ? "PM" : "AM";
    hrs           = hrs % 12 || 12;
    const time    = `${hrs}:${minutes} ${ampm}`;
    const date    = d.toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", timeZone: "UTC"
    });
    return { time, date };
  }

  const { time, date } = getCityDateTime();
  const bgGradient     = pageBgs[weatherType] || pageBgs.sunny;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgGradient} transition-all duration-700 relative`}>

      {/* Animated Weather Background */}
      <WeatherBackground type={weatherType} />

      {/* App Content */}
      <div className="relative max-w-xl mx-auto p-4 pb-8" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 pt-2">
          <div className="flex flex-col">
            <h1 className="text-white text-xl font-bold tracking-tight">
              WeatherMind AI 🌤️
            </h1>
            <span className="flex items-center gap-1 text-sm">
              🦉{" "}
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic", color: "white" }}>
                owlAlpha
              </span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontStyle: "normal", color: "#a78bfa" }}>
                X
              </span>
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCelsius(prev => !prev)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              >
                {isCelsius ? "°C → °F" : "°F → °C"}
              </button>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="text-white/60 text-sm font-medium">{city}</span>
                  {weather && (
                    <button
                      onClick={() => {
                        fetchByCity(city);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs px-2 py-1 rounded-lg transition-all"
                      title="Refresh weather"
                    >
                      ↻
                    </button>
                  )}
                </div>
                {lastUpdated && (
                  <span className="text-white/30 text-xs">Updated {lastUpdated}</span>
                )}
              </div>
            </div>
            {time && (
              <div className="flex flex-col items-end">
                <p className="text-white text-sm font-semibold">{time}</p>
                <p className="text-white/40 text-xs">{date}</p>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
                  ()    => fetchByCity("Dallas")
                );
              }
            }}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-xl transition-all"
          >
            📍
          </button>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search any city worldwide..."
            className="flex-1 bg-white/10 border border-white/15 text-white text-sm rounded-xl px-4 py-2 outline-none placeholder-white/40 focus:border-white/40 transition-all"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-400 text-white text-sm px-4 py-2 rounded-xl transition-all font-medium"
          >
            Search
          </button>
        </div>

        {/* Recent Cities */}
        {recentCities.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {recentCities.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  fetchByCity(c);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex-shrink-0 bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white text-xs px-3 py-1.5 rounded-full transition-all"
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="text-4xl animate-bounce">🌤️</div>
            <p className="text-white/60 text-sm animate-pulse">
              Fetching weather data...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 mb-4">
            <p className="text-red-300 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && weather && (
          <>
            <WeatherSummary
              weather={{ ...weather, temp: displayTemp(weather.temp) }}
              stats={stats}
              windData={windData}
              sunData={sunData}
              unit={unit}
            />
            <HeroCard
              city={weather.city}
              temp={displayTemp(weather.temp)}
              condition={weather.condition}
              feels={displayTemp(weather.feels)}
              humidity={weather.humidity}
              icon={weather.icon}
              type={weather.type}
              unit={unit}
            />
            <StatsRow stats={stats} />
            <HourlyRow hours={hours} isCelsius={isCelsius} />
            <ForecastRow days={days} isCelsius={isCelsius} />
            <TempChart days={days} isCelsius={isCelsius} />
            <SunriseSunset
              sunrise={sunData.sunrise}
              sunset={sunData.sunset}
              timezone={sunData.timezone}
            />
            <WindInfo
              speed={windData.speed}
              deg={windData.deg}
              gust={windData.gust}
            />
            {aqiData && (
              <AirQuality
                aqi={aqiData.aqi}
                components={aqiData.components}
              />
            )}
            <AIBox
              city={weather.city}
              temp={displayTemp(weather.temp)}
              condition={weather.condition}
              unit={unit}
            />
          </>
        )}

        {/* Branded Footer */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col items-center justify-center gap-2">
          <span className="flex items-center gap-1 text-lg">
            🦉{" "}
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: "italic", color: "white" }}>
              owlAlpha
            </span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 200, fontStyle: "normal", color: "#a78bfa" }}>
              X
            </span>
          </span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="bg-white/5 border border-white/10 text-white/40 text-xs px-2 py-0.5 rounded-full">React</span>
            <span className="bg-white/5 border border-white/10 text-white/40 text-xs px-2 py-0.5 rounded-full">FastAPI</span>
            <span className="bg-white/5 border border-white/10 text-white/40 text-xs px-2 py-0.5 rounded-full">Groq AI</span>
            <span className="bg-white/5 border border-white/10 text-white/40 text-xs px-2 py-0.5 rounded-full">Python</span>
            <span className="bg-white/5 border border-white/10 text-white/40 text-xs px-2 py-0.5 rounded-full">Tailwind</span>
          </div>
          <span className="text-white/30 text-xs">
            © {new Date().getFullYear()} owlAlpha X. All rights reserved.
          </span>
        </div>

      </div>
    </div>
  );
}

export default App;