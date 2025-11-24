import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUserList } from "../../../features/admin/all-user/allUserFetch";
import { TableDropDown } from "./components/TableDropDown";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import Overviews from "../common/Overviews";
import { formatDate } from "../../../utils/formatDate";

const AllUsersView = () => {
  const dispatch = useDispatch();

  const [status, setStatus] = useState("ALL");
  const [username, setUsername] = useState("");
  console.log(username);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { allUsers, isLoading, error, pagination } = useSelector(
    (state) => state.userList,
  );

  const hasPrevPage = pagination?.page > 1;
  const hasNextPage = pagination?.page < pagination?.totalPages;

  useEffect(() => {
    dispatch(allUserList({ page, limit, status: status, username }));
  }, [dispatch, page, status, username]);

  const getStatusColor = (status) => {
    switch (status) {
      case "WAITLIST":
        return "text-yellow-600 font-semibold";
      case "ACTIVE":
        return "text-orange-400 font-semibold";
      case "REJECTED":
        return "text-red-600 font-semibold";
      case "PAID_SETUP":
        return "text-purple-500 font-semibold";
      case "PROFILE_PENDING":
        return "text-blue-600 font-semibold";
      case "VERIFIED":
        return "text-green-500 font-semibold";
      default:
        return "text-gray-600 font-medium";
    }
  };

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <Overviews />
      <div className="my-8 flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
        {/* Left Side – Search, Filter, Add */}
        <h2 className="font-raleway text-2xl font-semibold uppercase text-[#002244] md:text-right">
          All Users
        </h2>
        {/* Right Side – Heading */}
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row md:items-center">
          {/* Search Field */}
          <form className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dark:bg-border-200 h-12 w-full rounded-full border border-[#f1eae3] p-4 shadow outline-none focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] dark:border-white dark:text-gray-800"
            />
            <span className="absolute right-4 top-3.5 text-gray-400">
              <FaSearch size={20} />
            </span>
          </form>

          {/* Filter Dropdown */}
          <TableDropDown value={status} onChange={setStatus} />

          {/* Add Button */}
          <Link
            to="/admin/all-users/add"
            className="whitespace-nowrap rounded-full bg-orange-500 px-6 py-2 text-white shadow-md hover:bg-orange-600"
          >
            Add User
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-3 text-center">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr className="h-96">
                <td colSpan={5} className="p-4 text-center text-gray-700">
                  ⏳ Loading...
                </td>
              </tr>
            ) : !allUsers || allUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              allUsers.map((u, idx) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-center">{idx + 1}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{formatDate(u.createdAt)}</td>
                  <td
                    className={`p-3 text-center text-sm ${getStatusColor(u.status)}`}
                  >
                    {u.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          Showing {allUsers?.length || 0} of {pagination?.totalCount || 0}{" "}
          entries
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevPage}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm text-gray-700">
            Page {pagination?.page || 1} of{" "}
            {Math.ceil((pagination?.totalCount || 0) / limit) || 1}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
            className="rounded bg-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllUsersView;
