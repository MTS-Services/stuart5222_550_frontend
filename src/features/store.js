import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import userReducer from '../features/public/user/userSlice';
import adminWaitlistReducer from '../features/admin/wait-list/waitListSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    adminWaitlist: adminWaitlistReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.VITE_API_NODE_ENV !== 'production',
});
