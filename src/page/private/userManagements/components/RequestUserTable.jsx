import { useState } from 'react';
import { PiCheckBold } from 'react-icons/pi';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from '../../../../features/admin/management/usreFetch';
import { AllTableResponsiveStyle } from '../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';

const Loading = () => {
  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'>
      {/* Spinner */}
      <div className='w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin'></div>

      {/* Text */}
      <span className='mt-4 text-orange-500 text-lg font-semibold tracking-wide'>
        Loading...
      </span>
    </div>
  );
};

export const RequestUserTable = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reasonText, setReasonText] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  // 🔹 Track which row is loading
  const [loadingRow, setLoadingRow] = useState({ approve: null, reject: null });

  // ✅ Get data from Redux
  const { drafts_list, isLoading } = useSelector((state) => state.adminUsers);

  // ✅ Approve handler
  const handleApprove = async (userId) => {
    console.log('ID', userId);
    setLoadingRow((prev) => ({ ...prev, approve: userId }));
    try {
      await dispatch(adminUserApprovedProfile({ id: userId })).unwrap();
    } catch (err) {
      setError(err.message || 'Failed to approve user');
    } finally {
      setLoadingRow((prev) => ({ ...prev, approve: null }));
    }
  };

  // ✅ Send button handler in modal - FIXED VERSION
  const handleSend = async () => {
    if (!selectedUserId || !reasonText.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    console.log('User ID:', selectedUserId, 'Reason:', reasonText);
    setLoadingRow((prev) => ({ ...prev, reject: selectedUserId }));
    try {
      await dispatch(
        adminUserRejectedProfile({
          id: selectedUserId,
          reason: reasonText,
        })
      ).unwrap();
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to reject user');
    } finally {
      setLoadingRow((prev) => ({ ...prev, reject: null }));
      closeModal();
    }
  };

  // ✅ Modal handlers
  const openModal = (user) => {
    setSelectedEmail(user.email);
    setSelectedUserId(user.id);
    setReasonText(''); // reset previous reason
    setError(''); // clear previous errors
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmail('');
    setSelectedUserId(null);
    setReasonText('');
    setError('');
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // ✅ Map and filter the data to match table needs
  const processedList =
    drafts_list?.map((user) => ({
      id: user.id,
      createdAt: user.createdAt,
      name: user.displayName || user.user?.name || '—',
      email: user.user?.email || '—',
      status: user.status || 'DRAFT',
    })) || [];

  // ✅ Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(processedList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = processedList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

                  <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Email</th>
                  <th className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='text-black text-base font-normal'>
                {currentData.length > 0 ? (
                  currentData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
                    >
                      <td className='px-7 py-3 w-1/5 whitespace-nowrap'>
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.name}
                      </td>
                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.status}
                      </td>

                      <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                        {row.email}
                      </td>
                      <td className='px-7 py-2.5 whitespace-nowrap flex items-center justify-center gap-3'>
                        <FiX
                          className='w-5 h-5 text-red-500 cursor-pointer'
                          onClick={() => openModal(row)}
                        />

                        <button
                          className='text-green-50 bg-green-300 rounded-full p-1 cursor-pointer hover:bg-slate-400 disabled:opacity-50'
                          onClick={() => handleApprove(row.id)}
                          disabled={loadingRow.approve === row.id}
                          aria-label={`Approve ${row.name}`}
                        >
                          {loadingRow.approve === row.id ? (
                            <>
                              <span className='sr-only'>Loading...</span>
                              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            </>
                          ) : (
                            <PiCheckBold aria-hidden='true' />
                          )}
                        </button>

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
                      colSpan={6}
                      className='text-center text-gray-500 py-6 italic'
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
            <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
              <div className='bg-white rounded-lg w-full max-w-md mx-auto p-6 relative'>
                <button
                  className='absolute top-3 right-3 text-gray-500 hover:text-black'
                  onClick={closeModal}
                >
                  ✕
                </button>
                <h3 className='text-lg font-semibold mb-4'>
                  Cancel with Feedback
                </h3>
                <p className='text-gray-600 text-sm mb-2 break-all'>
                  {selectedEmail}
                </p>
                <textarea
                  className='w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-2 focus:outline-none focus:ring-1 focus:ring-orange-300'
                  placeholder='Write a review message here...'
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                />
                {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
                <button
                  className='w-full bg-[#FF8C00] py-2.5 text-black rounded-lg hover:bg-orange-600 disabled:opacity-50'
                  onClick={handleSend}
                  disabled={
                    loadingRow.reject === selectedUserId || !reasonText.trim()
                  }
                >
                  {loadingRow.reject === selectedUserId ? (
                    <div className='flex items-center justify-center'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                      Sending...
                    </div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
          )}

          <AllTableResponsiveStyle />

          {/* 📄 Pagination */}
          {processedList.length > 0 && (
            <div className='flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal md:gap-0 gap-2'>
              <p className='font-inter'>
                Showing {startIndex + 1} to {startIndex + currentData.length} of{' '}
                {processedList.length} results
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
    </div>
  );
};
