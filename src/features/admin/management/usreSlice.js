// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js
import { createSlice, isRejected } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { adminApprove, adminReject, adminUserList } from './usreFetch';

const initialState = {
  users: [],
  isLoading: false,
  error: null,
};

const adminUserManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    resetUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== User Wait-list Request in HOMEPAGE =====
      .addCase(adminUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUserList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.error = null;
      })
      .addCase(adminUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ===== User Approve Request in HOMEPAGE =====
      .addCase(adminApprove.pending, (state) => {
        state.isApproved = true;
        state.error = null;
      })
      .addCase(adminApprove.fulfilled, (state, action) => {
        state.isApproved = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
        toast.success('User approved!');
        state.error = null;
      })
      .addCase(adminApprove.rejected, (state, action) => {
        state.isApproved = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // ===== User Reject Request in HOMEPAGE =====
      .addCase(adminReject.pending, (state) => {
        state.isRejected = true;
        state.error = null;
      })
      .addCase(adminReject.fulfilled, (state, action) => {
        state.isRejected = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id
        );
        toast.success('User rejected!');
        state.error = null;
      })
      .addCase(adminReject.rejected, (state, action) => {
        state.isRejected = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetUsersError } = adminUserManagementSlice.actions;
export default adminUserManagementSlice.reducer;
