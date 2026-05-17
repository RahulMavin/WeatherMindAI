function AirQuality({ aqi, components }) {

  const aqiLevels = [
    { label: "Good",            color: "#22c55e", bg: "rgba(34,197,94,0.15)",   range: "AQI 1" },
    { label: "Fair",            color: "#84cc16", bg: "rgba(132,204,22,0.15)",  range: "AQI 2" },
    { label: "Moderate",        color: "#eab308", bg: "rgba(234,179,8,0.15)",   range: "AQI 3" },
    { label: "Poor",            color: "#f97316", bg: "rgba(249,115,22,0.15)",  range: "AQI 4" },
    { label: "Very Poor",       color: "#ef4444", bg: "rgba(239,68,68,0.15)",   range: "AQI 5" },
  ];

  const level = aqiLevels[(aqi || 1) - 1] || aqiLevels[0];

  const pollutants = [
    { label: "PM2.5", value: components?.pm2_5?.toFixed(1),  unit: "μg/m³" },
    { label: "PM10",  value: components?.pm10?.toFixed(1),   unit: "μg/m³" },
    { label: "O₃",    value: components?.o3?.toFixed(1),     unit: "μg/m³" },
    { label: "NO₂",   value: components?.no2?.toFixed(1),    unit: "μg/m³" },
  ];

  return (
    <div
      className="border rounded-3xl p-5 mb-4"
      style={{ background: level.bg, borderColor: level.color + "40" }}
    >
      {/* Header */}
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
        Air Quality Index
      </p>

      {/* AQI Score */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: level.color + "30" }}
        >
          <span className="text-2xl font-bold" style={{ color: level.color }}>
            {aqi}
          </span>
        </div>
        <div>
          <p className="text-white text-lg font-bold">{level.label}</p>
          <p className="text-white/50 text-xs">{level.range} of 5</p>
        </div>

        {/* AQI Progress Dots */}
        <div className="flex gap-1.5 ml-auto">
          {aqiLevels.map((l, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: i < aqi ? l.color : "rgba(255,255,255,0.1)",
                transform: i === aqi - 1 ? "scale(1.3)" : "scale(1)"
              }}
            />
          ))}
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-4 gap-2">
        {pollutants.map((p, i) => (
          <div
            key={i}
            className="bg-white/10 rounded-xl p-2.5 flex flex-col items-center gap-0.5"
          >
            <p className="text-white/50 text-xs">{p.label}</p>
            <p className="text-white text-sm font-semibold">{p.value}</p>
            <p className="text-white/30 text-xs">{p.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AirQuality;