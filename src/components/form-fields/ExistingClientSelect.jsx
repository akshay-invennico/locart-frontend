import React from "react";
import { ChevronDown } from "lucide-react";

const ExistingClientSelect = ({
  field,
  formData,
  setFormData,
  showDropdowns,
  setShowDropdowns,
  searchTerms,
  setSearchTerms,
}) => {
  const selectedClient = formData[field.name]
    ? field.options.find((opt) => opt.value === formData[field.name])
    : null;
  const showClientDropdown = showDropdowns[field.name] || false;
  const searchTerm = searchTerms[field.name] || "";

  const filteredOptions = field.options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full relative mb-4">
      <label className="block text-sm font-medium mb-2 text-[#7B7B7B]">
        {field.label}
      </label>

      <div
        className="flex justify-between w-full border px-3 py-2 rounded cursor-pointer text-[#7B7B7B]"
        onClick={() =>
          setShowDropdowns((prev) => ({
            ...prev,
            [field.name]: !showClientDropdown,
          }))
        }
      >
        <span className="text-sm">
          {selectedClient ? selectedClient.label : field.placeholder}
        </span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            showClientDropdown ? "rotate-180" : ""
          }`}
          size={18}
        />
      </div>

      {showClientDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search client..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerms((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              className="w-full border px-2 py-1 rounded text-black text-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: option.value,
                  }));
                  setShowDropdowns((prev) => ({
                    ...prev,
                    [field.name]: false,
                  }));
                  setSearchTerms((prev) => ({
                    ...prev,
                    [field.name]: "",
                  }));
                }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {option.avatar ? (
                  <img
                    src={option.avatar}
                    alt={option.label}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#02C8DE] flex items-center justify-center text-white font-semibold">
                    {option.label.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500">{option.email}</p>
                </div>
                <span className="text-xs text-gray-500">{option.phone}</span>
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No clients found
              </div>
            )}
          </div>
        </div>
      )}

      {selectedClient && field.showClientInfo && (
        <div className="grid grid-cols-2 gap-4 p-3 mt-3 bg-gray-50 rounded border">
          <div>
            <p className="text-xs font-semibold text-[#7B7B7B] mb-1">Client</p>
            <p className="text-sm text-black font-medium">
              {selectedClient.label}
            </p>
            <p className="text-xs text-gray-500">{selectedClient.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#7B7B7B] mb-1">Phone</p>
            <p className="text-sm text-black font-medium">
              {selectedClient.phone}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExistingClientSelect;
