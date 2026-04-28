function ForecastRow({ days }) {
  const backgrounds = {
    sunny: "from-orange-400 to-yellow-300",
    cloudy: "from-gray-500 to-gray-400",
    rainy: "from-blue-600 to-blue-400",
    stormy: "from-purple-900 to-gray-700",
    snowy: "from-blue-300 to-cyan-200",
  };

  return (
    <div className="mb-4">
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
        5-Day Forecast
      </p>
      <div className="grid grid-cols-5 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${backgrounds[day.type] || backgrounds.sunny} rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer hover:scale-105 transition-transform`}
          >
            <p className="text-white text-xs font-medium opacity-90">
              {day.name}
            </p>
            <p className="text-2xl">{day.icon}</p>
            <p className="text-white text-sm font-bold">{day.high}°</p>
            <p className="text-white text-xs opacity-70">{day.low}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastRow;