import { createSlice } from '@reduxjs/toolkit';
import { qrCodeRequest } from './qrCodeFetch';

const initialState = {
  success: null,
  loading: false,
  error: null,
};

const qrCodeRequetSlice = createSlice({
  name: 'qrCodeRequet',
  initialState,
  reducers: {
    resetUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== User Wait-list Request in HOMEPAGE =====
      .addCase(qrCodeRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(qrCodeRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success || true;
        state.error = null;
      })
      .addCase(qrCodeRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserError } = qrCodeRequetSlice.actions;
export default qrCodeRequetSlice.reducer;
