import { createAsyncThunk } from '@reduxjs/toolkit';
import { POST } from '../../../config/api/httpMethods';
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
