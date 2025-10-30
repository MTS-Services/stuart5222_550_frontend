import { useState } from "react";
import { PiCheckBold } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from "../../../../features/admin/management/usreFetch";
import { AllTableResponsiveStyle } from "../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import { formatDate } from "../../../../utils/formatDate";

export const RequestUserTable = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reasonText, setReasonText] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  // ✅ Get data from Redux
  const { userProfiles, isLoading } = useSelector((state) => state.adminUsers);
  // ✅ Track which row is loading
  const [loadingRow, setLoadingRow] = useState({ approve: null, reject: null });

  // ✅ Approve handler
  const handleApprove = async (userId) => {
    setLoadingRow((prev) => ({ ...prev, approve: userId }));
    try {
      await dispatch(adminUserApprovedProfile({ id: userId })).unwrap();
    } catch (err) {
      setError(err.message || "Failed to approve user");
    } finally {
      setLoadingRow((prev) => ({ ...prev, approve: null }));
    }
  };

  // ✅ Send button handler in modal - FIXED VERSION
  const handleSend = async () => {
    if (!selectedUserId || !reasonText.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setLoadingRow((prev) => ({ ...prev, reject: selectedUserId }));
    try {
      await dispatch(
        adminUserRejectedProfile({
          id: selectedUserId,
          reason: reasonText,
        }),
      ).unwrap();
      toast;
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to reject user");
    } finally {
      setLoadingRow((prev) => ({ ...prev, reject: null }));
      closeModal();
    }
  };

  // ✅ Modal handlers
  const openModal = (user) => {
    setSelectedEmail(user.email);
    setSelectedUserId(user.id);
    setReasonText("");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail("");
    setSelectedUserId(null);
    setReasonText("");
    setError("");
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // ✅ Map and filter the data to match table needs
  const processedList =
    userProfiles?.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      name: user.displayName || user.user?.name || "—",
      email: user.user?.email || "—",
      status: user.status || "DRAFT",
    })) || [];

  // ✅ Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(processedList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = processedList.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div className="font-inter">
      {/* 🌀 Loading State */}
      {isLoading ? (
        <div>
          <p colSpan="5" className="p-4 text-center">
            Loading...
          </p>
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto md:overflow-x-visible">
            <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
              <thead className="bg-white text-lg font-normal text-black">
                <tr>
                  <th className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                    Name
                  </th>
                  <th className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                    Email
                  </th>
                  <th className="w-1/5 whitespace-nowrap px-7 py-3 font-raleway">
                    Date
                  </th>
                  <th className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                    Status
                  </th>

                  <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-base font-normal text-black">
                {currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                    >
                      <td className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                        {row.name}
                      </td>
                      <td className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                        {row.email}
                      </td>
                      <td className="w-1/5 whitespace-nowrap px-7 py-3 font-raleway">
                        {formatDate(row.createdAt) || "—"}
                      </td>
                      <td className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                        {row.status}
                      </td>

                      {row.status === "DRAFT" ? (
                        <td className="flex items-center justify-center gap-3 whitespace-nowrap px-7 py-2.5">
                          <Link to={`/admin/user-management/${row.id}`}>
                            <button className="whitespace-nowrap rounded-xl bg-[#F07400] px-4 py-2.5 font-raleway text-xs text-white">
                              See Details
                            </button>
                          </Link>
                          <button
                            className="cursor-pointer rounded-full bg-green-300 p-1 text-green-50 hover:bg-slate-400 disabled:opacity-50"
                            onClick={() => handleApprove(row.id)}
                            disabled={loadingRow.approve === row.id}
                            aria-label={`Approve ${row.name}`}
                          >
                            {loadingRow.approve === row.id ? (
                              <>
                                <span className="sr-only">Loading...</span>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              </>
                            ) : (
                              <PiCheckBold aria-hidden="true" />
                            )}
                          </button>

                          <FiX
                            className="h-5 w-5 cursor-pointer text-red-500"
                            onClick={() => openModal(row)}
                          />
                        </td>
                      ) : (
                        <td className="text-center">{row.status}</td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center font-raleway italic text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 💬 Modal - MOVED OUTSIDE THE TABLE ROW */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="relative mx-auto w-full max-w-md rounded-lg bg-white p-6">
                <button
                  className="absolute right-3 top-3 text-gray-500 hover:text-black"
                  onClick={closeModal}
                >
                  ✕
                </button>
                <h3 className="mb-4 font-raleway text-lg font-semibold">
                  Cancel with Feedback
                </h3>
                <p className="mb-2 break-all text-sm text-gray-600">
                  {selectedEmail}
                </p>
                <textarea
                  className="mb-2 max-h-[195px] min-h-[195px] w-full rounded-[6px] border border-gray-300 bg-[#E6EEF6] p-2 focus:outline-none focus:ring-1 focus:ring-orange-300"
                  placeholder="Write a review message here..."
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                />
                {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
                <button
                  className="w-full rounded-lg bg-[#FF8C00] py-2.5 text-black hover:bg-orange-600 disabled:opacity-50"
                  onClick={handleSend}
                  disabled={
                    loadingRow.reject === selectedUserId || !reasonText.trim()
                  }
                >
                  {loadingRow.reject === selectedUserId ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          )}

          <AllTableResponsiveStyle />

          {/* 📄 Pagination */}
          {processedList.length > 0 && (
            <div className="mt-8 flex items-center justify-between gap-2 font-raleway text-base font-normal text-gray-600 md:gap-0">
              <p className="font-raleway">
                Showing {startIndex + 1} to {startIndex + currentData.length} of{" "}
                {processedList.length} results
              </p>
              <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
                <button
                  className={`rounded-xl border px-4 py-1.5 font-raleway md:px-5 md:py-2 ${
                    currentPage === 1
                      ? "cursor-not-allowed border-gray-300 text-gray-400"
                      : "border-gray-600"
                  }`}
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className={`rounded-xl border px-4 py-1.5 font-raleway md:px-5 md:py-2 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed border-gray-300 text-gray-400"
                      : "border-gray-600"
                  }`}
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
