import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allUserList } from "../../../features/admin/all-user/allUserFetch";
import { resetUsersError } from "../../../features/admin/all-user/allUserSlice";
import { TableDropDown } from "./components/TableDropDown";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";
import {
  formatUserStatusLabel,
  getUserStatusColor,
} from "../../../utils/userStatus";

const AllUsersView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState("ALL");
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const { allUsers, isLoading, error, pagination } = useSelector(
    (state) => state.userList,
  );

  const hasPrevPage = pagination?.page > 1;
  const hasNextPage = pagination?.page < pagination?.totalPages;

  // Debounce legal-name search so rapid typing doesn't race API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [username]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedUsername, status]);

  useEffect(() => {
    dispatch(resetUsersError());
    const request = dispatch(
      allUserList({
        page,
        limit,
        status,
        username: debouncedUsername,
      }),
    );

    return () => {
      // Abort in-flight list request when leaving the page or filters change
      request.abort();
    };
  }, [dispatch, page, status, debouncedUsername]);

  const handleRetry = () => {
    dispatch(resetUsersError());
    dispatch(
      allUserList({
        page,
        limit,
        status,
        username: debouncedUsername,
      }),
    );
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="mb-8 flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
        <h2 className="font-raleway text-2xl font-semibold uppercase text-[#002244] md:text-right">
          All Users
        </h2>
        <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row md:items-center">
          <form
            className="relative w-full md:w-64"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search legal name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dark:bg-border-200 h-12 w-full rounded-full border border-[#f1eae3] p-4 shadow outline-none focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] dark:border-white dark:text-gray-800"
            />
            <span className="absolute right-4 top-3.5 text-gray-400">
              <FaSearch size={20} />
            </span>
          </form>

          <TableDropDown value={status} onChange={setStatus} />

          <Link
            to="/admin/all-users/add"
            className="whitespace-nowrap rounded-full bg-orange-500 px-6 py-2 text-white shadow-md hover:bg-orange-600"
          >
            Add User
          </Link>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Click any user to view profile, edit, review photos, approve/reject, and
        manage status.
      </p>

      {error && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <span>Error: {error}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-100">
            <tr>
              <th className="p-3 text-center">#</th>
              <th className="p-3">Legal Name</th>
              <th className="p-3">Display Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (!allUsers || allUsers.length === 0) ? (
              <tr className="h-96">
                <td colSpan={6} className="p-4 text-center text-gray-700">
                  ⏳ Loading...
                </td>
              </tr>
            ) : !allUsers || allUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              allUsers.map((u, idx) => (
                <tr
                  key={u.id}
                  onClick={() => navigate(`/admin/all-users/${u.id}`)}
                  className="cursor-pointer border-b hover:bg-orange-50"
                >
                  <td className="p-3 text-center">
                    {(page - 1) * limit + idx + 1}
                  </td>
                  <td className="p-3 font-medium text-[#002244]">{u.name}</td>
                  <td className="p-3 text-gray-700">
                    {u.profile?.displayName || "—"}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{formatDate(u.createdAt)}</td>
                  <td
                    className={`p-3 text-center text-sm ${getUserStatusColor(u.status)}`}
                  >
                    {formatUserStatusLabel(u.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          Showing {allUsers?.length || 0} of {pagination?.totalCount || 0}{" "}
          entries
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevPage || isLoading}
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
            disabled={!hasNextPage || isLoading}
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
