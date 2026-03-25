import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar1, ChevronDown } from "lucide-react";

export const DateRangeField = ({ field, formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
      {field?.label}
    </label>
    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
      <div className="relative w-full sm:w-1/2">
        <DatePicker
          selected={formData[`${field.name}_from`] || null}
          onChange={(date) =>
            setFormData((prev) => ({ ...prev, [`${field.name}_from`]: date }))
          }
          placeholderText="From"
          dateFormat="dd-MM-yyyy"
          className="w-full border px-3 py-2 pr-10 rounded text-black cursor-pointer"
        />
        <Calendar1 className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
      </div>
      <div className="relative w-full sm:w-1/2">
        <DatePicker
          selected={formData[`${field.name}_to`] || null}
          onChange={(date) =>
            setFormData((prev) => ({ ...prev, [`${field.name}_to`]: date }))
          }
          placeholderText="To"
          dateFormat="dd-MM-yyyy"
          className="w-full border px-3 py-2 pr-10 rounded text-black cursor-pointer"
        />
        <Calendar1 className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
      </div>
    </div>
  </div>
);

export const DateField = ({
  field,
  formData,
  setFormData,
  showCalendars,
  setShowCalendars,
}) => {
  const showCalendar = showCalendars[field.name] || false;

  return (
    <div className="relative w-full mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>
      <div
        className="relative w-full border px-3 py-2 rounded cursor-pointer flex items-center justify-between text-[#7B7B7B]"
        onClick={() =>
          setShowCalendars((prev) => ({
            ...prev,
            [field.name]: !showCalendar,
          }))
        }
      >
        <span>
          {formData[field.name]
            ? new Date(formData[field.name]).toLocaleDateString("en-GB")
            : "Select Date"}
        </span>
        <Calendar1 size={18} className="text-black" />
      </div>
      {showCalendar && (
        <div className="absolute z-10 mt-1 w-full p-2 bg-white border rounded shadow-lg">
          <DatePicker
            selected={formData[field.name] || null}
            onChange={(date) => {
              setFormData((prev) => ({ ...prev, [field.name]: date }));
              setShowCalendars((prev) => ({
                ...prev,
                [field.name]: false,
              }));
            }}
            inline
          />
        </div>
      )}
    </div>
  );
};

export const TimeDurationField = ({
  field,
  formData,
  setFormData,
  durationDropdowns,
  setDurationDropdowns,
}) => {
  const state = durationDropdowns[field.name] || { show: false, value: "" };

  return (
    <div className="w-full relative mb-4">
      <label className="block text-sm font-light mb-2 text-[#7B7B7B]">
        {field.label}
      </label>

      <div
        className="w-full border px-3 py-2 rounded cursor-pointer flex justify-between"
        onClick={() => {
          setDurationDropdowns((prev) => ({
            ...prev,
            [field.name]: { ...state, show: !state.show },
          }));
        }}
      >
        <span className="block text-sm font-light text-[#7B7B7B]">
          {state.value || "Select Duration"}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform text-[#7B7B7B] ${
            state.show ? "rotate-180" : ""
          }`}
        />
      </div>

      {state.show && (
        <div className="absolute z-10 mt-1 w-full p-2 bg-white border rounded shadow-lg">
          <input
            type="text"
            placeholder="HH:MM"
            value={state.value}
            onChange={(e) => {
              const value = e.target.value;
              setDurationDropdowns((prev) => ({
                ...prev,
                [field.name]: { ...state, value },
              }));
              setFormData((prev) => ({
                ...prev,
                [field.name]: value,
              }));
            }}
            className="w-full border px-2 py-1 rounded text-black"
          />
        </div>
      )}
    </div>
  );
};

const generateHalfHourlyTimes = () => {
  const times = [];
  for (let h = 8; h < 20; h++) {
    times.push(`${h}:00`);
    times.push(`${h}:30`);
  }
  return times;
};

const HALF_HOURLY_TIMES = generateHalfHourlyTimes();

const TimePicker = ({
  label,
  fieldKey,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
  timePeriods,
  setTimePeriods,
}) => {
  const showTimes = showDropdowns[fieldKey] || false;
  const selectedPeriod = timePeriods[fieldKey] || "AM";

  return (
    <div className="relative w-full">
      <input
        type="text"
        readOnly
        placeholder={label}
        value={
          formData[fieldKey]
            ? `${formData[fieldKey]} ${selectedPeriod}`
            : ""
        }
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [fieldKey]: !showTimes,
          }))
        }
        className="w-full border px-3 py-2 rounded cursor-pointer pr-10"
      />
      <ChevronDown
        size={18}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${
          showTimes ? "rotate-180" : ""
        }`}
      />

      {showTimes && (
        <div className="absolute z-10 mt-1 p-2 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
          <div className="flex justify-end mb-2">
            {["AM", "PM"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() =>
                  setTimePeriods((prev) => ({
                    ...prev,
                    [fieldKey]: period,
                  }))
                }
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

          <div className="grid grid-cols-3 gap-2">
            {HALF_HOURLY_TIMES.map((time) => (
              <div
                key={time}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    [fieldKey]: time,
                  }));
                  setShowDropdowns((prev) => ({
                    ...prev,
                    [fieldKey]: false,
                  }));
                }}
                className={`text-sm p-2 text-center border rounded cursor-pointer hover:bg-[#02C8DE] hover:text-white ${
                  formData[fieldKey] === time
                    ? "bg-[#02C8DE] text-white"
                    : ""
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

export const TimeField = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
  timePeriods,
  setTimePeriods,
}) => {
  const showSingleTime = showDropdowns[`${field.name}_time`] || false;
  const selectedPeriod = timePeriods[field.name] || "AM";

  return (
    <div className="relative w-full mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>
      <div
        className="relative w-full border px-3 py-2 rounded cursor-pointer flex items-center justify-between text-[#7B7B7B]"
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [`${field.name}_time`]: !showSingleTime,
          }))
        }
      >
        <span>
          {formData[field.name]
            ? `${formData[field.name]} ${selectedPeriod}`
            : "Select Time"}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            showSingleTime ? "rotate-180" : ""
          }`}
        />
      </div>
      {showSingleTime && (
        <div className="absolute z-10 mt-1 p-2 bg-white border rounded shadow-lg w-full max-h-60 overflow-auto">
          <div className="flex justify-end mb-2">
            {["AM", "PM"].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() =>
                  setTimePeriods((prev) => ({
                    ...prev,
                    [field.name]: period,
                  }))
                }
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

          <div className="grid grid-cols-3 gap-2">
            {HALF_HOURLY_TIMES.map((time) => (
              <div
                key={time}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, [field.name]: time }));
                  setShowDropdowns((prev) => ({
                    ...prev,
                    [`${field.name}_time`]: false,
                  }));
                }}
                className={`text-sm p-2 text-center border rounded cursor-pointer hover:bg-[#02C8DE] hover:text-white ${
                  formData[field.name] === time
                    ? "bg-[#02C8DE] text-white"
                    : ""
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

export const TimeRangeField = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
  timePeriods,
  setTimePeriods,
}) => (
  <div className="mb-4 relative">
    <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
      {field?.label}
    </label>
    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
      <TimePicker
        label="From"
        fieldKey={`${field.name}_from`}
        formData={formData}
        setFormData={setFormData}
        showDropdowns={showDropdowns}
        setShowDropdowns={setShowDropdowns}
        timePeriods={timePeriods}
        setTimePeriods={setTimePeriods}
      />
      <TimePicker
        label="To"
        fieldKey={`${field.name}_to`}
        formData={formData}
        setFormData={setFormData}
        showDropdowns={showDropdowns}
        setShowDropdowns={setShowDropdowns}
        timePeriods={timePeriods}
        setTimePeriods={setTimePeriods}
      />
    </div>
  </div>
);
