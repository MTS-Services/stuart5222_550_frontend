export const TableDropDown = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      <option value="ALL">ALL</option>
      <option value="WAITLIST">Waitlist</option>
      <option value="ACTIVE">Active</option>
      <option value="REJECTED">Rejected</option>
      <option value="PAID_SETUP">Needs Edits</option>
      <option value="PROFILE_PENDING">Awaiting Approval</option>
      <option value="VERIFIED">Verified</option>
    </select>
  );
};
