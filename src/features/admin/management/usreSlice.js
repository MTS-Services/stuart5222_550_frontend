// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js
import { createSlice, isRejected } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {
  adminReject,
  adminApprove,
  adminUserList,
  adminUserDraftProfile,
  adminUserVerifiedProfile,
  adminUserDetailsProfiles,
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from './usreFetch';

const initialState = {
  users: [],
  approved_list: [],
  drafts_list: [],
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
      //======================================================
      // ===== User Wait-list Request in HOMEPAGE =====
      // ====================================================
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

      //======================================================
      // ===== User Details =====
      // ====================================================
      .addCase(adminUserDetailsProfiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUserDetailsProfiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
        state.error = null;
      })
      .addCase(adminUserDetailsProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //======================================================
      // ===== User APPROVED Request in HOMEPAGE =====
      // ====================================================
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

      // ======================================================
      // ===== User REJECT Request in HOMEPAGE =====
      // ======================================================
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
      })

      //======================================================
      // ===== admin USER Draft Profile =====
      // ====================================================
      .addCase(adminUserDraftProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUserDraftProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfiles = action.payload.profiles;
        state.error = null;
      })
      .addCase(adminUserDraftProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ======================================================
      // ===== Admin USER Approved Profile =====
      // ======================================================
      .addCase(adminUserApprovedProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(adminUserApprovedProfile.fulfilled, (state, action) => {
        state.approved_list = state.approved_list.filter(
          (user) => user.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(adminUserApprovedProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // ===== User Rejected Draft Profile =====
      // ======================================================
      .addCase(adminUserRejectedProfile.pending, (state) => {
        state.error = null;
      })
      .addCase(adminUserRejectedProfile.fulfilled, (state, action) => {
        state.approved_list = state.approved_list.filter(
          (user) => user.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(adminUserRejectedProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // ===== User Profile Request in HOMEPAGE =====
      // ======================================================
      .addCase(adminUserVerifiedProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminUserVerifiedProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approved_list = action.payload.profiles;
        state.error = null;
      })
      .addCase(adminUserVerifiedProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ===================================
      // ===== Global Rejected Handler =====
      // ===================================
      .addMatcher(isRejected(), (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'An unexpected error occurred';
      });
  },
});

export const { resetUsersError } = adminUserManagementSlice.actions;
export default adminUserManagementSlice.reducer;
