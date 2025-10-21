import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../../config/api/httpMethods';
import { endpoints } from '../../../config/api/httpEndpoint';

export const fetchDashboardData = createAsyncThunk(
  'admin/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.HOME_DATA);

      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
