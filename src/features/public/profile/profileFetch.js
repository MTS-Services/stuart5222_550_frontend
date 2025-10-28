import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST, UPDATE } from '../../../config/api/httpMethods';
import { endpoints } from '../../../config/api/httpEndpoint';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async ({ userMail }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.user.FETCH_PROFILE(userMail));

      return res;
    } catch (err) {
      console.error('❌ Failed to fetch user profile:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);

export const submitProfile = createAsyncThunk(
  'user/setProfile',
  async (submitData, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.user.SETUP_PROFILE, submitData);

      return res;
    } catch (err) {
      console.error('Failed to submit profile:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit profile'
      );
    }
  }
);

export const submitEditProfile = createAsyncThunk(
  'user/editProfile',
  async (submitData, { rejectWithValue }) => {
    try {
      const res = await UPDATE(endpoints.user.EDIT_PROFILE, submitData);

      return res;
    } catch (err) {
      console.error('Failed to submit profile:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit profile'
      );
    }
  }
);
