// const // src/features/user/userFetch.js
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
        `${endpoints.admin.APPROVE_USER}?user_id=${user_id}`,
        {}
      );

      console.log('Approve response:', res);
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

// ========== GET User Details ==========
export const adminUserDetails = createAsyncThunk(
  'admin/userDetails',
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const res = await GET(
        `${endpoints.admin.GET_USER_DETAILS}?user_id=${user_id}`
      );
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user details'
      );
    }
  }
);

// ========== POST Update User Details ==========
export const adminUserProfile = createAsyncThunk(
  'admin/adminUserProfile',
  async ({ page = 1, limit }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.USER_PROFILE, {
        page,
        limit,
      });

      console.log('User Profile response:', res);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update user details'
      );
    }
  }
);
