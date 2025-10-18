import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardFetch';

const initialState = {
  dashboardData: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'admin/dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.dashboardData = [];
        state.error = action.payload;
      });
  },
});

export const selectDashboardData = (state) =>
  state.admin.dashboard.dashboardData;

export default dashboardSlice.reducer;
