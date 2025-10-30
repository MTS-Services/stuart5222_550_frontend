import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminSettingsProfile,
  updateAdminSettingsProfile,
  fetchDashboardData,
  getUserQRcode,
} from "./dashboardFetch";

const initialState = {
  dashboardData: [],
  profileSettings: [],
  qrCodeList: [],
  qrCodeUser: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "admin/dashboard",
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
        state.dashboardData = action.payload.data || [];
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
        state.profileSettings = action.payload || [];
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
        state.profileSettings = action.payload?.admin || [];
      })
      .addCase(updateAdminSettingsProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- get user QR codes ---
      .addCase(getUserQRcode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserQRcode.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.loading = false;
        state.qrCodeList = Array.isArray(payload.cards) ? payload.cards : [];
        state.qrCodeUser = payload.user || null;
      })
      .addCase(getUserQRcode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const selectDashboardData = (state) => state.dashboard.dashboardData;
export default dashboardSlice.reducer;
