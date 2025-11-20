import React from "react";

const HeightInput = ({
  heightFeet,
  heightInches,
  onHeightFeetChange,
  onHeightInchesChange,
  errors,
  className = "",
  defaultFeet = "",
  defaultInches = "",
}) => {
  // Generate feet options (3-8 feet)
  const feetOptions = [];
  for (let i = 3; i <= 8; i++) {
    feetOptions.push(i);
  }

  // Generate inches options (0-11 inches)
  const inchesOptions = [];
  for (let i = 0; i <= 11; i++) {
    inchesOptions.push(i);
  }

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <label className="mb-[8px] font-raleway text-xl font-medium">
        Height <span className="font-raleway text-red-500">*</span>
      </label>
      <div className="flex w-full gap-3">
        {/* Feet Dropdown */}
        <div className="flex w-1/2 flex-col">
          <select
            name="heightFeet"
            value={heightFeet || defaultFeet}
            onChange={(e) => onHeightFeetChange(e.target.value)}
            className={`h-11 border px-3 ${
              errors.height ? "border-red-500" : "border-gray-300"
            } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
          >
            <option value="" className="text-gray-400">
              Feet
            </option>
            {feetOptions.map((feet) => (
              <option key={feet} value={feet} className="">
                {feet} ft
              </option>
            ))}
          </select>
        </div>

        {/* Inches Dropdown */}
        <div className="flex w-1/2 flex-col">
          <select
            name="heightInches"
            value={heightInches || defaultInches}
            onChange={(e) => onHeightInchesChange(e.target.value)}
            className={`h-11 border px-3 ${
              errors.height ? "border-red-500" : "border-gray-300"
            } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
          >
            <option value="" className="text-gray-400">
              Inches
            </option>
            {inchesOptions.map((inches) => (
              <option key={inches} value={inches} className="">
                {inches} in
              </option>
            ))}
          </select>
        </div>
      </div>

      {errors.height && (
        <p className="font-raleway text-sm text-red-500">{errors.height}</p>
      )}
    </div>
  );
};

export default HeightInput;
