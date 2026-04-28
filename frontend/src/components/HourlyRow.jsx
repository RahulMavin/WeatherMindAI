function HourlyRow({ hours }) {
  return (
    <div className="mb-4">
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
        Hourly — Next 24 Hours
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {hours.map((hour, index) => (
          <div
            key={index}
            className="min-w-[70px] bg-gray-800 border border-gray-700 rounded-xl p-3 flex flex-col items-center gap-1 flex-shrink-0 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <p className="text-gray-400 text-xs">{hour.time}</p>
            <p className="text-2xl">{hour.icon}</p>
            <p className="text-white text-sm font-medium">{hour.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyRow;