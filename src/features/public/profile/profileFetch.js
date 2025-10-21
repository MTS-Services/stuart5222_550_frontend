import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST } from '../../../config/api/httpMethods';
import { endpoints } from '../../../config/api/httpEndpoint';

export const submitProfile = createAsyncThunk(
  'user/profile',
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.user.PROFILE, profileData);
      console.log('Profile submitted successfully:', res);
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to submit profile'
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async ({ userMail }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching profile for email:', userMail);
      const res = await GET(endpoints.user.FETCH_PROFILE(userMail));
      console.log('✅ User profile fetched successfully:', res);
      return res;
    } catch (err) {
      console.error('❌ Failed to fetch user profile:', err);
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch user profile'
      );
    }
  }
);
