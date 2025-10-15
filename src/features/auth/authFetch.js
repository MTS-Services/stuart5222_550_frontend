// src/features/auth/authFetch.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../config/api/httpEndpoint';
import { STORAGE } from '../../config/storage/auth/authStorage';
import { POST } from '../../config/api/httpMethods';

// ========== Login ==========
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.auth.LOGIN, { email, password });

      if (res?.access_token) {
        STORAGE.setToken(res.access_token);
      }

      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to login user'
      );
    }
  }
);
