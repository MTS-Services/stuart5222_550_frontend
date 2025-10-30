import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa";
import { formatDate } from "../../../utils/formatDate";
import { AllTableResponsiveStyle } from "../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import {
  getAdminNotifications,
  markAllNotificationsRead,
} from "../../../features/admin/notifications/notificationsFetch";
import Skeleton from "../../../components/ui/Skeleton";

const NotificationView = () => {
  const { notifications, loading, unreadCount, pagination } = useSelector(
    (state) => state.notifications,
  );
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const totalPages = Math.ceil(
    (pagination?.totalCount || 1) / (pagination?.limit || 20),
  );

  const hasMore = currentPage < totalPages;

  // Handler to mark all notifications as read
  const handleMarkAllRead = () => {
    // Dispatch action to mark all as read
    dispatch(markAllNotificationsRead());
    console.log("Mark all notifications as read");
  };

  useEffect(() => {
    dispatch(getAdminNotifications({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  return (
    <div className="text-black md:p-8">
      {/* Loading */}
      {loading && currentPage === 1 ? (
        <div className="mt-2 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse border-b border-gray-200 bg-white px-4 py-4 md:px-6"
            >
              <div className="flex items-start gap-3 font-inter">
                {/* Avatar placeholder */}
                <div className="relative flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Title + timestamp row */}
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <Skeleton height={16} width="60%" className="!mb-0" />
                    <Skeleton height={12} width={60} className="!mb-0" />
                  </div>

                  {/* Message body */}
                  <Skeleton height={14} count={2} className="mb-2" />

                  {/* Type badge (optional) */}
                  <Skeleton height={20} width={70} className="rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-raleway font-semibold text-[#002244] lg:text-2xl">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                // disabled={markingAllRead}
                className="flex items-center gap-3 font-inter font-normal transition-colors duration-200 hover:text-[#FF8C00] disabled:opacity-50 md:text-lg"
              >
                {} 'Mark All Read'
                <IoCheckmarkDoneOutline className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="relative cursor-pointer overflow-x-auto rounded-sm md:overflow-x-visible">
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className={`border-b border-gray-200 bg-white px-4 py-4 transition-all duration-200 last:border-b-0 hover:bg-gray-50 md:px-6 ${
                      !notification.isRead
                        ? "border-l-4 border-l-[#FF8C00] bg-orange-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3 font-inter">
                      <div className="relative flex-shrink-0">
                        <div className="rounded-full bg-green-100 p-2.5 text-green-700">
                          <FaRegUser className="h-4 w-4 text-green-700" />
                        </div>
                        {!notification.isRead && (
                          <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#FF8C00]"></div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="line-clamp-1 text-base font-semibold text-[#535369]">
                            {notification.title ||
                              notification.subject ||
                              "Notification"}
                          </h3>
                          <span className="whitespace-nowrap text-xs text-[#666C7E]">
                            {formatDate(
                              notification.createdAt ||
                                notification.date ||
                                notification.timestamp,
                            )}
                          </span>
                        </div>

                        <p className="mt-1 line-clamp-2 break-words text-[15px] font-normal text-[#666C7E]">
                          {notification.message ||
                            notification.description ||
                            notification.body ||
                            "No description available"}
                        </p>

                        {notification.type && (
                          <span
                            className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                              notification.type === "success"
                                ? "bg-green-100 text-green-800"
                                : notification.type === "warning"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : notification.type === "error"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
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
                <div className="mt-6 flex items-center justify-between rounded-lg border bg-white p-4">
                  <p className="font-raleway text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1 || loading}
                      className="rounded border px-3 py-1 font-raleway text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={!hasMore || loading}
                      className="rounded border px-3 py-1 font-raleway text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border bg-white py-12 text-center">
                <div className="mb-4">
                  <IoCheckmarkDoneOutline className="mx-auto h-16 w-16 text-gray-300" />
                </div>
                <h3 className="mb-2 font-raleway text-lg font-medium text-gray-600">
                  No notifications yet
                </h3>
                <p className="font-raleway text-gray-500">
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
