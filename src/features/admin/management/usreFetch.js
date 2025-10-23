import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../../config/api/httpEndpoint';
import { GET, POST } from '../../../config/api/httpMethods';

// ========== GET User-list ==========
export const adminUserList = createAsyncThunk(
  'admin/userlist',
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.GET_ALL_USERS, {
        page,
        limit,
        status,
      });
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user list'
      );
    }
  }
);

// ========== POST Wait-list ==========
export const adminApprove = createAsyncThunk(
  'admin/approve',
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await POST(
        `${endpoints.admin.APPROVED_WAITLIST_USERS}?user_id=${user_id}`,
        {}
      );

      return res;
    } catch (err) {
      console.error('Approve error:', err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Approval failed, check server logs.'
      );
    }
  }
);

// ========== POST reject waitlist =====================
export const adminReject = createAsyncThunk(
  'admin/reject',
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await POST(
        `${endpoints.admin.REJECT_USER}?user_id=${user_id}`,
        {}
      );
      return res;
    } catch (err) {
      console.error('Reject error:', err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Rejection failed, check server logs.'
      );
    }
  }
);

// ========== GET Single User Details ==========
export const adminUserDetailsProfiles = createAsyncThunk(
  'admin/userDetailsProfiles',
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await GET(`${endpoints.admin.GET_USER_DETAILS}/${user_id}`);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

// ========== GET APPROVED LIST AFTER SUBSCRIPTION ==========
export const adminUserVerifiedProfile = createAsyncThunk(
  'admin/adminUserVerifiedProfile',
  async ({ page = 1, limit, status }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.APPROVE_LIST, {
        params: { page, limit, status }, // ✅ send as query params
      });
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update user details'
      );
    }
  }
);

// ========== GET DRAFT LIST =====================
export const adminUserDraftProfile = createAsyncThunk(
  'admin/createDraft',
  async ({ page = 1, limit, status }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.DRAFTS_LIST, {
        params: { page, limit, status }, // ✅ send as query params
      });
      return res;
    } catch (err) {
      console.log('ERROR DRAFT_PROFILE:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create draft'
      );
    }
  }
);

// ========== POST APPROVED LIST ==========
export const adminUserApprovedProfile = createAsyncThunk(
  'admin/adminUserApprovedProfile',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await POST(
        `${endpoints.admin.APPROVED_DRAFT}/${id}/approve`,
        {}
      );

      return res;
    } catch (err) {
      console.log('❌ ERROR APPROVED_PROFILE:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to approve profile'
      );
    }
  }
);

// ========== POST_USER_REJECTED_PROFILE ==========
export const adminUserRejectedProfile = createAsyncThunk(
  'admin/adminUserRejectedProfile',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await POST(
        `${endpoints.admin.REJECTED_DRAFT}/${id}/reject`,
        { reason } // ✅ send the reason here
      );
      console.log(`✅ adminUserRejected ${id} Profile:`, res);
      return res.data;
    } catch (err) {
      console.log('❌ ERROR REJECTED_PROFILE:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to reject profile'
      );
    }
  }
);
