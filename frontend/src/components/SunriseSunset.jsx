function SunriseSunset({ sunrise, sunset, timezone }) {

  // Convert Unix timestamp + timezone offset to local city time
  function getCityTime(unixTime) {
    const utcMs = unixTime * 1000;
    const offsetMs = timezone * 1000;
    const localMs = utcMs + offsetMs;
    const d = new Date(localMs);
    let hours = d.getUTCHours();
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Calculate how far through the day we are (0 to 1)
  function getDayProgress() {
    const nowUtc = Math.floor(Date.now() / 1000);
    const nowLocal = nowUtc + timezone;
    const sunriseLocal = sunrise + timezone;
    const sunsetLocal = sunset + timezone;
    if (nowLocal < sunriseLocal) return 0;
    if (nowLocal > sunsetLocal) return 1;
    return (nowLocal - sunriseLocal) / (sunsetLocal - sunriseLocal);
  }

  const progress = getDayProgress();
  const progressPercent = Math.round(progress * 100);
  const sunriseTime = getCityTime(sunrise);
  const sunsetTime = getCityTime(sunset);

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl p-5 mb-4">

      {/* Header */}
      <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
        Sunrise & Sunset
      </p>

      {/* Times Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🌅</span>
          <p className="text-white text-sm font-semibold">{sunriseTime}</p>
          <p className="text-white/50 text-xs">Sunrise</p>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 mx-4">
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(to right, #f97316, #facc15)"
              }}
            />
          </div>
          <p className="text-white/40 text-xs text-center mt-1">
            {progressPercent}% through the day
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl">🌇</span>
          <p className="text-white text-sm font-semibold">{sunsetTime}</p>
          <p className="text-white/50 text-xs">Sunset</p>
        </div>
      </div>

    </div>
  );
}

export default SunriseSunset;