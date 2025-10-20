import { Link } from 'react-router-dom';
import { AllTableResponsiveStyle } from '../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';
import { Loading } from '../../../../components/ui/loading';

export const UserEditTable = ({
  loading,
  error,
  currentData,
  highlightText,
  startIndex,
  filteredData,
  handlePrevious,
  currentPage,
  handleNext,
  totalPages,
  pagination,
  stats,
}) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusStyles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };
  return (
    <div className='font-inter'>
      <div className='relative overflow-x-auto md:overflow-x-visible'>
        {loading ? (
          <Loading />
        ) : error ? (
          <p className='text-center py-10 text-red-500'>{error}</p>
        ) : currentData.length === 0 ? (
          <p className='text-center py-10 text-gray-500'>No data found.</p>
        ) : (
          <table className='min-w-full table-fixed text-left text-xs sm:text-sm md:text-base'>
            <thead className='bg-white text-black text-lg font-normal'>
              <tr>
                <th className='px-4 py-3 whitespace-nowrap'>Date</th>
                <th className='px-4 py-3 whitespace-nowrap'>User</th>
                <th className='px-4 py-3 whitespace-nowrap'>Age</th>
                <th className='px-4 py-3 whitespace-nowrap'>Height</th>
                <th className='px-4 py-3 whitespace-nowrap'>Status</th>
                <th className='px-4 py-3 whitespace-nowrap'>Location</th>
                <th className='px-4 py-3 whitespace-nowrap'>Action</th>
              </tr>
            </thead>
            <tbody className='text-black text-base font-normal'>
              {currentData.map((profile, index) => (
                <tr
                  key={profile.id || index}
                  className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
                >
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {formatDate(profile.createdAt)}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={profile.facePhoto ? `${import.meta.env.VITE_BACKEND_URL || 'https://staurt5backend.mtscorporate.com'}${profile.facePhoto}` : '/img/page/admin/img1.png'}
                        alt={profile.user?.name || 'User'}
                        className='w-10 h-10 rounded-full object-cover'
                      />
                      <div>
                        <div className='font-medium'>
                          {highlightText(profile.user?.name || 'N/A')}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {highlightText(profile.user?.email || 'N/A')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {profile.age || 'N/A'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {profile.height || 'N/A'}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(profile.status)}`}>
                      {profile.status}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='max-w-32 truncate' title={profile.location}>
                      {profile.location || 'N/A'}
                    </div>
                  </td>
                  <td className='px-4 py-2.5 whitespace-nowrap'>
                    <Link to={`/admin/profile-details/${profile.id}`}>
                      <button className='bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap hover:bg-[#e56b00] transition-colors'>
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
      <div className='flex items-center text-gray-600 justify-between mt-8 md:text-base text-sm font-poppins font-normal md:gap-0 gap-2'>
        <p className='font-inter'>
          {pagination ? (
            <>
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
              {pagination.totalCount} results
              <span className='text-sm text-gray-500 ml-2'>
                (Page {pagination.currentPage} of {pagination.totalPages})
              </span>
            </>
          ) : (
            `Showing ${currentData.length} results`
          )}
        </p>
        <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
          <button
            className='border border-gray-600 rounded-xl md:px-5 px-4 md:py-2 py-1.5 disabled:opacity-50 hover:bg-gray-50 transition-colors'
            onClick={handlePrevious}
            disabled={!pagination?.hasPrevPage}
          >
            Previous
          </button>
          <button
            className='border border-gray-600 rounded-xl md:px-5 px-4 md:py-2 py-1.5 disabled:opacity-50 hover:bg-gray-50 transition-colors'
            onClick={handleNext}
            disabled={!pagination?.hasNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
