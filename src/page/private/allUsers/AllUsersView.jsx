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
  const [search, setSearch] = useState("");
  const { allUsers, isLoading, error, pagination } = useSelector(
    (state) => state.userList,
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(allUserList({ page, limit, status: status }));
  }, [dispatch, page, status]);

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <Overviews />
      <div className="mt-8 flex items-center justify-between">
        <h2 className="my-3 font-raleway text-[28px] font-semibold text-black sm:my-4 md:my-5 lg:my-6 xl:my-7">
          All Users
        </h2>

        {/* Search Field */}
        <div className="flex w-1/2 items-center justify-end gap-8">
          <form className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search user name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dark:bg-border-200 h-12 w-full rounded-full border border-[#f1eae3] p-4 shadow outline-none focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] dark:border-white dark:text-gray-800"
            />
            <span className="absolute right-4 top-3.5 text-gray-400">
              <FaSearch size={20} />
            </span>
          </form>
          <TableDropDown value={status} onChange={setStatus} />

          <Link
            to="/admin/all-users/add"
            className="rounded-full bg-orange-500 px-4 py-2 text-white shadow-md hover:bg-orange-600"
          >
            Add User
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr className="h-96">
                <td colSpan={5} className="p-4 text-center text-gray-700">
                  ⏳ Loading...
                </td>
              </tr>
            ) : allUsers?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              allUsers.map((u, idx) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{u.displayName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{formatDate(u.createdAt)}</td>
                  <td className="p-3">{u.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={!pagination?.hasPrevPage}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700">
          Page {pagination?.currentPage} of {pagination?.totalPages}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!pagination?.hasNextPage}
          className="rounded bg-gray-200 px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsersView;
