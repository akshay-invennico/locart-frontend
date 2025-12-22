"use client";

import Image from "next/image";
import React, { useState } from "react";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";

const PopupForm = ({
  config,
  onCancel,
  onApply,
  width = "500px",
  height = "auto",
  data,
}) => {
  const [formData, setFormData] = useState({});
  const [dropdownStates, setDropdownStates] = useState({}); // track open/close for each dropdown

  const handleChange = (e, name) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
const handleApply = () => {
  console.log("onApply triggered with:", onApply ? "yes" : "no");
  if (onApply) onApply(formData, (config && config.rowData) || data || null);
};


  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const toggleDropdown = (name) => {
    setDropdownStates((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderField = (field) => {
    switch (field.type) {
      case "header":
        return (
          <h2 className="text-lg font-bold mb-2" style={field.style || {}}>
            {field.label}
          </h2>
        );
      case "subheader":
        return (
          <p
            className="text-sm text-gray-700 mb-2 leading-relaxed"
            style={field.style || {}}
          >
            {field.text}
          </p>
        );

      case "textBlock":
        return (
          <p className="text-md font-semibold mb-2 text-[#7B7B7B] text-left">
            {field.label || field.text}
          </p>
        );

      case "input":
        const isPassword = field.inputType === "password";
        const [showPassword, setShowPassword] = useState(false);

        return (
          <div className="mb-2 relative">
            {field.label && (
              <label
                className="block text-sm font-medium mb-1 text-[#7B7B7B] text-left"
                style={field.labelStyle || {}}
              >
                {field.label}
              </label>
            )}

            <div className="relative">
              {/* Lock icon */}
              {isPassword && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Image
                    src="/icons/lock.svg"
                    alt="Lock"
                    width={18}
                    height={18}
                  />
                </span>
              )}

              <input
                type={
                  isPassword ? (showPassword ? "text" : "password") : "text"
                }
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
                placeholder={field.placeholder || ""}
                className={`w-full border rounded px-2 py-2 ${
                  isPassword ? "pl-10 pr-10" : "px-2"
                }`}
              />

              {/* Show/hide eye toggle */}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <LuEyeOff
                      size={18}
                      className="cursor-pointer text-gray-400"
                    />
                  ) : (
                    <LuEye size={18} className="cursor-pointer text-gray-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        );

      case "infoGrid":
        const columns = field.columns || 3; // desktop columns
        return (
          <div className="mb-4 grid gap-5 grid-cols-1 sm:grid-cols-3">
            {field.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded bg-gray-50 text-left"
              >
                <span className="text-gray-500 text-sm">{item.label}</span>
                <span
                  className="font-semibold text-gray-800 mt-1"
                  style={item.valueStyle || {}}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        );

      case "textarea":
        return (
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(e, field.name)}
              placeholder={field.placeholder || ""}
              className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
              rows={field.rows || 4}
            />
          </div>
        );
      case "selectCheckbox": {
        const selectedOptions = formData[field.name] || [];
        const isOpen = dropdownStates[field.name] || false;

        return (
          <div className="mb-2 relative">
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>

            <div
              className="w-full border px-2 py-1 rounded cursor-pointer flex justify-between items-center"
              onClick={() => toggleDropdown(field.name)}
            >
              <span className="text-gray-700 text-sm truncate text-left">
                {selectedOptions.length > 0
                  ? selectedOptions
                      .map(
                        (v) => field.options.find((o) => o.value === v)?.label
                      )
                      .join(", ")
                  : "Select..."}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto border rounded bg-white shadow-lg">
                {field.options.map((opt) => {
                  const isChecked = selectedOptions.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const prev = formData[field.name] || [];
                          const updated = prev.includes(opt.value)
                            ? prev.filter((v) => v !== opt.value)
                            : [...prev, opt.value];
                          setFormData((f) => ({ ...f, [field.name]: updated }));
                        }}
                        className="w-4 h-4 rounded border border-gray-300
                        bg-white
                        checked:bg-[#02C8DE] 
                        relative cursor-pointer 
                        before:content-['✔'] before:absolute before:text-[#7B7B7B]
                        checked:before:text-white before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                        appearance-none
                        flex items-center justify-center"
                      />
                      <span
                        className={`text-sm ${
                          isChecked ? "text-[#02C8DE]" : "text-black"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {selectedOptions.includes("Other") && field.showTextarea && (
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1">
                  {field.textareaLabel}
                </label>
                <textarea
                  name={field.textareaName}
                  value={formData[field.textareaName] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.textareaName]: e.target.value,
                    }))
                  }
                  placeholder={field.textareaPlaceholder}
                  className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                  rows={field.textareaRows || 4}
                />
              </div>
            )}
          </div>
        );
      }

      // case "statusOptions":
      //   return (
      //     <div className="flex flex-col gap-3">
      //       {field.options.map((opt) => {
      //         return (
      //           <div
      //             key={opt.value}
      //             onClick={() => {
      //               setFormData((prev) => ({
      //                 ...prev,
      //                 [field.name]: opt.value,
      //               }));

      //               onApply({ [field.name]: opt.value });
      //             }}
      //             className={`px-4 py-3 rounded cursor-pointer border text-center font-medium border-gray-300`}
      //             style={{ backgroundColor: opt.bgColor, color: opt.textColor }}
      //           >
      //             {opt.label}
      //           </div>
      //         );
      //       })}
      //     </div>
      //   );

      case "statusOptions":
        return (
          <div className="flex flex-col gap-3">
            {field.options.map((opt) => {
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    console.log("Selected option:", opt.value);

                    // update local formData
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: opt.value,
                    }));

                    // call parent immediately
                    if (onApply) onApply({ [field.name]: opt.value });

                    // close popup
                    if (onCancel) onCancel();
                  }}
                  className="px-4 py-3 rounded cursor-pointer border text-center font-medium border-gray-300"
                  style={{
                    backgroundColor: opt.bgColor,
                    color: opt.textColor,
                  }}
                >
                  {opt.label}
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white p-4 flex flex-col
               w-full max-w-[500px] sm:w-full sm:max-w-[500px]
               h-auto max-h-[90vh] overflow-hidden rounded-lg "
    >
      <div className="flex-1 overflow-y-auto">
        {config?.title && (
          <h2 className="text-xl font-bold mb-4 text-center sm:text-left">
            {config?.title}
          </h2>
        )}
        {config?.fields.map((field, idx) => (
          <div key={idx}>
            {field?.type === "header" && (
              <h2 className="text-lg font-bold mb-2 text-center sm:text-left">
                {field?.label}
              </h2>
            )}
            {field?.type === "subheader" && (
              <>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed text-left">
                  {field?.text}
                </p>
                {/* <div className="border-b border-gray-300 mb-6"></div> */}
              </>
            )}
            {/* render other field types normally */}
            {field?.type !== "header" &&
              field?.type !== "subheader" &&
              renderField(field)}
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      {config?.footer && (
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {config?.footer?.cancel && (
            <button
              type="button"
              onClick={handleCancel}
              className={
                config.footer.cancel.className ||
                "bg-gray-200 text-gray-700 px-4 py-2 rounded flex-1"
              }
            >
              {config.footer.cancel.label || "Cancel"}
            </button>
          )}
          {config.footer.apply && (
            <button
              type="button"
              onClick={handleApply}
              className={
                config.footer.apply.className ||
                `px-4 py-2 rounded flex-1 ${
                  config.footer.apply.color === "red"
                    ? "bg-[#BC0D10] text-white"
                    : "bg-[#02C8DE] text-white"
                }`
              }
            >
              {config.footer.apply.label || "Apply"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PopupForm;
