import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import userReducer from '../features/public/user/userSlice';
import dashboardReducer from './admin/home/dashboardSlice';
import qrCodeRequetReducer from '../features/public/QR-code/qrCodeSlice';
import notificationsReducer from './admin/notifications/notificationsSlice';
import adminUserManagementReducer from '../features/admin/management/usreSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    adminUsers: adminUserManagementReducer,
    notifications: notificationsReducer,
    qrcode: qrCodeRequetReducer,
    // Add other reducers here
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.VITE_API_NODE_ENV !== 'production',
});
