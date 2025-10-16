// src/features/user/userFetch.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../../config/api/httpEndpoint';
import { STORAGE } from '../../../config/storage/auth/authStorage';
import { POST } from '../../../config/api/httpMethods';

// ========== Login ==========
export const requestWaitlist = createAsyncThunk(
  'user/waitlist',
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.user.REGISTER, { name, email });

      console.log('Waitlist Response:', res.message);

      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to join waitlist'
      );
    }
  }
);
