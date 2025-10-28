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
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// admin profile settings UPDATE
// admin profile settings UPDATE
export const getUserQRcode = createAsyncThunk(
  'admin/getUserQRcode',
  async (user_email, { rejectWithValue }) => {
    try {
      const res = await GET(
        `${endpoints.admin.GET_USER_QR_CODE}/${user_email}`
      );
      console.log('QR-code →', res);
      return res; // assuming res.data already returns JSON
    } catch (error) {
      console.error('QR Fetch Error →', error);
      return rejectWithValue(error.message || 'Failed to load QR codes');
    }
  }
);
