// src/features/user/userFetch.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../../config/api/httpEndpoint';
import { GET, POST } from '../../../config/api/httpMethods';

// ========== GET Wait-list ==========
export const adminWaitlist = createAsyncThunk(
  'user/waitlist',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.GET_ALL_USERS, { page, limit });
      console.log('GET_ALL_USER_BY_ADMIN', res);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to join waitlist'
      );
    }
  }
);
