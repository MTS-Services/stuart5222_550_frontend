// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js

import { createSlice } from '@reduxjs/toolkit';
import { usersWaitlist } from './usersFetch';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const usersWaitlistSlice = createSlice({
  name: 'usersWaitlist',
  initialState,
  reducers: {
    resetUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== User Wait-list Request in HOMEPAGE =====
      .addCase(usersWaitlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(usersWaitlist.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.error = null;
      })
      .addCase(usersWaitlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUsersError } = usersWaitlistSlice.actions;
export default usersWaitlistSlice.reducer;
