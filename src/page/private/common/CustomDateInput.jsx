const CustomDateInput = ({ label, value, onChange, className = "" }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-blue-200 hover:border-gray-400">
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer bg-transparent text-sm text-gray-700 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default CustomDateInput;
