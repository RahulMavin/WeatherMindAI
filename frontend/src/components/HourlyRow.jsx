function HourlyRow({ hours, isCelsius }) {
  return (
    <div className="mb-4">
      <p className="text-white/50 text-xs uppercase tracking-widest mb-2 px-1">
        Hourly — Next 24 Hours
      </p>
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ paddingBottom: "8px", paddingRight: "24px" }}
      >
        {hours.map((hour, index) => (
          <div
            key={index}
            className={`min-w-[70px] rounded-2xl p-3 flex flex-col items-center gap-1 flex-shrink-0 transition-all cursor-pointer
              ${index === 0
                ? "bg-white/25 border border-white/30"
                : "bg-white/10 border border-white/10 hover:bg-white/20"
              }`}
          >
            <p className={`text-xs font-medium ${index === 0 ? "text-white" : "text-white/60"}`}>
              {index === 0 ? "Now" : hour.time}
            </p>
            <p className="text-xl my-1">{hour.icon}</p>
            <p className="text-white text-sm font-semibold">
              {isCelsius ? Math.round((hour.temp - 32) * 5 / 9) : hour.temp}°
            </p>
          </div>
        ))}
        {/* Invisible spacer card to ensure last card is always fully visible */}
        <div className="min-w-[16px] flex-shrink-0" />
      </div>
    </div>
  );
}

export default HourlyRow;