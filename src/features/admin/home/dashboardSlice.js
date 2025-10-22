import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdminSettingsProfile,
  fetchDashboardData,
  updateAdminSettingsProfile,
} from './dashboardFetch';

const initialState = {
  dashboardData: [],
  profileSettings: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'admin/dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetch dashboard data  ---
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
      })
      // --- admin profile settings  ---
      .addCase(fetchAdminSettingsProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSettingsProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileSettings = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminSettingsProfile.rejected, (state, action) => {
        state.loading = false;
        state.profileSettings = [];
        state.error = action.payload;
      })

      // --- admin profile settings UPDATE  ---
      .addCase(updateAdminSettingsProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminSettingsProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileSettings = action.payload.admin;
        state.error = null;
      })
      .addCase(updateAdminSettingsProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const selectDashboardData = (state) =>
  state.admin.dashboard.dashboardData;

export default dashboardSlice.reducer;
