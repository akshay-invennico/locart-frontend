import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const SelectField = ({ field, formData, setFormData, showDropdowns, setShowDropdowns }) => {
  const showSelectDropdown = showDropdowns[field.name] || false;
  const selectedOption =
    field.options.find((opt) => opt.value === formData[field.name]) ||
    field.options.find((opt) => opt.value === field.defaultValue) ||
    null;

  return (
    <div className="w-full relative mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>

      <div
        className="flex justify-between items-center w-full border border-gray-300 px-3 py-2 rounded-sm bg-white text-[#7B7B7B] shadow-sm cursor-pointer min-h-[41px]"
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [field.name]: !showSelectDropdown,
          }))
        }
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <Image
              src={selectedOption.icon}
              alt={selectedOption.label}
              width={20}
              height={20}
              className="object-cover rounded"
            />
          )}
          <span className="text-sm font-medium">
            {selectedOption
              ? selectedOption.label
              : field.placeholder || field.label}
          </span>
        </div>
        <ChevronDown
          className={`transition-transform duration-200 ${
            showSelectDropdown ? "rotate-180" : ""
          }`}
          size={18}
        />
      </div>

      {showSelectDropdown && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border rounded bg-white shadow-lg">
          {field.options.map((option) => {
            const isSelected = formData[field.name] === option.value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: option.value,
                  }));
                  setShowDropdowns((prev) => ({
                    ...prev,
                    [field.name]: false,
                  }));
                }}
                className={`flex items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  isSelected ? "bg-[#E5FCFF]" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <Image
                      src={option.icon}
                      alt={option.label}
                      width={20}
                      height={20}
                      className="object-cover rounded"
                    />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-[#02C8DE]" : "text-[#7B7B7B]"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                {isSelected && (
                  <span className="text-[#02C8DE] font-bold text-lg">✔</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectField;
