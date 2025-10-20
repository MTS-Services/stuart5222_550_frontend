import { createSlice } from '@reduxjs/toolkit';
import { qrCodeRequest } from './qrCodeFetch';

const initialState = {
  data: null, // store server response if needed
  success: null,
  loading: false,
  error: null,
};

const qrCodeRequestSlice = createSlice({
  name: 'qrCodeRequest', // fixed typo in name
  initialState,
  reducers: {
    resetQrState: (state) => {
      state.error = null;
      state.success = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(qrCodeRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(qrCodeRequest.fulfilled, (state, action) => {
        // console.log('✅ QR Code fulfilled action payload:', action.payload);
        state.loading = false;
        state.data = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(qrCodeRequest.rejected, (state, action) => {
        console.error('❌ QR Code request rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetQrState } = qrCodeRequestSlice.actions;
export default qrCodeRequestSlice.reducer;
