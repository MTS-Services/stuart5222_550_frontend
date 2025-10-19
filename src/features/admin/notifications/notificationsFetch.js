import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../../config/api/httpEndpoint';
import { GET } from '../../../config/api/httpMethods';

// Get admin notifications with pagination
export const getAdminNotifications = createAsyncThunk(
  'notifications/getAdminNotifications',
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await GET(endpoints.admin.GET_NOTIFICATIONS, {
        page,
        limit,
      });
      return response; // this will be your payload
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);

// Get unread notifications count
export const getUnreadNotificationsCount = createAsyncThunk(
  'notifications/getUnreadNotificationsCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(endpoints.admin.GET_UNREAD_COUNT);
      return response;
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);

// Mark all notifications as read (if endpoint exists)
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(
        `${endpoints.admin.GET_NOTIFICATIONS}/mark-all-read`
      );
      return response;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return rejectWithValue(error?.response || error.message);
    }
  }
);
