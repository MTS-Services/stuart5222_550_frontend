import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import userReducer from '../features/user/userSlice';
import usersWaitlistSlice from '../features/users-management/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    userWaitlist: usersWaitlistSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.VITE_API_NODE_ENV !== 'production',
});
