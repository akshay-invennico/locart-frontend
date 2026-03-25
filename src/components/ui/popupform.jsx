"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import ReactDOM from "react-dom";
import { CHECKBOX_CLASS } from "@/components/form-fields/styles";

const PopupForm = ({
  config,
  onCancel,
  onApply,
  width = "500px",
  height = "auto",
  data,
}) => {
  const [formData, setFormData] = useState({});
  const [dropdownStates, setDropdownStates] = useState({});
  const [dropdownPositions, setDropdownPositions] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const dropdownRefs = useRef({});

  const handleChange = (e, name) => {
    const { value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApply = () => {
    if (onApply) onApply(formData, (config && config.rowData) || data || null);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const toggleDropdown = (name) => {
    const isOpening = !dropdownStates[name];
    if (isOpening && dropdownRefs.current[name]) {
      const rect = dropdownRefs.current[name].getBoundingClientRect();
      setDropdownPositions((pos) => ({
        ...pos,
        [name]: {
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        },
      }));
    }
    setDropdownStates((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      const openKeys = Object.keys(dropdownStates).filter(
        (k) => dropdownStates[k]
      );
      openKeys.forEach((name) => {
        const ref = dropdownRefs.current[name];
        if (ref && !ref.contains(e.target)) {
          // Check if click is inside the portal dropdown
          const portalEl = document.getElementById(`dropdown-portal-${name}`);
          if (portalEl && portalEl.contains(e.target)) return;
          setDropdownStates((prev) => ({ ...prev, [name]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownStates]);

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

      case "input": {
        const isPassword = field.inputType === "password";
        const showPassword = showPasswords[field.name] || false;

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
              {isPassword && (
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      [field.name]: !prev[field.name],
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <LuEyeOff size={18} className="cursor-pointer text-gray-400" />
                  ) : (
                    <LuEye size={18} className="cursor-pointer text-gray-400" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      }

      case "infoGrid": {
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
      }

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
        const ref = dropdownRefs.current[field.name];
        const rect = isOpen && ref ? ref.getBoundingClientRect() : null;

        const dropdownMenu = isOpen && rect
          ? ReactDOM.createPortal(
              <div
                id={`dropdown-portal-${field.name}`}
                style={{
                  position: "fixed",
                  top: rect.bottom,
                  left: rect.left,
                  width: rect.width,
                  zIndex: 9999,
                }}
                className="max-h-60 overflow-auto border rounded bg-white shadow-lg"
              >
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
                        className={CHECKBOX_CLASS}
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
              </div>,
              document.body
            )
          : null;

        return (
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              {field.label}
            </label>

            {/* Trigger button */}
            <div
              ref={(el) => (dropdownRefs.current[field.name] = el)}
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

            {/* Portal dropdown renders here */}
            {dropdownMenu}

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

      case "statusOptions":
        return (
          <div className="flex flex-col gap-3">
            {field.options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, [field.name]: opt.value }));
                  if (onApply) onApply({ [field.name]: opt.value });
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
            ))}
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
               h-auto max-h-[90vh] rounded-lg"
      // ✅ Removed overflow-hidden so the portal dropdown isn't clipped
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
              <p className="text-sm text-gray-700 mb-2 leading-relaxed text-left">
                {field?.text}
              </p>
            )}
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