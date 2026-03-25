import React from "react";
import InputField from "../modules/InputRegistry";
import { ChevronDown } from "lucide-react";
import { CHECKBOX_CLASS } from "./styles";

const InputWithSelectCheckboxDropdown = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
}) => {
  const rawRadioValue = formData[field.selectCheckbox.name];
  const selectedRadioOption = Array.isArray(rawRadioValue)
    ? rawRadioValue
    : rawRadioValue
      ? [rawRadioValue]
      : [];

  const showDropdown = showDropdowns[field.selectCheckbox.name] || false;

  const toggleOptions = (value) => {
    setFormData((prev) => {
      const rawCurrent = prev[field.selectCheckbox.name];
      const current = Array.isArray(rawCurrent)
        ? rawCurrent
        : rawCurrent
          ? [rawCurrent]
          : [];

      // Single-select: deselect if already selected, otherwise replace
      if (current.includes(value)) {
        return {
          ...prev,
          [field.selectCheckbox.name]: [],
        };
      } else {
        return {
          ...prev,
          [field.selectCheckbox.name]: [value],
        };
      }
    });
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {/* Input side */}
      <div className="flex-1 sm:w-1/2">
        <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
          {field.input.label}
        </label>
        <InputField
          type="text"
          name={field.input.name}
          value={formData[field.input.name] || ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [field.input.name]: e.target.value,
            }))
          }
          placeholder={field.input.placeholder || ""}
          className="w-full border"
        />
      </div>

      {/* SelectCheckbox dropdown side */}
      <div className="flex-1 sm:w-1/2 relative">
        <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
          {field.selectCheckbox.label}
        </label>

        <div
          className="border px-3 py-2 rounded cursor-pointer flex justify-between items-center text-[#7B7B7B]"
          onClick={() =>
            setShowDropdowns((prev) => ({
              ...prev,
              [field.selectCheckbox.name]: !showDropdown,
            }))
          }
        >
          <span>
            {selectedRadioOption.length
              ? selectedRadioOption
                  .map(
                    (v) =>
                      field.selectCheckbox.options.find((o) => o.value === v)
                        ?.label
                  )
                  .join(", ")
              : "Select Options"}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </div>

        {showDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto p-2">
            {field.selectCheckbox.options.map((option) => {
              const isChecked = selectedRadioOption.includes(option.value);
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100"
                >
                  <input
                    type="radio"
                    name={field.selectCheckbox.name}
                    checked={isChecked}
                    onChange={() => toggleOptions(option.value)}
                    className="accent-[#02C8DE]"
                  />
                  <span
                    className={
                      isChecked ? "text-[#02C8DE]" : "text-[#7B7B7B]"
                    }
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputWithSelectCheckboxDropdown;
