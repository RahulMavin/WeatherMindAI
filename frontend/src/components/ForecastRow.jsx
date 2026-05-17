function ForecastRow({ days, isCelsius }) {
  const backgrounds = {
    sunny:  "from-orange-400 via-amber-400 to-yellow-300",
    cloudy: "from-gray-500 via-gray-400 to-gray-300",
    rainy:  "from-blue-700 via-blue-500 to-blue-400",
    stormy: "from-purple-900 via-purple-700 to-gray-600",
    snowy:  "from-blue-400 via-cyan-300 to-blue-200",
  };

  return (
    <div className="mb-4">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-2 px-1">
        5-Day Forecast
      </p>
      <div className="grid grid-cols-5 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${backgrounds[day.type] || backgrounds.sunny} 
              rounded-2xl p-3 flex flex-col items-center gap-1 
              cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200`}
          >
            <p className="text-white/90 text-xs font-semibold">{day.name}</p>
          <p className="text-xl sm:text-2xl my-1">{day.icon}</p>
          <p className="text-white font-bold text-xs sm:text-sm">
              {isCelsius ? Math.round((day.high - 32) * 5 / 9) : day.high}°
            </p>
            <p className="bg-black/20 text-white text-xs px-2 py-0.5 rounded-full mt-0.5">
              {isCelsius ? Math.round((day.low - 32) * 5 / 9) : day.low}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastRow;