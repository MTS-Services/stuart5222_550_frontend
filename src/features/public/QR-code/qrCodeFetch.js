//
import { createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../../config/api/httpEndpoint';
import { GET, POST } from '../../../config/api/httpMethods';

// ========== POST Wait-list ==========
export const qrCodeRequest = createAsyncThunk(
  'admin/qrcode',
  async ({ qr_code }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.user.QR_CODE(qr_code));
      console.log('QR Code response:', res);
      return res;
    } catch (err) {
      console.error('QR Code error:', err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'QR Code scan failed, check server logs.'
      );
    }
  }
);
