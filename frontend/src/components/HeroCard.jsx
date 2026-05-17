function HeroCard({ city, temp, condition, feels, humidity, icon, type, unit }) {
  const backgrounds = {
    sunny:  "from-orange-400 via-amber-400 to-yellow-300",
    cloudy: "from-gray-500 via-gray-400 to-gray-300",
    rainy:  "from-blue-700 via-blue-500 to-blue-400",
    stormy: "from-purple-900 via-purple-700 to-gray-600",
    snowy:  "from-blue-400 via-cyan-300 to-blue-200",
  };

  const bg = backgrounds[type] || backgrounds.sunny;

  return (
    <div className={`bg-gradient-to-br ${bg} rounded-3xl p-6 mb-4 shadow-2xl`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-1 tracking-wide">
            {city}
          </p>
          <h1 className="text-white font-bold tracking-tighter"
            style={{ fontSize: "80px", lineHeight: 1 }}>
            {temp}{unit}
          </h1>
          <p className="text-white/90 text-lg font-medium mt-2 capitalize">
            {condition}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-black/20 text-white text-sm font-medium px-3 py-1 rounded-full">
              Feels {feels}{unit}
            </span>
            <span className="bg-black/20 text-white text-sm font-medium px-3 py-1 rounded-full">
              💧 {humidity}%
            </span>
          </div>
        </div>
        <div
          className="text-right"
          style={{ fontSize: "90px", lineHeight: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default HeroCard;