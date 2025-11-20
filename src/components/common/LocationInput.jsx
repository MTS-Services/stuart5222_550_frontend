import React from "react";

const LocationInput = ({
  county,
  onCountyChange,
  errors,
  className = "",
  defaultCounty = "",
}) => {
  return (
    <div className={`space-y-5 ${className}`}>
      {/* County Field */}
      <div className="flex w-full flex-col gap-2 self-stretch">
        <label className="mb-[8px] font-raleway text-xl font-medium">
          County <span className="font-raleway text-red-500">*</span>
        </label>
        <input
          type="text"
          name="county"
          placeholder="Enter your county"
          value={county || ""}
          onChange={(e) => onCountyChange(e.target.value)}
          className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
            errors.county ? "border-red-500" : "border-gray-300"
          } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
        />
        {errors.county && (
          <p className="font-raleway text-sm text-red-500">{errors.county}</p>
        )}
        <p className="font-raleway text-xs font-normal text-gray-400">
          Please enter the county where you are located
        </p>
      </div>
    </div>
  );
};

export default LocationInput;
