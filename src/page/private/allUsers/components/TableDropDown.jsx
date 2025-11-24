export const TableDropDown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="ALL">ALL</option>
      <option value="WAITLIST">WAITLIST</option>
      <option value="ACTIVE">ACTIVE</option>
      <option value="REJECTED">REJECTED</option>
      <option value="PAID_SETUP">PAID SETUP</option>
      <option value="PROFILE_PENDING">PROFILE PENDING</option>
      <option value="VERIFIED">VERIFIED</option>
    </select>
  );
};
