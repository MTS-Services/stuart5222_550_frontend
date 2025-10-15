// cli/src/features/checks/checksSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllChecks } from './checksFetch';

const initialState = {
  checks: [],
  loading: false,
  error: null,
};

const checksSlice = createSlice({
  name: 'checks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ===== Fetch All Checks =====
      .addCase(fetchAllChecks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllChecks.fulfilled, (state, action) => {
        state.loading = false;
        state.checks = action.payload;
      })
      .addCase(fetchAllChecks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default checksSlice.reducer;
