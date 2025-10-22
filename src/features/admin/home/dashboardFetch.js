import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, UPDATE } from '../../../config/api/httpMethods';
import { endpoints } from '../../../config/api/httpEndpoint';

// Thunk to fetch dashboard data for admin home page
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

// --- fetch settings  ---
export const fetchAdminSettingsProfile = createAsyncThunk(
  'admin/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.GET_ADMIN_PROFILE);
      console.log('Admin Settings Profile:', res);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// admin profile settings UPDATE
export const updateAdminSettingsProfile = createAsyncThunk(
  'admin/updateSettings',
  async (data, { rejectWithValue }) => {
    try {
      const res = await UPDATE(endpoints.admin.UPDATE_ADMIN_PROFILE, data);
      console.log('Admin Settings Profile Updated:', res);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
