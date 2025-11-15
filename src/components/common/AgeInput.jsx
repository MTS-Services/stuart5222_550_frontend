import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { generateMonths, generateYears, calculateAge } from '../../utils/ageUtils';

const AgeInput = ({ 
  birthMonth, 
  birthYear, 
  onBirthMonthChange, 
  onBirthYearChange, 
  errors,
  className = "" 
}) => {
  const months = generateMonths();
  const years = generateYears();
  
  const calculatedAge = calculateAge(birthMonth, birthYear);

  return (
    <div className={`my-5 flex flex-col gap-2 self-stretch ${className}`}>
      <label className="mb-4 font-raleway text-xl font-medium text-white">
        Age <span className="text-red-500">*</span>
      </label>
      
      <div className="flex gap-3">
        {/* Birth Month Dropdown */}
        <div className="flex-1">
          <select
            name="birthMonth"
            value={birthMonth || ""}
            onChange={(e) => onBirthMonthChange(e.target.value)}
            className={`h-11 w-full border bg-transparent px-3 text-white ${
              errors.birthMonth ? "border-red-500" : "border-gray-500"
            } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300 appearance-none`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="" disabled className="text-gray-400 bg-gray-800">
              Select Month
            </option>
            {months.map((month) => (
              <option 
                key={month.value} 
                value={month.value} 
                className="text-white bg-gray-800"
              >
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Birth Year Dropdown */}
        <div className="flex-1">
          <select
            name="birthYear"
            value={birthYear || ""}
            onChange={(e) => onBirthYearChange(e.target.value)}
            className={`h-11 w-full border bg-transparent px-3 text-white ${
              errors.birthYear ? "border-red-500" : "border-gray-500"
            } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300 appearance-none`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="" disabled className="text-gray-400 bg-gray-800">
              Select Year
            </option>
            {years.map((year) => (
              <option 
                key={year.value} 
                value={year.value} 
                className="text-white bg-gray-800"
              >
                {year.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display calculated age */}
      {calculatedAge && (
        <p className="text-sm text-orange-300 font-raleway">
          Current Age: {calculatedAge} years old
        </p>
      )}

      {/* Error messages */}
      {(errors.birthMonth || errors.birthYear || errors.age) && (
        <p className="text-sm text-red-500 font-raleway">
          {errors.birthMonth || errors.birthYear || errors.age}
        </p>
      )}
      
      <p className="my-2 font-raleway text-xs font-normal text-gray-400">
        (We only store your month and year of birth which will calculate
        your age as of the 28th of your birth month.)
      </p>
      <p className="mb-1 flex items-center gap-2 font-raleway text-xs font-normal text-gray-400 md:mb-2">
        <BiErrorCircle className="h-5 w-5 text-orange-500" />
        Must be 18 or older
      </p>
    </div>
  );
};

export default AgeInput;