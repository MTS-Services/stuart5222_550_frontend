// src/features/checks/checksThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../config/api/httpEndpoint';
import { GET } from '../../config/api/httpMethods';

// Optional: standardize error structure
const formatError = (err) => ({
  message: err.response?.data?.message || 'Network or server error',
  code: err.response?.status || 500,
  details: err.response?.data || null,
});

// ========== Async Thunk ==========
export const fetchAllChecks = createAsyncThunk(
  'checks/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    console.log('fetchAllChecks API called'); // <-- check this
    try {
      // Allow query params like ?page=1&limit=10
      const checks = await GET(endpoints.check.GET_CHECKS, params);
      return checks;
    } catch (err) {
      // Optional: log error in dev
      if (import.meta.env.VITE_API_NODE_ENV === 'development')
        console.error(err);

      return rejectWithValue(formatError(err));
    }
  }
);
