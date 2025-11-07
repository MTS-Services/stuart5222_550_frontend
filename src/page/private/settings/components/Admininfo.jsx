const Admininfo = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Admin Information</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Admin Name
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter admin name"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Admin Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter admin email"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Role
          </label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Moderator</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Permissions
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">
                User Management
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">
                Content Management
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">
                System Settings
              </span>
            </label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 w-full rounded-[4px] bg-[#FF8C00] px-3 py-3 font-raleway font-medium text-black transition-colors duration-200 hover:bg-[#E67E00]"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Admininfo;
