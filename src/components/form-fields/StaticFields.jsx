import React from "react";

export const HeaderField = ({ field }) => (
  <h2 className="text-lg font-bold">{field.label}</h2>
);

export const SubheaderField = ({ field }) => (
  <p className="text-sm text-gray-600 wrap-break-word leading-relaxed">
    {field.text}
  </p>
);

export const TextBlockField = ({ field }) => (
  <p
    className="text-xs text-[#7B7B7B] sm:text-sm wrap-break-word mb-2"
    style={field.css}
  >
    {field.content || field.label}
  </p>
);

export const DividerField = () => (
  <hr className="border-gray-300 my-3 sm:my-4" />
);

export const FilterByField = ({ field }) => (
  <p className="text-sm font-bold text-black">{field.text}</p>
);
