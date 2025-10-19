import { createSlice } from '@reduxjs/toolkit';
import { getAdminNotifications } from './notificationsFetch';

const initialState = {
  notifications: [],
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
  },
  extraReducers: (builder) => {
    builder
      // ===== Fetch Notifications =====
      .addCase(getAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;

        console.log('Notification: ', action.payload);
        state.notifications = action.payload.notifications;
        state.error = null;
      })
      .addCase(getAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetNotificationsError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
