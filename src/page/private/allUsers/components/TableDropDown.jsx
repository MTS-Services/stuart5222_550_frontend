export const TableDropDown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="ALL">ALL</option>
      <option value="REJECTED">REJECTED</option>
      <option value="APPROVED">APPROVED</option>
      <option value="DRAFT">DRAFT</option>
    </select>
  );
};
