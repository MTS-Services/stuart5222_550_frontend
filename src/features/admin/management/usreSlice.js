// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js
import { createSlice, isRejected } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  adminReject,
  adminApprove,
  adminUserList,
  adminUserDraftProfile,
  UserVerifiedProfile,
  adminUserDetailsProfiles,
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from "./usreFetch";

const initialState = {
  users: {
    list: [],
    stats: {},
    pagination: {},
    isLoading: false,
    error: null,
  },
  approved_list: [],
  verified: {
    list: [],
    stats: {},
    pagination: {},
    isLoading: false,
    error: null,
  },
  drafts_list: [],
  userProfiles: [],
  isApproved: false,
  isRejected: false,
  isLoading: false,
  error: null,
};

const adminUserManagementSlice = createSlice({
  name: "userManagement",
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
        state.users.isLoading = true;
        state.users.error = null;
      })
      .addCase(adminUserList.fulfilled, (state, action) => {
        state.users.isLoading = false;
        state.users.list = action.payload.users;
        state.users.stats = action.payload.stats;
        state.users.pagination = action.payload.pagination;
        state.users.error = null;
      })
      .addCase(adminUserList.rejected, (state, action) => {
        state.users.isLoading = false;
        state.users.error = action.payload;
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
        state.userProfiles = action.payload;
        state.error = null;
      })
      .addCase(adminUserDetailsProfiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      //======================================================
      // ===== User APPROVED REQUEST IN HOMEPAGE =====
      // ====================================================
      .addCase(adminApprove.pending, (state) => {
        state.isApproved = true;
        state.error = null;
      })
      .addCase(adminApprove.fulfilled, (state, action) => {
        state.isApproved = false;

        const userId =
          action.payload.data?.userId ||
          action.payload.userId ||
          action.payload.data?.user?.id ||
          action.payload.user?.id ||
          action.meta.arg.user_id;

        if (userId) {
          state.users.list = state.users.list.filter(
            (user) => user.id !== userId,
          );
        }
        // Update pagination total if available
        if (state.users.pagination?.total) {
          state.users.pagination.total = state.users.pagination.total - 1;
        }
        toast.success("User approved successfully!");
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
        // Get user ID from multiple possible sources
        const userId =
          action.payload.data?.userId ||
          action.payload.userId ||
          action.payload.data?.user?.id ||
          action.payload.user?.id ||
          action.meta.arg.user_id;

        if (userId) {
          state.users.list = state.users.list.filter(
            (user) => user.id !== userId,
          );
        }
        // Update pagination total if available
        if (state.users.pagination?.total) {
          state.users.pagination.total = state.users.pagination.total - 1;
        }
        toast.success("User rejected successfully!");
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
        const profileId = action.payload.data?.id || action.payload.id;
        state.approved_list = state.approved_list.filter(
          (user) => user.id !== profileId,
        );
        state.userProfiles = state.userProfiles
          ? state.userProfiles.filter((user) => user.id !== profileId)
          : [];

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
        const profileId = action.payload.data?.id || action.payload.id;
        state.approved_list = state.approved_list.filter(
          (user) => user.id !== profileId,
        );
        state.userProfiles = state.userProfiles
          ? state.userProfiles.filter((user) => user.id !== profileId)
          : [];

        state.error = null;
      })
      .addCase(adminUserRejectedProfile.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======================================================
      // ===== ✅ User Verified Profile =====
      // ======================================================
      .addCase(UserVerifiedProfile.pending, (state) => {
        state.verified.isLoading = true;
        state.verified.error = null;
      })
      .addCase(UserVerifiedProfile.fulfilled, (state, action) => {
        state.verified.isLoading = false;
        state.verified.list = action.payload.profiles;
        state.verified.stats = action.payload.stats;
        state.verified.pagination = action.payload.pagination;
        state.verified.error = null;
      })
      .addCase(UserVerifiedProfile.rejected, (state, action) => {
        state.verified.isLoading = false;
        state.verified.error = action.payload;
      })

      // ===================================
      // ===== Global Rejected Handler =====
      // ===================================
      .addMatcher(isRejected(), (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export const { resetUsersError } = adminUserManagementSlice.actions;
export default adminUserManagementSlice.reducer;
