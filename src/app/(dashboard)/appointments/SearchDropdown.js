import React, { useState, useEffect, useRef } from "react";

export const SearchDropdown = ({ field, formData, handleSelectClient }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (Array.isArray(field.options)) {
      setOptions(
        field.options.filter((opt) =>
          opt.label.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    else if (field.options?.fetchOptions) {
      field.options.fetchOptions(searchText).then(setOptions);
    }
  }, [searchText, field.options]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedValue = formData[field.key];

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {field.label && (
        <label className="block mb-1 font-medium">{field.label}</label>
      )}

      <input
        type="text"
        value={
          selectedValue
            ? field.options?.renderSelectedText?.(selectedValue) ||
              selectedValue.label ||
              selectedValue.name
            : searchText
        }
        onClick={() => setDropdownOpen(true)}
        onChange={(e) => {
          setSearchText(e.target.value);
          setDropdownOpen(true);
          if (selectedValue) {
            handleSelectClient(null);
          }
        }}
        placeholder={field.options?.placeholder || "Select client..."}
        className="w-full border rounded p-2 outline-none"
      />

      {dropdownOpen && (
        <div className="absolute z-50 w-full bg-white border mt-1 rounded shadow max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  handleSelectClient(option);
                  setDropdownOpen(false);
                  setSearchText("");
                }}
              >
                {field.options?.renderOption ? (
                  field.options.renderOption(option)
                ) : (
                  <div>
                    <div className="font-medium">{option.label}</div>
                    {option.email && (
                      <div className="text-sm text-gray-500">
                        {option.email}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">No results found</div>
          )}
        </div>
      )}

      {selectedValue && field.options?.renderSelected && (
        <div className="mt-2">
          {field.options.renderSelected(selectedValue)}
        </div>
      )}
    </div>
  );
};
