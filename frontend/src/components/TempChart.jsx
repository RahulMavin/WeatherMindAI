import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function TempChart({ days, isCelsius }) {
  function toCelsius(f) {
    return Math.round((f - 32) * 5 / 9);
  }

  const data = days.map((day) => ({
    name: day.name,
    High: isCelsius ? toCelsius(day.high) : day.high,
    Low:  isCelsius ? toCelsius(day.low)  : day.low,
  }));

  const unit = isCelsius ? "°C" : "°F";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-white/20 rounded-xl px-4 py-3">
          <p className="text-white/60 text-xs mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl p-5 mb-4">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
        5-Day Temperature Trend
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}°`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: "12px" }}
            formatter={(value) => (
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                {value}
              </span>
            )}
          />

          <Area
            type="monotone"
            dataKey="High"
            stroke="#f97316"
            strokeWidth={2.5}
            fill="url(#highGrad)"
            dot={{ fill: "#f97316", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#f97316" }}
          />

          <Area
            type="monotone"
            dataKey="Low"
            stroke="#60a5fa"
            strokeWidth={2.5}
            fill="url(#lowGrad)"
            dot={{ fill: "#60a5fa", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#60a5fa" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TempChart;