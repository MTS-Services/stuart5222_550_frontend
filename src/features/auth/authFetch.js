// src/features/auth/authFetch.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../config/api/httpEndpoint";
import { POST } from "../../config/api/httpMethods";
import { AUTH_COOKIE } from "../../utils/authCookie";

// ========== Login ==========
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.auth.LOGIN, { email, password });

      if (res?.access_token) {
        AUTH_COOKIE.set(res.access_token); // <-- store cookie
      }

      return res;
    } catch (err) {
      console.error("loginUser error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to login user",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.auth.SET_PASSWORD, {
        email,
        password,
      });
      return res;
    } catch (err) {
      console.error("resetPassword error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

// ========== Payment Intent ==========
export const paymentIntent = createAsyncThunk(
  "auth/paymentIntent",
  async ({ paymentData }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.auth.PAYMENT_INTENT, paymentData);

      if (res?.success) {
        return res;
      }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to process payment",
      );
    }
  },
);

// ========== Payment ==========
export const paymentSubscriptions = createAsyncThunk(
  "auth/paymentSubscriptions",
  async ({ paymentData }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.auth.PAYMENT_SUBSCRIPTION, paymentData);

      if (res?.success) {
        return res;
      }
    } catch (err) {
      console.log("paymentSubscriptions:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to process payment",
      );
    }
  },
);
