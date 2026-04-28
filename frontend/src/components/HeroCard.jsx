function HeroCard({ city, temp, condition, feels, humidity, icon, type }) {
  const backgrounds = {
    sunny: "from-orange-400 to-yellow-300",
    cloudy: "from-gray-500 to-gray-400",
    rainy: "from-blue-600 to-blue-400",
    stormy: "from-purple-900 to-gray-700",
    snowy: "from-blue-300 to-cyan-200",
  };

  const bg = backgrounds[type] || backgrounds.sunny;

  return (
    <div className={`bg-gradient-to-br ${bg} rounded-2xl p-6 mb-4 flex items-center justify-between shadow-lg`}>
      <div>
        <p className="text-white text-lg font-medium opacity-90">{city}</p>
        <h1 className="text-white text-7xl font-bold">{temp}°F</h1>
        <p className="text-white text-base opacity-80 mt-1">{condition}</p>
        <p className="text-white text-sm opacity-70 mt-1">
          Feels like {feels}°F &nbsp;|&nbsp; Humidity {humidity}%
        </p>
      </div>
      <div className="text-8xl">{icon}</div>
    </div>
  );
}

export default HeroCard;