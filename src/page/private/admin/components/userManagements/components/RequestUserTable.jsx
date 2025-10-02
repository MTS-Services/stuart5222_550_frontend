import { useState } from "react";
import { PiCheckBold } from "react-icons/pi";
import { FiX } from "react-icons/fi";
import { AllTableResponsiveStyle } from "../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import { Link } from "react-router-dom";

export const RequestUserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");

  const data = [
    {
      date: "Jul 5, 2025",
      name: "Bessie Cooper",
      email: "bill.sanders@example.com",
      subscription: "Annually",
    },
    {
      date: "Jul 6, 2025",
      name: "John Doe",
      email: "john.doe@example.com",
      subscription: "Annually",
    },
    {
      date: "Jul 7, 2025",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      subscription: "Monthly",
    },
    {
      date: "Jul 8, 2025",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      subscription: "Annually",
    },
  ];

  const openModal = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail("");
  };

  const handleSend = () => {
    alert(`Feedback sent for ${selectedEmail}`);
    closeModal();
  };

  return (
    <div className="font-inter">
      <div className="relative overflow-x-auto md:overflow-x-visible">
        <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
          <thead className="bg-white text-black text-lg font-normal">
            <tr>
              <th className="px-7 py-3 w-1/5 whitespace-nowrap">Date</th>
              <th className="px-5 py-3 w-1/5 whitespace-nowrap">Name</th>
              <th className="px-5 py-3 w-1/5 whitespace-nowrap">
                Subscription
              </th>
              <th className="px-5 py-3 w-1/5 whitespace-nowrap">Email</th>
              <th className="px-5 py-3 w-1/5 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="text-black text-base font-normal cursor-pointer">
            {data.map((row, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-yellow-50" : "bg-white cursor-pointer"
                }
              >
                <td className="px-7 py-3 w-1/5 whitespace-nowrap">
                  {row.date}
                </td>
                <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-5 py-3 w-1/5 whitespace-nowrap">
                  {row.subscription}
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
      <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal">
        <p className="font-inter">Showing 1 to 4 of 4 results</p>
        <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
          <button className="border border-gray-600 rounded-xl px-5 py-2">
            Previous
          </button>
          <button className="border border-gray-600 rounded-xl px-5 py-2">
            Next
          </button>
        </div>
      </div>

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
            <textarea
              className="w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300"
              placeholder="Write a review message here..."
            />
            <button
              className="w-full bg-[#FF8C00] py-2.5 text-black rounded-lg hover:bg-orange-600"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
