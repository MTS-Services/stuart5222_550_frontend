import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegUser } from 'react-icons/fa';
// import Loading from '../../../components/ui/loading';
import { formatDate } from '../../../utils/formatDate';
import { AllTableResponsiveStyle } from '../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';

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

const NotificationView = () => {
  const { notifications, loading, unreadCount, pagination } = useSelector(
    (state) => state.notifications
  );

  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const totalPages = Math.ceil(
    (pagination?.totalCount || 1) / (pagination?.limit || 20)
  );
  const hasMore = currentPage < totalPages;

  return (
    <div className='text-black p-4 md:p-8'>
      {/* Loading */}
      {loading && currentPage === 1 ? (
        <Loading />
      ) : (
        <>
          <div className='flex flex-wrap justify-between items-center mb-8 gap-4'>
            <div>
              <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
                Notifications
              </h2>
              {unreadCount > 0 && (
                <p className='text-sm text-gray-600 mt-1'>
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                // onClick={handleMarkAllRead}
                // disabled={markingAllRead}
                className='flex items-center gap-3 font-inter font-normal text-lg hover:text-[#FF8C00] transition-colors duration-200 disabled:opacity-50'
              >
                {} 'Mark All Read'
                <IoCheckmarkDoneOutline className='w-6 h-6' />
              </button>
            )}
          </div>

          <div className='rounded-sm relative overflow-x-auto md:overflow-x-visible cursor-pointer'>
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`bg-white border-b border-gray-200 last:border-b-0 py-4 px-4 md:px-6 transition-all duration-200 hover:bg-gray-50 ${
                      !notification.isRead
                        ? 'border-l-4 border-l-[#FF8C00] bg-orange-50'
                        : ''
                    }`}
                  >
                    <div className='font-inter flex items-start gap-3'>
                      <div className='relative flex-shrink-0'>
                        <div className='bg-green-100 text-green-700 rounded-full p-2.5'>
                          <FaRegUser className='w-4 h-4 text-green-700' />
                        </div>
                        {!notification.isRead && (
                          <div className='absolute -top-1 -right-1 w-3 h-3 bg-[#FF8C00] rounded-full border-2 border-white'></div>
                        )}
                      </div>

                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <h3 className='text-base font-semibold text-[#535369] line-clamp-1'>
                            {notification.title ||
                              notification.subject ||
                              'Notification'}
                          </h3>
                          <span className='text-xs text-[#666C7E] whitespace-nowrap'>
                            {formatDate(
                              notification.createdAt ||
                                notification.date ||
                                notification.timestamp
                            )}
                          </span>
                        </div>

                        <p className='text-[#666C7E] font-normal text-[15px] break-words mt-1 line-clamp-2'>
                          {notification.message ||
                            notification.description ||
                            notification.body ||
                            'No description available'}
                        </p>

                        {notification.type && (
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                              notification.type === 'success'
                                ? 'bg-green-100 text-green-800'
                                : notification.type === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : notification.type === 'error'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {notification.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className='flex items-center justify-between mt-6 p-4 bg-white rounded-lg border'>
                  <p className='text-sm text-gray-600'>
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className='flex items-center gap-2'>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || loading}
                      className='px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Previous
                    </button>

                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={!hasMore || loading}
                      className='px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className='text-center py-12 bg-white rounded-lg border'>
                <div className='mb-4'>
                  <IoCheckmarkDoneOutline className='w-16 h-16 mx-auto text-gray-300' />
                </div>
                <h3 className='text-lg font-medium text-gray-600 mb-2'>
                  No notifications yet
                </h3>
                <p className='text-gray-500'>
                  You're all caught up! New notifications will appear here.
                </p>
              </div>
            )}
          </div>
          <AllTableResponsiveStyle />
        </>
      )}
    </div>
  );
};

export default NotificationView;
