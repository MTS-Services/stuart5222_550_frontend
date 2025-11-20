// src/features/auth/authSlice.js -> authFetch.js -> httpEndpoint.js
import { createSlice } from "@reduxjs/toolkit";
import {
  adminLoginUser,
  userLoginUser,
  paymentIntent,
  paymentSubscriptions,
  resetPassword,
} from "./authFetch";
import { AUTH_COOKIE } from "../../utils/authCookie";

const user = AUTH_COOKIE.getUser();

const initialState = {
  user: user,
  token: AUTH_COOKIE.getToken() || null,
  loading: false,
  error: null,
  isAuthenticated: !!user,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      AUTH_COOKIE.setUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      // Clear cookies
      AUTH_COOKIE.removeToken();
      AUTH_COOKIE.removeUser();
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== User Login =====
      .addCase(userLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(userLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // ===== Admin Login =====
      .addCase(adminLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(adminLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ===== Reset Password =====
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== payment Intent =====
      .addCase(paymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = true;
      })
      .addCase(paymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== payment Intent =====
      .addCase(paymentSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(paymentSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentSuccess = true;
      })
      .addCase(paymentSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthError, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
