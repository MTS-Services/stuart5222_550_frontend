export const TableDropDown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer'
    >
      <option value='REJECTED'>REJECTED</option>
      <option value='DRAFT'>DRAFT</option>
      <option value='PENDING'>PENDING</option>
    </select>
  );
};
