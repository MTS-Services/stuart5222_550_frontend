// notificationsFetch.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../../config/api/httpEndpoint';
import { GET, UPDATE } from '../../../config/api/httpMethods';

// Get admin notifications with pagination
export const getAdminNotifications = createAsyncThunk(
  'notifications/getAdminNotifications',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await GET(endpoints.admin.GET_NOTIFICATIONS, {
        page,
        limit,
      });

      // Return only the data (serializable)
      return response;
    } catch (error) {
      console.error('Error fetching admin notifications:', error);

      // Return a simple serializable object for rejected case
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      });
    }
  }
);

// Get unread notifications count
export const getUnreadNotificationsCount = createAsyncThunk(
  'notifications/getUnreadNotificationsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(endpoints.admin.GET_UNREAD_COUNT);
      console.log('UNREAD: ', response);
      return response;
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UPDATE(
        `${endpoints.admin.GET_NOTIFICATIONS}/mark-all-read`
      );

      // Return only serializable data
      return response;
    } catch (error) {
      console.error('Error marking notifications as read:', error);

      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status || 500,
      });
    }
  }
);
