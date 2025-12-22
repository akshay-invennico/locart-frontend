"use client";
import React from "react";

export const hoursColumns = [
  {
    key: "day",
    title: "Day",
    isObject: false,
  },
  {
    key: "time",
    title: "Timing",
    isObject: false,
    component: {
      type: "text",
      style: {},
    },
  },
];

// contactColumn.js


export const contactColumn = [
  {
    key: "label",
    // title: "Field",
    render: (row) => row.label || "-",
  },
  {
    key: "value",
    // title: "Value",
    render: (row) => {
      const value = row.value;

      if (React.isValidElement(value)) return value;

      if (typeof value === "string" || typeof value === "number") return value;

      if (typeof value === "object" && value !== null)
        return JSON.stringify(value);

      return "-";
    },
  },
];
