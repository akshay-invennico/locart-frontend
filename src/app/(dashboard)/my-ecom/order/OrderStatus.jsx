"use client";
import React, { useEffect, useRef, useState } from "react";

const OrderStatus = ({ value, row, options, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* CURRENT STATUS BADGE */}
      <button
        className="rounded text-sm font-medium px-3 py-1"
        style={{
          backgroundColor: current?.bgColor,
          color: current?.textColor,
        }}
        onClick={() => setOpen(!open)}
      >
        {current?.label}
      </button>

      {/* DROPDOWN LIST */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white shadow-md border rounded-lg p-3 w-30">
          <div className="text-sm flex items-center justify-center font-semibold mb-2">Order Status</div>

          <div className="space-y-2">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onStatusChange(row, opt.value);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center rounded cursor-pointer text-sm font-medium px-3 py-2"
                style={{
                  backgroundColor: opt.bgColor,
                  color: opt.textColor,
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
