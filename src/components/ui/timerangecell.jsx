"use client";
import React, { useState } from "react";

const TimeRangeCell = ({ row, fieldName, onChange }) => {
  // Initialize state with row value
  const [showGrid, setShowGrid] = useState(false);
  const [selectedTime, setSelectedTime] = useState(
    row[fieldName]?.split(" ")[0] || "8:00"
  );
  const [selectedPeriod, setSelectedPeriod] = useState(
    row[fieldName]?.includes("PM") ? "PM" : "AM"
  );

  // Generate half-hourly times from 8:00 to 19:30
  const generateHalfHourlyTimes = () => {
    const times = [];
    for (let h = 8; h < 20; h++) {
      times.push(`${h}:00`);
      times.push(`${h}:30`);
    }
    return times;
  };
  const times = generateHalfHourlyTimes();

  // Handle time selection
  const handleSelectTime = (time) => {
    setSelectedTime(time);
    onChange(row.id, { [fieldName]: `${time} ${selectedPeriod}` });
    setShowGrid(false); // close grid after selection
  };

  // Handle AM/PM toggle
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    onChange(row.id, { [fieldName]: `${selectedTime} ${period}` });
  };

  return (
    <div className="relative w-24">
      {/* Cell */}
      <div
        className="w-full h-10 border rounded flex items-center justify-center cursor-pointer text-sm font-medium text-gray-800 bg-white"
        onClick={() => setShowGrid((prev) => !prev)}
      >
        {`${selectedTime} ${selectedPeriod}`}
      </div>

      {/* Time Grid Dropdown */}
      {showGrid && (
        <div className="absolute z-10 mt-1 p-2 bg-white border rounded shadow-lg w-full max-w-xs sm:w-[255px] max-h-60 overflow-auto left-0">
          {/* AM/PM Toggle */}
          <div className="flex justify-end mb-2">
            {["AM", "PM"].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-2 py-1 text-sm rounded border ml-1 ${
                  selectedPeriod === period
                    ? "bg-[#02C8DE] text-white border-[#02C8DE]"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Time grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {times.map((time) => (
              <div
                key={time}
                onClick={() => onSelect(time)}
                className={`text-sm p-2 text-center border rounded cursor-pointer hover:bg-[#02C8DE] hover:text-white ${
                  selectedTime === time ? "bg-[#02C8DE] text-white" : ""
                }`}
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeRangeCell;
