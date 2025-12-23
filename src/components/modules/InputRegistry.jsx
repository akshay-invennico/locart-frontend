import React from "react";

const InputField = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  css = {},
  label,
}) => {
  return (
    <div className="mb-4 w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={css}
        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary1 focus:border-primary1 placeholder-gray-400 text-gray-700"
      />
    </div>
  );
};

export default InputField;
