import React from "react";

const ToggleField = ({ field, formData, setFormData }) => (
  <div className="flex items-start mb-4 gap-2">
    {field.options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => {
          const updates = { [field.name]: opt.value };
          if (opt.clearFields) {
            opt.clearFields.forEach((f) => (updates[f] = null));
          }
          setFormData((prev) => ({ ...prev, ...updates }));
        }}
        className={`px-4 py-2 rounded-md border flex-1 font-medium ${
          formData[field.name] === opt.value
            ? "bg-[#02C8DE] text-white border-[#02C8DE]"
            : "bg-white text-[#7B7B7B] border-gray-300"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default ToggleField;
