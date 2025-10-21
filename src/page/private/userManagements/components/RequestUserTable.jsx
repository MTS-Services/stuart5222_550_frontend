import { useEffect, useState } from 'react';
import { PiCheckBold } from 'react-icons/pi';
import { FiX } from 'react-icons/fi';
import { AllTableResponsiveStyle } from '../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';
import { Link } from 'react-router-dom';
import { Loading } from '../../../../components/ui/loading';
import { useSelector } from 'react-redux';

export const RequestUserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Get data from Redux
  const { users, isLoading } = useSelector((state) => state.adminUsers);

  // ✅ Handle modal actions
  const openModal = (email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail('');
  };

  const handleSend = () => {
    alert(`Feedback sent for ${selectedEmail}`);
    closeModal();
  };

  // ✅ Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil((users?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData =
    users
      ?.filter((user) => user.status === 'ACTIVE')
      .slice(startIndex, startIndex + itemsPerPage) || [];

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className='font-inter'>
      {/* 🌀 Loading State */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className='relative overflow-x-auto md:overflow-x-visible'>
            <table className='min-w-full table-fixed text-left text-xs sm:text-sm md:text-base'>
              <thead className='bg-white text-black text-lg font-normal'>
                <tr>
                  <th className='px-7 py-3 w-1/5 whitespace-nowrap'>Date</th>
                  <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Name</th>
                  <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Status</th>
                  <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Plan</th>
                  <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Email</th>
                  <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Action</th>
                </tr>
              </thead>
              <tbody className='text-black text-base font-normal'>
                {currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
                    >
                      <td className='px-7 py-3 w-1/5 whitespace-nowrap'>
                        {new Date(row.createdAt).toLocaleDateString() || '—'}
                      </td>
                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.name || '—'}
                      </td>
                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.status || '--'}
                      </td>
                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.paidSetupFee || 'Frees Trial'}
                      </td>
                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.email || '—'}
                      </td>
                      <td className='px-7 py-2.5 whitespace-nowrap flex items-center gap-3'>
                        <FiX
                          className='w-5 h-5 text-red-500 cursor-pointer'
                          onClick={() => openModal(row.email)}
                        />
                        <PiCheckBold className='w-5 h-5 text-green-500' />
                        <Link to={`/admin/user-management/${row.id}`}>
                          <button className='bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap'>
                            See Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className='text-center text-gray-500 py-6 italic'
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AllTableResponsiveStyle />

          {/* 📄 Pagination */}
          {users?.length > 0 && (
            <div className='flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal md:gap-0 gap-2'>
              <p className='font-inter'>
                Showing {startIndex + 1} to {startIndex + currentData.length} of{' '}
                {users.length} results
              </p>
              <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
                <button
                  className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
                    currentPage === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-600'
                  }`}
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className={`border rounded-xl md:px-5 px-4 md:py-2 py-1.5 ${
                    currentPage === totalPages
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-gray-600'
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

      {/* 💬 Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg w-full max-w-md mx-auto p-6 relative'>
            <button
              className='absolute top-3 right-3 text-gray-500 hover:text-black'
              onClick={closeModal}
            >
              ✕
            </button>
            <h3 className='text-lg font-semibold mb-4'>Cancel with Feedback</h3>
            <p className='text-gray-600 text-sm mb-2 break-all'>
              {selectedEmail}
            </p>
            <textarea
              className='w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300'
              placeholder='Write a review message here...'
            />
            <button
              className='w-full bg-[#FF8C00] py-2.5 text-black rounded-lg hover:bg-orange-600'
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
