import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import userReducer from '../features/public/user/userSlice';
import dashboardReducer from './admin/home/dashboardSlice';
import adminUserManagementReducer from '../features/admin/management/usreSlice';
import qrCodeRequetSlice from '../features/public/QR-code/qrCodeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    adminUsers: adminUserManagementReducer,
    qrcode: qrCodeRequetSlice,
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
