// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from './authFetch';
import { STORAGE } from '../../config/storage/auth/authStorage';

const token = STORAGE.getToken();

console.log('token: ', token);

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== Login =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer;
