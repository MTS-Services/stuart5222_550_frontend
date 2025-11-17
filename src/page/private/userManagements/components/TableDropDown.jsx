export const TableDropDown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="REJECTED">REJECTED</option>
      <option value="DRAFT">DRAFT</option>
    </select>
  );
};
