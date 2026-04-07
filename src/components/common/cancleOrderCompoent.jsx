"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const CancelOrderModal = () => {
  const [selectedReason, setSelectedReason] = useState(
    "Inappropriate behavior"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cancellationReasons = [
    "Inappropriate behavior",
    "Product quality issues",
    "Wrong item ordered",
    "Customer request",
    "Payment issues",
    "Shipping delays",
    "Out of stock",
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-black mb-8">
        Cancel Product Order?
      </h1>

      <p className="text-gray-500 mb-4">
        Are you sure you want to cancel this order?
      </p>

      <p className="text-gray-500 mb-8">
        This action will notify the user and initiate a refund process if
        applicable. Once cancelled, this order cannot be undone
      </p>

      <div className="mb-8">
        <label className="text-gray-600 font-medium mb-4 block">
          Cancellation Reason
        </label>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="text-black font-medium">{selectedReason}</span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
              {cancellationReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setSelectedReason(reason);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  {reason}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-white border-2 border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg hover:bg-cyan-50 transition-colors">
          Cancel
        </button>
        <button className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors">
          Cancel Order
        </button>
      </div>
    </div>
  );
};

export default CancelOrderModal;
