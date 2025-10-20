import { createSlice } from '@reduxjs/toolkit';
import {
  getAdminNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsRead,
} from './notificationsFetch';

const initialState = {
  notifications: [],
  unreadCount: 0,
  unread: 0,
  pagination: { page: 1, limit: 20, totalCount: 0 },
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationsError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== GET NOTIFICATIONS =====
      .addCase(getAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload?.notifications || [];
        state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
        state.pagination = {
          ...state.pagination,
          page: action.payload?.page || state.pagination.page,
          limit: action.payload?.limit || state.pagination.limit,
          totalCount: action.payload?.totalCount || state.pagination.totalCount,
        };

        state.error = null;
      })
      .addCase(getAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== GET UNREAD COUNT =====
      .addCase(getUnreadNotificationsCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreadNotificationsCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unread = action.payload?.unread || 0;
        state.error = null;
      })
      .addCase(getUnreadNotificationsCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== MARK ALL AS READ =====
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0; // Reset unread count
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetNotificationsError, setPage } = notificationsSlice.actions;
export default notificationsSlice.reducer;
