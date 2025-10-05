import { useEffect, useState } from "react";
import { getData } from "../../../../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { AllTableResponsiveStyle } from "../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";

export const UserEdit = () => {
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getData(`useredit.json`);
      setEditData(data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Real-time search: typing triggers filtering immediately
  const handleInputChange = (value) => {
    setSearchInput(value);
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Filter data using searchQuery
  const filteredData = editData.filter((row) =>
    row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Highlight matched text
  const highlightText = (text) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="text-black p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
          Dashboard Overview
        </h2>

        {/* Search Field */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search user name"
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearchQuery(searchInput);
            }}
            className="w-full border border-[#F07400] h-12 shadow p-4 rounded-full
                       dark:text-gray-800 dark:border-white dark:bg-border-200
                       focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] outline-none"
          />

          <button
            type="button"
            className="absolute top-3.5 right-3"
            onClick={() => {
              if (searchQuery) handleClearSearch();
              else setSearchQuery(searchInput);
            }}
          >
            {searchQuery ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#F07400]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Search icon
              <svg
                className="text-[#F07400] h-5 w-5 fill-current dark:text-[#fa8e28]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 56.966 56.966"
              >
                <path
                  d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23
                          s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,
                          2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z 
                          M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="font-inter">
        <div className="relative overflow-x-auto md:overflow-x-visible">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center py-10 text-red-500">{error}</p>
          ) : currentData.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No data found.</p>
          ) : (
            <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
              <thead className="bg-white text-black text-lg font-normal">
                <tr>
                  <th className="px-7 py-3 w-1/5 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Name</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Age</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Height</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="text-black text-base font-normal cursor-pointer">
                {currentData.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? "bg-yellow-50"
                        : "bg-white cursor-pointer"
                    }
                  >
                    <td className="px-7 py-3 w-1/5 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                      {highlightText(row.name)}
                    </td>
                    <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                      {row.age}
                    </td>
                    <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                      {row.height}
                    </td>
                    <td className="px-7 py-2.5 whitespace-nowrap flex items-center gap-3">
                      <Link to={`/admin/edit-response`}>
                        <button className="bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap">
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

        {/* Pagination */}
        <div className="flex items-center text-gray-600 justify-between mt-8 md:text-base text-sm font-poppins font-normal">
          <p className="font-inter">
            Showing {startIndex + 1} to {startIndex + currentData.length} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
            <button
              className="border border-gray-600 rounded-xl md:px-5 px-4 md:py-2 py-1.5 disabled:opacity-50"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="border border-gray-600 rounded-xl md:px-5 px-4 md:py-2 py-1.5 disabled:opacity-50"
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
