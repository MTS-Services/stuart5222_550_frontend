import { useState } from "react";
import { AllTableResponsiveStyle } from "../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import { Loading } from "../../../../components/ui/loading";
import { toast } from "react-toastify";

export const WaitListTable = ({ waitListData, loading, users }) => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSending, setIsSending] = useState(false);

  console.log("waitListData", waitListData);
  console.log("Data", users);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // pagination calculation
  const totalPages = Math.ceil(waitListData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = waitListData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleApprove = (email) => {
    toast.success(`${email} has been approved`);
    setApprovedUsers((prev) => [...prev, email]);
  };

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

  // const handleSubmitFeedback = async (e) => {
  //   e.preventDefault();

  //   try {
  //     setIsSending(true);
  //     const response = await postData("feedback", payload);
  //     console.log("Server response:", response);

  //     toast.success(
  //       `Feedback sent and request cancelled for ${selectedEmail}.`
  //     );
  //     closeModal();
  //     fetchSubscriptions();
  //   } catch (err) {
  //     console.error(
  //       "Failed to submit feedback:",
  //       err.response ? err.response.data : err.message
  //     );
  //     toast.error("Failed to send feedback.");
  //   } finally {
  //     setIsSending(false);
  //   }
  // };

  const handleTextareaChange = (e) => {
    setFeedbackText(e.target.value);
  };

  return (
    <div className="font-inter">
      {/* Loading */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="relative overflow-x-auto md:overflow-x-visible">
            <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
              <thead className="bg-white text-black text-lg font-normal">
                <tr>
                  <th className="px-5 py-3 w-1/3 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 w-1/3 whitespace-nowrap">Name</th>
                  <th className="px-5 py-3 w-1/3 whitespace-nowrap">Email</th>
                  <th className="px-5 py-3 w-1/3 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="text-black text-base font-normal">
                {waitListData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                  >
                    <td className="px-7 py-3 w-1/3 whitespace-nowrap">
                      {row.createdAt.slice(0, 10)}
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

          <AllTableResponsiveStyle />

          {/* Pagination */}
          <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal md:gap-0 gap-2">
            <p className="font-inter">
              Showing {startIndex + 1} to {startIndex + currentData.length} of{" "}
              {waitListData.length} results
            </p>
            <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
              <button
                className={`border rounded-xl  md:px-5 px-4 md:py-2 py-1.5 ${
                  currentPage === 1 || waitListData.length <= itemsPerPage
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-600"
                }`}
                onClick={handlePrevious}
                disabled={
                  currentPage === 1 || waitListData.length <= itemsPerPage
                }
              >
                Previous
              </button>
              <button
                className={`border rounded-xl  md:px-5 px-4 md:py-2 py-1.5 ${
                  currentPage === totalPages ||
                  waitListData.length <= itemsPerPage ||
                  totalPages === 0
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-600"
                }`}
                onClick={handleNext}
                disabled={
                  currentPage === totalPages ||
                  waitListData.length <= itemsPerPage ||
                  totalPages === 0
                }
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
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
            <form 
            // onSubmit={handleSubmitFeedback}
            >
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
