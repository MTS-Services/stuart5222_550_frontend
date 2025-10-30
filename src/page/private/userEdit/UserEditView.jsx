import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UserEditTable } from "./components/UserEditTable";
import { adminUserVerifiedProfile } from "../../../features/admin/management/usreFetch";

const UserEditView = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  // Real-time search: typing triggers filtering immediately
  const handleInputChange = (value) => {
    setSearchInput(value);
    setSearchQuery(value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  useEffect(() => {
    dispatch(
      adminUserVerifiedProfile({ page: 1, limit: 50, status: "APPROVED" }),
    );
  }, [dispatch]);

  return (
    <div className="font-raleway text-black md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-raleway text-2xl font-semibold text-[#002244]">
          All User list
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
            className="dark:bg-border-200 h-12 w-full rounded-full border border-[#F07400] p-4 shadow outline-none focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] dark:border-white dark:text-gray-800"
          />

          <button
            type="button"
            className="absolute right-3 top-3.5"
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
      <UserEditTable searchQuery={searchQuery} />
    </div>
  );
};

export default UserEditView;
