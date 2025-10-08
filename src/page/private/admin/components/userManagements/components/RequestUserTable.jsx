// import { useEffect, useState } from 'react';
// import { PiCheckBold } from 'react-icons/pi';
// import { FiX } from 'react-icons/fi';
// import { AllTableResponsiveStyle } from '../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';
// import { Link } from 'react-router-dom';
// import { getData } from '../../../../../../utils/axiosInstance';
// import { Loading } from '../../../../../../components/ui/loading';

// export const RequestUserTable = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedEmail, setSelectedEmail] = useState('');
//   const [requestUser, setRequestUser] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     try {
//       setLoading(true);
//       const data = await getData(`subscriptions`);
//       setRequestUser(data || []);
//     } catch (err) {
//       console.error('Failed to fetch data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openModal = (email) => {
//     setSelectedEmail(email);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedEmail('');
//   };

//   const handleSend = () => {
//     alert(`Feedback sent for ${selectedEmail}`);
//     closeModal();
//   };

//   // pagination calculations
//   const totalPages = Math.ceil(requestUser.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentData = requestUser.slice(startIndex, startIndex + itemsPerPage);

//   const handlePrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };
//   const handleNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   return (
//     <div className=''>
//       {/* Loading UI */}
//       {loading ? (
//         <Loading/>
//       ) : (
//         <>
//           <div className='relative overflow-x-auto md:overflow-x-visible'>
//             <table className='min-w-full table-fixed text-left text-xs sm:text-sm md:text-base'>
//               <thead className='bg-white text-black text-lg font-normal'>
//                 <tr>
//                   <th className='px-7 py-3 w-1/5 whitespace-nowrap'>Date</th>
//                   <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Name</th>
//                   <th className='px-5 py-3 w-1/5 whitespace-nowrap'>
//                     Subscription
//                   </th>
//                   <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Email</th>
//                   <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Action</th>
//                 </tr>
//               </thead>
//               <tbody className='text-black text-base font-normal'>
//                 {currentData.map((row, index) => (
//                   <tr
//                     key={index}
//                     className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
//                   >
//                     <td className='px-7 py-3 w-1/5 whitespace-nowrap'>
//                       {row.date}
//                     </td>
//                     <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
//                       {row.name}
//                     </td>
//                     <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
//                       {row.plan}
//                     </td>
//                     <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
//                       {row.email}
//                     </td>
//                     <td className='px-7 py-2.5 whitespace-nowrap flex items-center gap-3'>
//                       <FiX
//                         className='w-5 h-5 text-red-500 cursor-pointer'
//                         onClick={() => openModal(row.email)}
//                       />
//                       <PiCheckBold className='w-5 h-5 text-green-500' />
//                       <Link to={`/admin/user-details`}>
//                         <button className='bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap'>
//                           See Details
//                         </button>
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <AllTableResponsiveStyle />

//           {/* Pagination */}
//           <div className='flex items-center text-gray-600 justify-between mt-8 text-base font-raleway font-normal md:gap-0 gap-2'>
//             <p className=''>
//               Showing {startIndex + 1} to {startIndex + currentData.length} of{' '}
//               {requestUser.length} results
//             </p>
//             <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
//               <button
//                 className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
//                   currentPage === 1 || requestUser.length <= itemsPerPage
//                     ? 'border-gray-300 text-gray-400 cursor-not-allowed'
//                     : 'border-gray-600'
//                 }`}
//                 onClick={handlePrevious}
//                 disabled={
//                   currentPage === 1 || requestUser.length <= itemsPerPage
//                 }
//               >
//                 Previous
//               </button>
//               <button
//                 className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
//                   currentPage === totalPages ||
//                   requestUser.length <= itemsPerPage ||
//                   totalPages === 0
//                     ? 'border-gray-300 text-gray-400 cursor-not-allowed'
//                     : 'border-gray-600'
//                 }`}
//                 onClick={handleNext}
//                 disabled={
//                   currentPage === totalPages ||
//                   requestUser.length <= itemsPerPage ||
//                   totalPages === 0
//                 }
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
//           <div className='bg-white rounded-lg w-full max-w-md mx-auto p-6 relative'>
//             <button
//               className='absolute top-3 right-3 text-gray-500 hover:text-black'
//               onClick={closeModal}
//             >
//               ✕
//             </button>
//             <h3 className='text-lg font-semibold mb-4'>Cancel with Feedback</h3>
//             <p className='text-gray-600 text-sm mb-2 break-all'>
//               {selectedEmail}
//             </p>
//             <textarea
//               className='w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300'
//               placeholder='Write a review message here...'
//             />
//             <button
//               className='w-full bg-[#FF8C00] py-2.5 text-black rounded-lg hover:bg-orange-600'
//               onClick={handleSend}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { PiCheckBold } from "react-icons/pi";
import { FiX } from "react-icons/fi";
import { AllTableResponsiveStyle } from "../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import { Link } from "react-router-dom";
import { getData, postData } from "../../../../../../utils/axiosInstance";
import { Loading } from "../../../../../../components/ui/loading";
import { toast } from "react-toastify";

