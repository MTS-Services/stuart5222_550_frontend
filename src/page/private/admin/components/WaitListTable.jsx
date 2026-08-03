import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  adminApprove,
  adminReject,
} from "../../../../features/admin/management/usreFetch";
import { formatDate } from "../../../../utils/formatDate";
import {
  formatUserStatusLabel,
  getUserStatusColor,
} from "../../../../utils/userStatus";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const WaitListTable = ({ list, isLoading }) => {
  const dispatch = useDispatch();

  const [loadingRow, setLoadingRow] = useState({ approve: null, reject: null });

  const handleApprove = async (userId) => {
    setLoadingRow((prev) => ({ ...prev, approve: userId }));
    try {
      await dispatch(adminApprove({ user_id: userId })).unwrap();
    } catch (err) {
      toast.error(err?.message || "Error approving user");
    } finally {
      setLoadingRow((prev) => ({ ...prev, approve: null }));
    }
  };

  const handleReject = async (userId) => {
    setLoadingRow((prev) => ({ ...prev, reject: userId }));
    try {
      await dispatch(adminReject({ user_id: userId })).unwrap();
    } catch (err) {
      toast.error(err?.message || "Error rejecting user");
    } finally {
      setLoadingRow((prev) => ({ ...prev, reject: null }));
    }
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <tr className="h-96">
          <td colSpan={6} className="p-4 text-center text-gray-700">
            ⏳ Loading...
          </td>
        </tr>
      );
    }

    if (!list.length) {
      return (
        <tr className="rounded-md border-2 border-dashed border-gray-300">
          <td
            colSpan={6}
            className="py-20 text-center font-raleway font-semibold text-gray-500"
          >
            Empty List!
          </td>
        </tr>
      );
    }

    return list.map((user) => (
      <tr key={user.id} className="hover:bg-gray-50">
        <td className="border p-2 text-center font-raleway">{user.id}</td>
        <td className="border p-2 font-raleway">
          <Link
            to={`/admin/all-users/${user.id}`}
            className="font-medium text-[#002244] hover:text-orange-600 hover:underline"
          >
            {user.name}
          </Link>
        </td>
        <td className="border p-2 font-raleway">{user.email}</td>
        <td
          className={`border p-3 text-center text-sm ${getUserStatusColor(user.status)}`}
        >
          {formatUserStatusLabel(user.status)}
        </td>
        <td className="border p-2 text-center font-raleway">
          {formatDate(user.createdAt)}
        </td>
        <td className="flex justify-center gap-2 border-t p-2 text-center font-raleway">
          {user.status !== "WAITLIST" ? (
            <span className="text-gray-500">No Actions</span>
          ) : (
            <>
              <button
                onClick={() => handleApprove(user.id)}
                className="whitespace-nowrap rounded-xl bg-[#F07400] px-4 py-2.5 text-xs text-white hover:bg-red-300"
                disabled={loadingRow.approve === user.id}
              >
                {loadingRow.approve === user.id ? (
                  <p>Loading...</p>
                ) : (
                  "✓ Approve"
                )}
              </button>

              <button
                onClick={() => handleReject(user.id)}
                className="flex items-center justify-center"
                disabled={loadingRow.reject === user.id}
              >
                {loadingRow.reject === user.id ? (
                  <div>
                    <span className="sr-only">Loading...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                  </div>
                ) : (
                  <span className="rounded-full bg-red-50 p-2 text-xs text-white transition hover:bg-red-200">
                    ❌
                  </span>
                )}
              </button>
            </>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <table className="w-full border-collapse border border-gray-200 text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2 text-center font-raleway">ID</th>
          <th className="border p-2 font-raleway">Legal Name</th>
          <th className="border p-2 font-raleway">Email</th>
          <th className="border p-2 text-center font-raleway">Status</th>
          <th className="border p-2 text-center font-raleway">Date</th>
          <th className="border p-2 text-center font-raleway">Action</th>
        </tr>
      </thead>
      <tbody>{renderRows()}</tbody>
    </table>
  );
};
