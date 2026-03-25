import React from "react";
import InputField from "../modules/InputRegistry";
import FileUpload from "../modules/FileUpload";

export const TextField = ({ field, commonProps }) => (
  <div className="w-full">
    <div className="flex justify-between mb-2">
      <label className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word">
        {field?.label}
      </label>
      {field?.label2 && (
        <label className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word">
          {field?.label2}
        </label>
      )}
    </div>
    <InputField
      type="text"
      {...commonProps}
      readOnly={field.readonly}
      style={{
        ...commonProps.style,
        ...field.css,
        cursor: field.readonly ? "not-allowed" : "text",
      }}
    />
  </div>
);

export const ReadOnlyField = ({ field, formData }) => (
  <div className="mb-3">
    {field.label && (
      <label className="block text-sm font-medium mb-1 text-[#7B7B7B]">
        {field.label}
      </label>
    )}
    <div
      style={{
        padding: "8px 12px",
        backgroundColor: "#F5F5F5",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "100%",
        display: "inline-block",
        fontFamily: "inherit",
        fontSize: "14px",
        color: "#333",
      }}
    >
      {formData[field.name] ?? field.placeholder ?? "-"}
    </div>
  </div>
);

export const InputPairField = ({ field, formData, setFormData }) => (
  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
    <div className="w-full sm:w-1/2">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label1}
      </label>
      <InputField
        type="text"
        name={field.name1}
        value={formData[field.name1] || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [field.name1]: e.target.value }))
        }
        placeholder={field.placeholder1 || ""}
        style={field.css1 || {}}
        className="w-full"
      />
    </div>
    <div className="w-full sm:w-1/2">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label2}
      </label>
      <InputField
        type="text"
        name={field.name2}
        value={formData[field.name2] || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [field.name2]: e.target.value }))
        }
        placeholder={field.placeholder2 || ""}
        style={field.css2 || {}}
        className="w-full"
      />
    </div>
  </div>
);

export const TextareaField = ({ field, commonProps }) => (
  <div className="w-full">
    <div className="flex justify-between">
      <label className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word">
        {field?.label}
      </label>
      <label className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word">
        {field?.label2}
      </label>
    </div>
    <textarea
      {...commonProps}
      className={`w-full border border-gray-300 focus:outline-none rounded resize-y px-3 py-2 text-gray-700 ${commonProps.className}`}
      rows={field.rows || 4}
    />
  </div>
);

export const FileField = ({ field, formData, setFormData }) => (
  <div className="w-full">
    <div className="flex justify-between">
      <label className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word">
        {field?.label}
      </label>
      {field?.label2 && (
        <label className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word">
          {field?.label2}
        </label>
      )}
    </div>
    <FileUpload
      value={formData[field.name]}
      onChange={(file) =>
        setFormData((prev) => ({ ...prev, [field.name]: file }))
      }
      multiple={field.multiple}
    />
  </div>
);

export const NumberRangeField = ({ field, formData, setFormData }) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
      {field?.label}
    </label>
    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
      <input
        type="number"
        placeholder="From"
        className="w-full sm:w-1/2 border px-2 py-1 rounded"
        value={formData[`${field.name}_from`] || ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [`${field.name}_from`]: e.target.value,
          }))
        }
      />
      <input
        type="number"
        placeholder="To"
        className="w-full sm:w-1/2 border px-2 py-1 rounded"
        value={formData[`${field.name}_to`] || ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            [`${field.name}_to`]: e.target.value,
          }))
        }
      />
    </div>
  </div>
);
