// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js

import { createSlice } from '@reduxjs/toolkit';
import { requestWaitlist } from './userFetch';

const initialState = {
  success: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== User Wait-list Request in HOMEPAGE =====
      .addCase(requestWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(requestWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserError } = userSlice.actions;
export default userSlice.reducer;
