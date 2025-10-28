import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AllTableResponsiveStyle } from '../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';
import { formatDate } from '../../../../utils/formatDate';

export const UserEditTable = () => {
  const { approved_list, isLoading, error } = useSelector(
    (state) => state.adminUsers
  );

  // ✅ Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ Show all users (no filtering)
  const allUsers = approved_list || [];
  console.log('Approved_user', allUsers);
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = allUsers.slice(startIndex, startIndex + itemsPerPage);
  // ✅ Pagination handlers
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className='font-inter'>
      <div className='relative overflow-x-auto md:overflow-x-visible'>
        {/* 🌀 Loading / Error / Empty states */}
        {isLoading ? (
          <div>
            <p colSpan='5' className='text-center p-4'>
              Loading...
            </p>
          </div>
        ) : error ? (
          <p className='text-center py-10 text-red-500'>{error}</p>
        ) : currentData.length === 0 ? (
          <p className='text-center py-10 text-gray-500'>No data found.</p>
        ) : (
          <table className='min-w-full table-fixed text-left text-xs sm:text-sm md:text-base'>
            <thead className='bg-white text-black text-lg font-normal'>
              <tr>
                <th className='px-7 py-3 w-1/5 whitespace-nowrap'>Date</th>
                <th className='px-5 py-3 w-1/5 whitespace-nowrap'>Name</th>
                <th className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                  Age
                </th>
                <th className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                  Height
                </th>
                <th className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                  QR Card
                </th>
                <th className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='text-black text-base font-normal'>
              {currentData.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
                >
                  <td className='px-7 py-3 w-1/5 whitespace-nowrap'>
                    {formatDate(row.createdAt) || '—'}
                  </td>
                  <td className='px-5 py-3 w-1/5 whitespace-nowrap'>
                    {row.user.name || '—'}
                  </td>
                  <td className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                    {row.age || '—'} <span className=''>years</span>
                  </td>
                  <td className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                    {row.height || '—'}
                  </td>
                  <td className='px-5 py-3 w-1/5 whitespace-nowrap text-center'>
                    <Link to={`/admin/user-edit/qr-code/${row.email}`}>
                      <button className='bg-[#00ac42] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap hover:bg-[#008b13] transition'>
                        See QR Card
                      </button>
                    </Link>
                  </td>
                  <td className='px-7 py-2.5 whitespace-nowrap flex items-center justify-center gap-3'>
                    <Link to={`/admin/user-edit/${row.id}`}>
                      <button className='bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap hover:bg-[#d16200] transition'>
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
      {approved_list.length > 0 && (
        <div className='flex items-center text-gray-600 justify-between mt-8 md:text-base text-sm font-poppins font-normal md:gap-0 gap-2'>
          <p className='font-inter'>
            Showing {startIndex + 1} to {startIndex + currentData.length} of{' '}
            {approved_list.length} results
          </p>
          <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
            <button
              className='border border-gray-600 rounded-xl md:px-5 px-4 md:py-2 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className='border border-gray-600 rounded-xl md:px-5 px-4 md:py-2 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
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
