// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js

import { createSlice } from '@reduxjs/toolkit';
import { adminWaitlist } from './waitListFetch';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const adminWaitlistSlice = createSlice({
  name: 'waitList',
  initialState,
  reducers: {
    resetUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== User Wait-list Request in HOMEPAGE =====
      .addCase(adminWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.error = null;
      })
      .addCase(adminWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUsersError } = adminWaitlistSlice.actions;
export default adminWaitlistSlice.reducer;
