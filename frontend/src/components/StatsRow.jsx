function StatsRow({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Wind",       value: stats.wind,       icon: "💨" },
    { label: "Humidity",   value: stats.humidity,   icon: "💧" },
    { label: "Visibility", value: stats.visibility, icon: "👁️" },
    { label: "Pressure",   value: stats.pressure,   icon: "🌡️" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 mb-4 sm:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white/10 border border-white/15 rounded-2xl p-3 flex flex-col items-center gap-1 hover:bg-white/15 transition-all"
        >
          <span className="text-lg">{item.icon}</span>
          <p className="text-white text-xs sm:text-sm font-semibold">{item.value}</p>
          <p className="text-white/50 text-xs uppercase tracking-wider hidden sm:block">
            {item.label}
          </p>
          <p className="text-white/50 text-xs uppercase tracking-wider sm:hidden">
            {item.label.slice(0, 4)}
          </p>
       
        </div>
      ))}
    </div>
  );
}

export default StatsRow;