export const RequestUserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  // IMPORTANT: State to hold the feedback text from the textarea
  const [feedbackText, setFeedbackText] = useState("");
  const [requestUser, setRequestUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users/notifications
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getData("notifications");
      setRequestUser(data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load data. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const openModal = (email) => {
    setSelectedEmail(email);
    setFeedbackText(""); // Clear feedback text when opening modal
    setIsModalOpen(true);
    console.log("Modal opened for:", email);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail("");
    setFeedbackText(""); // Clear feedback text on close
  };

  // Handler for text area changes
  const handleTextareaChange = (e) => {
    setFeedbackText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. **CORRECTION:** Use the state variable `feedbackText` instead of reading from the form element by name.
    // 2. **CORRECTION:** The server might expect a more descriptive key than 'textArea'. I've changed it to 'feedbackMessage' for clarity and API-friendliness, but you should confirm the correct key with your backend API.
    const payload = {
      email: selectedEmail, // Include the email of the user
      feedbackMessage: feedbackText, // Use the state value
    };

    console.log("Sending payload:", payload);

    try {
      setIsSending(true);

      // The API endpoint should likely be more specific, perhaps including the email or an ID, but for now, we use "feedback" as in your original code.
      // NOTE: You are POSTing to 'feedback' but the server response message seems to imply you are performing a cancellation, e.g., 'cancel-request'. I've kept 'feedback' but be aware of this potential inconsistency.
      const response = await postData("feedback", payload);
      console.log("Server response:", response);

      toast.success(`Feedback sent to ${selectedEmail}.`);
      closeModal();
      fetchHistory(); // Refresh the table data
    } catch (err) {
      // 3. **CORRECTION:** The issue might be a **CORS error** or a **server error (4xx/5xx)** which prevents the `postData` from completing successfully, but your UI still shows a success toast due to the line before `closeModal()`.
      // By wrapping the toast inside `try/catch`, we ensure the error toast shows on failure.
      console.error("Failed to submit:", err.response ? err.response.data : err.message);
      toast.error("Failed to send feedback. Check console for details.");
    } finally {
      setIsSending(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(requestUser.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = requestUser.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="relative overflow-x-auto md:overflow-x-visible">
            <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
              <thead className="bg-white text-black text-lg font-normal">
                <tr>
                  <th className="px-7 py-3 w-1/5 whitespace-nowrap">Date</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Name</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Title</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Email</th>
                  <th className="px-5 py-3 w-1/5 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="text-black text-base font-normal">
                {currentData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                  >
                    <td className="px-7 py-3 w-1/5 whitespace-nowrap">
                      {row.date}
                    </td>
                    <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                      {row.firstname} {row.lastname}
                    </td>
                    <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                      {row.title}
                    </td>
                    <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                      {row.email}
                    </td>
                    <td className="px-7 py-2.5 whitespace-nowrap flex items-center gap-3">
                      <FiX
                        className="w-5 h-5 text-red-500 cursor-pointer"
                        onClick={() => openModal(row.email)}
                      />
                      <PiCheckBold className="w-5 h-5 text-green-500" />
                      <Link to={`/admin/user-details`}>
                        <button className="bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap">
                          See Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AllTableResponsiveStyle />

          {/* Pagination */}
          <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-raleway font-normal md:gap-0 gap-2">
            <p>
              Showing {startIndex + 1} to {startIndex + currentData.length} of{" "}
              {requestUser.length} results
            </p>
            <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
              <button
                className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
                  currentPage === 1 || requestUser.length <= itemsPerPage
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-600"
                }`}
                onClick={handlePrevious}
                disabled={
                  currentPage === 1 || requestUser.length <= itemsPerPage
                }
              >
                Previous
              </button>
              <button
                className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
                  currentPage === totalPages ||
                  requestUser.length <= itemsPerPage ||
                  totalPages === 0
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-gray-600"
                }`}
                onClick={handleNext}
                disabled={
                  currentPage === totalPages ||
                  requestUser.length <= itemsPerPage ||
                  totalPages === 0
                }
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
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
            <form onSubmit={handleSubmit}>
              <textarea
                type="text"
                name="textArea"
                placeholder="Write a review message here..."
                // CORRECTION: Use value and onChange to control the textarea with React state
                value={feedbackText}
                onChange={handleTextareaChange}
                className="w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300"
              />
              <button
                type="submit"
                // CORRECTION: Use trim() to check if the input is not just empty spaces
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
