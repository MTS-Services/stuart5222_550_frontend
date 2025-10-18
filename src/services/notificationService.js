import { GET } from '../config/api/httpMethods';
import { endpoints } from '../config/api/httpEndpoint';

// Get admin notifications with pagination
export const getAdminNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await GET(endpoints.admin.GET_NOTIFICATIONS, {
      page,
      limit
    });
    return response;
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    throw error;
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await GET(endpoints.admin.GET_UNREAD_COUNT);
    return response;
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    throw error;
  }
};

// Mark all notifications as read (if endpoint exists)
export const markAllNotificationsRead = async () => {
  try {
    // Assuming there might be a mark-as-read endpoint
    const response = await GET(`${endpoints.admin.GET_NOTIFICATIONS}/mark-all-read`);
    return response;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};