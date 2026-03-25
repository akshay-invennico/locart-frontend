import React from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { CHECKBOX_CLASS } from "./styles";

const RadioWithConditionalDropdown = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
  imageLoaded,
  setImageLoaded,
}) => {
  const selected = formData[field.name] || "";
  const showDropdown = showDropdowns[field.name] || {};

  return (
    <div className="w-full relative mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>

      <div className="flex flex-col gap-4">
        {field.options.map((opt) => {
          const isSelected = selected === opt.value;
          const optKey = opt.value;
          const optShowDropdown = showDropdown[optKey] || false;

          const selectedSubOptions =
            opt.dropdownOptions?.filter(
              (o) => formData[`${field.name}_${o.value}`]
            ) || [];

          return (
            <div key={opt.value} className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: opt.value,
                    }));
                    setShowDropdowns((prev) => ({
                      ...prev,
                      [field.name]: {},
                    }));
                  }}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? "border-[#02C8DE]" : "border-gray-400"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-[#02C8DE] rounded-full" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    isSelected ? "text-[#02C8DE]" : "text-[#7B7B7B]"
                  }`}
                >
                  {opt.label}
                </span>
              </label>

              {isSelected && opt.value === "Cart Value" && (
                <input
                  type="number"
                  className="w-full border px-3 py-2 rounded text-black mt-1"
                  placeholder={field.inputPlaceholder || "Enter value..."}
                  value={formData[`${field.name}_cartValue`] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [`${field.name}_cartValue`]: e.target.value,
                    }))
                  }
                />
              )}

              {isSelected && opt.dropdownOptions && (
                <div className="relative w-full">
                  <div
                    className="flex justify-between w-full border px-3 py-2 rounded cursor-pointer text-[#7B7B7B]"
                    onClick={() =>
                      setShowDropdowns((prev) => ({
                        ...prev,
                        [field.name]: {
                          ...prev[field.name],
                          [optKey]: !optShowDropdown,
                        },
                      }))
                    }
                  >
                    <span className="text-sm">
                      {selectedSubOptions.length > 0
                        ? `${selectedSubOptions.length} selected`
                        : `Select ${opt.label} Options`}
                    </span>
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        optShowDropdown ? "rotate-180" : ""
                      }`}
                      size={18}
                    />
                  </div>

                  {optShowDropdown && (
                    <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow">
                      {opt.dropdownOptions.map((option) => {
                        const key = `${field.name}_${option.value}`;
                        const isChecked = formData[key] ?? false;

                        return (
                          <label
                            key={key}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))
                              }
                              className={CHECKBOX_CLASS}
                            />

                            {option.image && (
                              <Image
                                src={option.image}
                                alt={option.label}
                                width={28}
                                height={28}
                                className="object-contain rounded border border-(--color-primary1)"
                                onLoad={() =>
                                  setImageLoaded((prev) => ({
                                    ...prev,
                                    [option.value]: true,
                                  }))
                                }
                              />
                            )}

                            <span
                              className={`text-sm font-medium ${
                                isChecked
                                  ? "text-[#02C8DE]"
                                  : "text-[#7B7B7B]"
                              }`}
                            >
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {selectedSubOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubOptions.map((sub) => (
                        <div
                          key={sub.value}
                          className="flex items-center gap-1 bg-[#E5FCFF] text-[#02C8DE] px-2 py-1 rounded text-sm"
                        >
                          <span>{sub.label}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                [`${field.name}_${sub.value}`]: false,
                              }));
                            }}
                            className="text-gray-500 hover:text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadioWithConditionalDropdown;
