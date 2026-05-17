function WindInfo({ speed, deg, gust }) {

  // Convert wind degree to compass direction
  function getDirection(degree) {
    const directions = [
      "N", "NNE", "NE", "ENE",
      "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"
    ];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  }

  // Get a plain English description of wind speed
  function getWindDescription(speed) {
    if (speed < 1)  return "Calm";
    if (speed < 5)  return "Light breeze";
    if (speed < 12) return "Gentle breeze";
    if (speed < 20) return "Moderate breeze";
    if (speed < 29) return "Fresh breeze";
    if (speed < 39) return "Strong breeze";
    if (speed < 50) return "Near gale";
    return "Gale force winds";
  }

  const direction = getDirection(deg);
  const description = getWindDescription(speed);

  return (
    <div className="bg-white/10 border border-white/15 rounded-3xl p-5 mb-4">

      {/* Header */}
      <p className="text-white/50 text-xs uppercase tracking-widest mb-4">
        Wind
      </p>

      <div className="flex items-center justify-between">

        {/* Compass */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-16 h-16">
            {/* Compass ring */}
            <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center">
              {/* Arrow pointing in wind direction */}
              <div
                className="w-1 h-8 rounded-full"
                style={{
                  background: "linear-gradient(to bottom, #60a5fa, #1e40af)",
                  transformOrigin: "bottom center",
                  transform: `rotate(${deg}deg)`,
                  marginBottom: "8px"
                }}
              />
            </div>
            {/* Cardinal labels */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-white/40 text-xs">N</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/40 text-xs">S</span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 text-xs">W</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 text-xs">E</span>
          </div>
          <p className="text-white text-sm font-bold">{direction}</p>
        </div>

        {/* Wind Details */}
        <div className="flex-1 ml-6 flex flex-col gap-3">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Speed</p>
            <p className="text-white text-xl font-bold">{speed} <span className="text-sm font-normal text-white/60">mph</span></p>
          </div>
          {gust && (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Gusts</p>
              <p className="text-white text-xl font-bold">{gust} <span className="text-sm font-normal text-white/60">mph</span></p>
            </div>
          )}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Description</p>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WindInfo;