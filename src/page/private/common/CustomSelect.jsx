import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={`relative w-48 ${className}`}>
      {/* Selected value */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-blue-200"
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-md">
          {options.length > 0 ? (
            options.map((opt) => (
              <li
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 ${
                  opt === value ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {opt}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-400">No options</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
