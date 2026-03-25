import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { CHECKBOX_CLASS } from "./styles";

export const CheckboxGroupField = ({ field, formData, setFormData }) => (
  <div className="mb-2">
    <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
      {field.label}
    </label>
    <div className="flex flex-row gap-10 flex-wrap">
      {field.options.map((option) => {
        const keyName = `${field.name}_${option.value}`;
        const isChecked = formData[keyName] ?? false;

        return (
          <label key={keyName} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [keyName]: e.target.checked,
                }))
              }
              className={CHECKBOX_CLASS}
            />
            <span className="ml-1 text-sm font-medium text-[#7B7B7B]">
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  </div>
);

export const SelectCheckboxField = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
}) => {
  const selectedOptions = formData[field.name] || [];
  const showCheckboxDropdown = showDropdowns[field.name] || false;

  return (
    <div className="w-full relative mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>

      <div
        className="flex justify-between items-center w-full border border-gray-300 px-3 py-2 rounded-sm bg-white text-[#7B7B7B] cursor-pointer min-h-[41px]"
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [field.name]: !showCheckboxDropdown,
          }))
        }
      >
        <span className="text-sm">
          {selectedOptions.length > 0
            ? selectedOptions
                .map((v) => field.options.find((o) => o.value === v)?.label)
                .filter(Boolean)
                .join(", ")
            : field.placeholder || field.label}
        </span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            showCheckboxDropdown ? "rotate-180" : ""
          }`}
          size={18}
        />
      </div>

      {showCheckboxDropdown && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border rounded bg-white shadow-lg">
          {field.options.map((option) => {
            const selectedArray = Array.isArray(selectedOptions)
              ? selectedOptions
              : [];
            const isChecked = selectedArray.includes(option.value);

            return (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setFormData((prev) => {
                      const current = prev[field.name] || [];
                      if (current.includes(option.value)) {
                        return {
                          ...prev,
                          [field.name]: current.filter(
                            (v) => v !== option.value
                          ),
                        };
                      } else {
                        return {
                          ...prev,
                          [field.name]: [...current, option.value],
                        };
                      }
                    });
                  }}
                  className={CHECKBOX_CLASS}
                />
                {option.icon &&
                  (typeof option.icon === "string" ? (
                    <Image
                      src={option.icon}
                      alt={option.label}
                      width={20}
                      height={20}
                      className="object-cover rounded"
                    />
                  ) : (
                    <span>{option.icon}</span>
                  ))}
                <span
                  className={`text-sm font-medium ${
                    isChecked ? "text-[#02C8DE]" : "text-[#7B7B7B]"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {selectedOptions.length > 0 && field.showLabel !== false && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedOptions.map((value) => {
            const label = field.options.find((o) => o.value === value)?.label;
            return (
              <div
                key={value}
                className="flex items-center gap-1 bg-[#E5FCFF] text-[#02C8DE] px-2 py-1 rounded text-sm"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: (prev[field.name] || []).filter(
                        (v) => v !== value
                      ),
                    }));
                  }}
                  className="text-gray-500 hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const SelectCheckboxSingleField = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
}) => {
  const selectedSingleOption = formData[field.name] || "";
  const showSingleCheckboxDropdown = showDropdowns[field.name] || false;

  return (
    <div className="w-full relative mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>

      <div
        className="flex justify-between items-center w-full border border-gray-300 px-3 py-2 rounded-sm bg-white text-[#7B7B7B] cursor-pointer min-h-[41px]"
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [field.name]: !showSingleCheckboxDropdown,
          }))
        }
      >
        <span className="text-sm">
          {selectedSingleOption
            ? field.options.find((o) => o.value === selectedSingleOption)?.label
            : field.placeholder || field.label}
        </span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            showSingleCheckboxDropdown ? "rotate-180" : ""
          }`}
          size={18}
        />
      </div>

      {showSingleCheckboxDropdown && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border rounded bg-white shadow-lg">
          {field.options.map((option) => {
            const isChecked = selectedSingleOption === option.value;

            return (
              <label
                key={option.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`radio-${field.name}`}
                  checked={isChecked}
                  onChange={() => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: option.value,
                    }));
                    setShowDropdowns((prev) => ({
                      ...prev,
                      [field.name]: false,
                    }));
                  }}
                  className={CHECKBOX_CLASS}
                />
                {option.icon &&
                  (typeof option.icon === "string" ? (
                    <Image
                      src={option.icon}
                      alt={option.label}
                      width={20}
                      height={20}
                      className="object-cover rounded"
                    />
                  ) : (
                    <span>{option.icon}</span>
                  ))}
                <span
                  className={`text-sm font-medium ${
                    isChecked ? "text-[#02C8DE]" : "text-[#7B7B7B]"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {selectedSingleOption && field.showLabel !== false && (
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="flex items-center gap-1 bg-[#E5FCFF] text-[#02C8DE] px-2 py-1 rounded text-sm">
            <span>
              {
                field.options.find((o) => o.value === selectedSingleOption)
                  ?.label
              }
            </span>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: "",
                }));
              }}
              className="text-gray-500 hover:text-red-500 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
