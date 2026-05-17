function WeatherSummary({ weather, stats, windData, sunData, unit }) {

  function getSummary() {
    if (!weather || !stats || !windData || !sunData) return "";

    const temp = weather.temp;
    const condition = weather.condition.toLowerCase();
    const humidity = weather.humidity;
    const wind = windData.speed;
    const isCold = temp < 45;
    const isHot = temp > 85;
    const isWindy = wind > 20;
    const isHumid = humidity > 70;
    const isRainy = condition.includes("rain") || condition.includes("drizzle");
    const isStormy = condition.includes("storm") || condition.includes("thunder");
    const isSnowy = condition.includes("snow");
    const isClear = condition.includes("clear");
    const isCloudy = condition.includes("cloud");

    let summary = [];

    // Opening condition sentence
    if (isStormy)
      summary.push(`Dangerous storm conditions in ${weather.city.split(",")[0]} — stay indoors if possible.`);
    else if (isSnowy)
      summary.push(`Snowy conditions in ${weather.city.split(",")[0]} — expect slippery surfaces and reduced visibility.`);
    else if (isRainy)
      summary.push(`Rainy day in ${weather.city.split(",")[0]} — keep an umbrella handy.`);
    else if (isClear && isHot)
      summary.push(`Clear and hot in ${weather.city.split(",")[0]} — a great day to stay cool indoors or near water.`);
    else if (isClear)
      summary.push(`Beautiful clear skies in ${weather.city.split(",")[0]} today.`);
    else if (isCloudy)
      summary.push(`Overcast skies in ${weather.city.split(",")[0]} today.`);
    else
      summary.push(`${weather.condition} conditions in ${weather.city.split(",")[0]} today.`);

    // Temperature feel
    if (isHot)
      summary.push(`At ${temp}${unit} it feels uncomfortably warm — stay hydrated.`);
    else if (isCold)
      summary.push(`At ${temp}${unit} it is quite cold — dress in warm layers.`);
    else
      summary.push(`Temperatures are comfortable at ${temp}${unit}.`);

    // Wind advisory
    if (isWindy)
      summary.push(`Strong winds at ${wind} mph — secure loose outdoor items.`);

    // Humidity advisory
    if (isHumid && isHot)
      summary.push(`High humidity at ${humidity}% makes it feel hotter than it is.`);
    else if (isHumid)
      summary.push(`Humidity is elevated at ${humidity}%.`);

    return summary.join(" ");
  }

  const summaryText = getSummary();
  if (!summaryText) return null;

  // Pick icon based on condition
  function getSummaryIcon() {
    const c = weather?.condition?.toLowerCase() || "";
    if (c.includes("storm") || c.includes("thunder")) return "⛈️";
    if (c.includes("snow"))   return "❄️";
    if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
    if (c.includes("clear"))  return "☀️";
    if (c.includes("cloud"))  return "⛅";
    return "🌤️";
  }

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl p-5 mb-4">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-3">
        Today's Summary
      </p>
      <div className="flex gap-3">
        <span className="text-3xl flex-shrink-0">{getSummaryIcon()}</span>
        <p className="text-white/85 text-sm leading-relaxed">{summaryText}</p>
      </div>
    </div>
  );
}

export default WeatherSummary;