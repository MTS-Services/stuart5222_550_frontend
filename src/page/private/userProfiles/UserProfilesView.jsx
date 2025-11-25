import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserEditTable } from "./components/UserEditTable";
import { UserVerifiedProfile } from "../../../features/admin/management/usreFetch";

const UserProfilesView = () => {
  const dispatch = useDispatch();
  const { list, isLoading, error, pagination, stats } = useSelector(
    (state) => state.adminUsers.verified,
  );

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  // Fetch verified profiles on page, limit, or searchQuery change
  useEffect(() => {
    dispatch(
      UserVerifiedProfile({
        page: page,
        limit: limit,
        status: "APPROVED",
        username: searchQuery,
      }),
    );
  }, [dispatch, page, limit, searchQuery]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const hasPrevPage = pagination?.currentPage > 1;
  const hasNextPage = pagination?.currentPage < pagination?.totalPages;

  // Real-time search with debounce
  const handleInputChange = (value) => {
    setSearchInput(value);
  };

  // Set search query (triggers API call)
  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  // Handle Enter key for search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="font-raleway text-black md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-raleway text-2xl font-semibold uppercase text-[#002244]">
          All Profile list
        </h2>

        {/* Search Field */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search user name"
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="dark:bg-border-200 h-12 w-full rounded-full border border-[#F07400] p-4 shadow outline-none focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] dark:border-white dark:text-gray-800"
          />

          <button
            type="button"
            className="absolute right-3 top-3.5"
            onClick={searchQuery ? handleClearSearch : handleSearch}
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
                className="h-5 w-5 fill-current text-[#F07400] dark:text-[#fa8e28]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 56.966 56.966"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23 s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <UserEditTable list={list} isLoading={isLoading} error={error} />

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          Showing {list.length} of{" "}
          {pagination?.totalItems || stats?.approved || 0} entries
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!hasPrevPage || isLoading}
            className={`rounded-xl border px-4 py-1.5 font-raleway md:px-5 md:py-2 ${!hasPrevPage || isLoading ? "cursor-not-allowed border-gray-300 text-gray-400" : "border-[#F07400] text-[#F07400] hover:bg-[#F07400] hover:text-white"}`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-700">
            Page {pagination?.currentPage || 1} of {pagination?.totalPages || 1}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                hasNextPage ? Math.min(pagination?.totalPages || 1, p + 1) : p,
              )
            }
            disabled={!hasNextPage || isLoading}
            className={`rounded-xl border px-4 py-1.5 font-raleway md:px-5 md:py-2 ${!hasPrevPage || isLoading ? "cursor-not-allowed border-gray-300 text-gray-400" : "border-[#F07400] text-[#F07400] hover:bg-[#F07400] hover:text-white"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilesView;
