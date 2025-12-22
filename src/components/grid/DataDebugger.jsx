"use client";
import { useState } from "react";

/**
 * Temporary Debug Component to inspect data structure
 * Place this INSIDE StylistSection to see what data you're actually getting
 * 
 * Usage:
 * <DataDebugger data={stylistData} />
 */
const DataDebugger = ({ data, title = "Data Inspector" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);

  if (!data || data.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-4">
        <p className="font-bold">⚠️ No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-500 p-4 rounded mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white px-4 py-2 rounded font-bold mb-2"
      >
        {isOpen ? "🔽 Hide" : "▶️ Show"} {title} (Debug)
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Row selector */}
          <div className="flex gap-2 items-center">
            <label className="font-bold">Inspect Row:</label>
            <select
              value={selectedRow}
              onChange={(e) => setSelectedRow(Number(e.target.value))}
              className="border p-2 rounded"
            >
              {data.map((_, idx) => (
                <option key={idx} value={idx}>
                  Row {idx + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Data display */}
          <div className="bg-white p-4 rounded border overflow-auto max-h-96">
            <h3 className="font-bold text-lg mb-2">Row {selectedRow + 1} Data:</h3>
            
            {/* Show each field */}
            {Object.entries(data[selectedRow] || {}).map(([key, value]) => (
              <div key={key} className="mb-4 pb-4 border-b">
                <div className="font-bold text-blue-600">{key}:</div>
                <div className="ml-4 mt-1">
                  <div className="text-xs text-gray-500">
                    Type: {Array.isArray(value) ? "Array" : typeof value}
                  </div>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    <pre className="text-xs overflow-auto">
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </pre>
                  </div>
                  
                  {/* Show specific object properties if it's an object */}
                  {typeof value === "object" && value !== null && !Array.isArray(value) && (
                    <div className="mt-2 ml-4">
                      <div className="text-xs font-semibold text-green-600">
                        Object properties:
                      </div>
                      {Object.entries(value).map(([propKey, propValue]) => (
                        <div key={propKey} className="ml-2 text-xs">
                          <span className="font-mono text-purple-600">{propKey}</span>:{" "}
                          <span className="text-gray-700">
                            {typeof propValue === "string" 
                              ? `"${propValue}"` 
                              : typeof propValue === "object"
                              ? `{${Object.keys(propValue).join(", ")}}`
                              : String(propValue)}
                          </span>
                          <span className="text-gray-400 ml-2">
                            ({typeof propValue})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Full JSON */}
          <details>
            <summary className="cursor-pointer font-bold text-sm">
              📋 View Full JSON
            </summary>
            <pre className="bg-gray-800 text-green-400 p-4 rounded mt-2 overflow-auto text-xs max-h-64">
              {JSON.stringify(data[selectedRow], null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default DataDebugger;