import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AllTableResponsiveStyle } from "../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import { formatDate } from "../../../../utils/formatDate";

export const UserEditTable = ({ searchQuery }) => {
  const { approved_list, isLoading, error } = useSelector(
    (state) => state.adminUsers,
  );

  // ✅ Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Filter users by searchQuery
  const filteredUsers = approved_list.filter(
    (user) =>
      user.user.name.toLowerCase().includes(searchQuery?.toLowerCase() || "") ||
      user.user.email.toLowerCase().includes(searchQuery?.toLowerCase() || ""),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ✅ Reset page if search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ✅ Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="font-raleway">
      <div className="relative overflow-x-auto md:overflow-x-visible">
        {/* 🌀 Loading / Error / Empty states */}
        {isLoading ? (
          <div>
            <p colSpan="5" className="p-4 text-center">
              Loading...
            </p>
          </div>
        ) : error ? (
          <p className="py-10 text-center text-red-500">{error}</p>
        ) : currentData.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No data found.</p>
        ) : (
          <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
            <thead className="bg-white text-lg font-normal text-black">
              <tr>
                <th className="w-1/5 whitespace-nowrap px-7 py-3">Date</th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3">Name</th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                  Age
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                  Height
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                  Body Type
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-base font-normal text-black">
              {currentData.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                >
                  <td className="w-1/5 whitespace-nowrap px-7 py-3">
                    {formatDate(row.createdAt) || "—"}
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3">
                    {row.user.name || "—"}
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                    {row.age || "—"} <span>years</span>
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                    {row.height || "—"}
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 text-center">
                    {row.bodyType || "—"}
                  </td>
                  <td className="flex items-center justify-center gap-3 whitespace-nowrap px-7 py-2.5">
                    <Link to={`/admin/user-edit/${row.id}`}>
                      <button className="whitespace-nowrap rounded-xl bg-[#F07400] px-4 py-2.5 text-xs text-white transition hover:bg-[#d16200]">
                        See Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AllTableResponsiveStyle />

      {/* 📄 Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-8 flex items-center justify-between gap-2 font-poppins text-sm font-normal text-gray-600 md:gap-0 md:text-base">
          <p className="font-inter">
            Showing {startIndex + 1} to {startIndex + currentData.length} of{" "}
            {filteredUsers.length} results
          </p>
          <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
            <button
              className="rounded-xl border border-gray-600 px-4 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="rounded-xl border border-gray-600 px-4 py-1.5 disabled:cursor-not-allowed disabled:opacity-50 md:px-5 md:py-2"
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
