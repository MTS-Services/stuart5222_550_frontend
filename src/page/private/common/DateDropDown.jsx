export const DateDropDown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer'
    >
      <option value='today'>Today</option>
      <option value='week'>This Week</option>
      <option value='month'>This Month</option>
      <option value='year'>This Year</option>
    </select>
  );
};
