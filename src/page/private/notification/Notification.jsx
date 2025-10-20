// Notification.jsx
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Loading } from '../../../components/ui/loading';
import { useNotification } from '../../../context/NotificationContext';
import {
  getAdminNotifications,
  markAllNotificationsRead,
} from '../../../services/notificationService';
import { AllTableResponsiveStyle } from '../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';

const NotificationView = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const limit = 20;

  // Use notification context
  const { unreadCount, markAllAsRead, fetchUnreadCount } = useNotification();

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAdminNotifications(currentPage, limit);

      if (response) {
        setNotifications(response.notifications || response.data || []);
        setTotalPages(
          response.totalPages || Math.ceil((response.total || 0) / limit)
        );
        setHasMore(
          response.hasMore || currentPage < (response.totalPages || 1)
        );

        toast.success(
          `Loaded ${response.notifications?.length || 0} notifications`,
          {
            position: 'top-right',
            autoClose: 2000,
          }
        );
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      toast.error('Failed to load notifications', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAllRead(true);
      await markAllNotificationsRead();

      // Update context and local state
      markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success('All notifications marked as read', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Failed to mark notifications as read', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setMarkingAllRead(false);
    }
  };

  const loadMoreNotifications = () => {
    if (hasMore && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
                onClick={handleMarkAllRead}
                disabled={markingAllRead}
                className='flex items-center gap-3 font-inter font-normal text-lg hover:text-[#FF8C00] transition-colors duration-200 disabled:opacity-50'
              >
                {markingAllRead ? 'Marking...' : 'Mark All Read'}
                <IoCheckmarkDoneOutline className='w-6 h-6' />
              </button>
            )}
          </div>

          <div className='rounded-sm relative overflow-x-auto md:overflow-x-visible'>
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
                        <img
                          className='w-[40px] h-[40px] rounded-full object-cover'
                          src={
                            notification.image ||
                            notification.avatar ||
                            '/img/page/admin/img1.png'
                          }
                          alt={notification.title || 'Notification'}
                        />
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

                {loading && currentPage > 1 && (
                  <div className='text-center py-4'>
                    <div className='inline-block w-6 h-6 border-2 border-[#FF8C00] border-t-transparent rounded-full animate-spin'></div>
                    <span className='ml-2 text-gray-600'>Loading more...</span>
                  </div>
                )}
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
