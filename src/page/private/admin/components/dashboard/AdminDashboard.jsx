import { useEffect, useRef, useState } from "react";
// Import postData for the cancellation/feedback logic
import { getData, postData } from "../../../../../utils/axiosInstance";
import { FaUsers } from "react-icons/fa";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";

export const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitListTable, setWaitListTable] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // dropdown
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Last 30 days");
  const dropdownRef = useRef(null);

  // approve state
  const [approvedUsers, setApprovedUsers] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const data = await getData(`profiles`);
      setDashboard(data || []);
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [selected]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      if (selected) {
        const data = await getData(`profiles`);
        setWaitListTable(data || []);
      } else {
        setWaitListTable([]);
      }
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      toast.error("Failed to load waitlist data.");
    } finally {
      setLoading(false);
    }
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalUsers = dashboard?.length || 0;

  const cardData = [
    {
      id: 1,
      title: "Total User",
      price: totalUsers.toLocaleString(),
      parcent: "12%",
    },
    { id: 2, title: "Revenue", price: "$2,847", parcent: "12%" },
    { id: 3, title: "Edit Requested", price: "5,000", parcent: "12%" },
    { id: 4, title: "Need approval", price: "8,000", parcent: "12%" },
  ];

  // pagination
  const totalPages = Math.ceil(waitListTable.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = waitListTable.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const options = ["Today", "Last 7 days", "Last 15 days", "Last 30 days"];

  // modal handlers
  const openModal = (email) => {
    setSelectedEmail(email);
    setFeedbackText("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail("");
    setFeedbackText("");
  };

  const handleTextareaChange = (e) => {
    setFeedbackText(e.target.value);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    const payload = {
      email: selectedEmail,
      feedbackMessage: feedbackText,
    };

    try {
      setIsSending(true);
      const response = await postData("feedback", payload);
      console.log("Server response:", response);

      toast.success(
        `Feedback sent and request cancelled for ${selectedEmail}.`
      );
      closeModal();
      fetchSubscriptions();
    } catch (err) {
      console.error(
        "Failed to submit feedback:",
        err.response ? err.response.data : err.message
      );
      toast.error("Failed to send feedback.");
    } finally {
      setIsSending(false);
    }
  };

  // approve handler
  const handleApprove = (email) => {
    toast.success(`${email} has been approved`);
    setApprovedUsers((prev) => [...prev, email]);
  };

  return (
    <div className="text-black md:p-8 p-6">
      <div>
        <h2 className="text-2xl text-[#002244] font-semibold ">
          Dashboard Overview
        </h2>
        <p className="justify-start text-[#464646] text-base font-normal leading-normal mb-4 mt-1">
          Monitor your user performance
        </p>
        <h3 className="justify-center text-[#111827] text-base font-normal leading-normal">
          Last 30 days overview
        </h3>

        {/* Dropdown */}
        <div ref={dropdownRef} className="relative inline-block my-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between gap-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-lg px-3 py-2 shadow-sm hover:bg-gray-50 focus:outline-none"
          >
            <FiCalendar className="text-gray-500" size={16} />
            <span>{selected}</span>
            <FiChevronDown
              className={`text-gray-500 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              size={16}
            />
          </button>

          {open && (
            <div className="absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <ul className="py-1 text-sm text-gray-700">
                {options.map((option) => (
                  <li key={option}>
                    <button
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                        selected === option ? "bg-gray-100 font-medium" : ""
                      }`}
                      onClick={() => {
                        setSelected(option);
                        setOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-2">
        {cardData.map((data) => (
          <div
            key={data.id}
            className="rounded-lg border border-white/100 bg-white p-5 col-span-1"
          >
            <div className="flex-col justify-center items-start gap-2">
              <div className="justify-start text-White-800 text-xs font-normal leading-none">
                {data.title}
              </div>
              <div className="flex items-center justify-between my-1">
                <div className="justify-start text-White-800 text-2xl font-semibold leading-9">
                  {loading && data.id === 1 ? "Loading..." : data.price}
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <FaUsers className="w-5 h-5 text-gray-800" />
                </div>
              </div>
              <div className="justify-start">
                <span className="text-green-600 text-xs font-normal leading-none">
                  {data.parcent}
                </span>
                <span className="text-White-600 text-xs font-normal leading-none ml-2">
                  vs last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Waitlist Table */}
      <div>
        <h2 className="text-[28px] font-semibold text-black my-3 sm:my-4 md:my-5 lg:my-6 xl:my-7">
          Wait list
        </h2>

        <div className="">
          {loading ? (
            <p>Loading...</p>
          ) : selected && currentData.length > 0 ? (
            <>
              <div className="relative overflow-x-auto md:overflow-x-visible">
                <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
                  <thead className="bg-white text-black text-lg font-normal">
                    <tr>
                      <th className="px-5 py-3 w-1/3 whitespace-nowrap">
                        Date
                      </th>
                      <th className="px-5 py-3 w-1/3 whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-5 py-3 w-1/3 whitespace-nowrap">
                        Email
                      </th>
                      <th className="px-5 py-3 w-1/3 whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-black text-base font-normal">
                    {currentData.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-yellow-50" : "bg-white"
                        }
                      >
                        <td className="px-7 py-3 w-1/3 whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="px-7 py-3 w-1/3 whitespace-nowrap">
                          {row.name}
                        </td>
                        <td className="px-7 py-3 w-1/3 whitespace-nowrap">
                          {row.email}
                        </td>
                        <td className="px-7 py-3 w-1/3 whitespace-nowrap flex items-center gap-4">
                          <button
                            onClick={() => handleApprove(row.email)}
                            disabled={approvedUsers.includes(row.email)}
                            className={`text-xs py-2.5 px-4 rounded-xl whitespace-nowrap ${
                              approvedUsers.includes(row.email)
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-[#F07400] text-white"
                            }`}
                          >
                            {approvedUsers.includes(row.email)
                              ? "Approved"
                              : "Approve"}
                          </button>

                          <button
                            onClick={() => openModal(row.email)}
                            className="bg-white border border-[#353F38] text-[#353F38] font-medium text-balance text-xs py-2.5 px-4 rounded-xl whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-normal md:gap-0 gap-2">
                <p>
                  Showing {startIndex + 1} to {startIndex + currentData.length}{" "}
                  of {waitListTable.length} results
                </p>
                <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
                  <button
                    className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
                      currentPage === 1 || waitListTable.length <= itemsPerPage
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : "border-gray-600"
                    }`}
                    onClick={handlePrevious}
                    disabled={
                      currentPage === 1 || waitListTable.length <= itemsPerPage
                    }
                  >
                    Previous
                  </button>
                  <button
                    className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
                      currentPage === totalPages ||
                      waitListTable.length <= itemsPerPage ||
                      totalPages === 0
                        ? "border-gray-300 text-gray-400 cursor-not-allowed"
                        : "border-gray-600"
                    }`}
                    onClick={handleNext}
                    disabled={
                      currentPage === totalPages ||
                      waitListTable.length <= itemsPerPage ||
                      totalPages === 0
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-4">No data available.</p>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Cancel with Feedback</h3>
            <p className="text-gray-600 text-sm mb-2 break-all">
              {selectedEmail}
            </p>
            <form onSubmit={handleSubmitFeedback}>
              <textarea
                value={feedbackText}
                onChange={handleTextareaChange}
                className="w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300"
                placeholder="Write a review message here..."
              />
              <button
                type="submit"
                disabled={isSending || !feedbackText.trim()}
                className="w-full bg-[#FF8C00] py-2.5 text-black rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
