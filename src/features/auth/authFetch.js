// src/features/auth/authFetch.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../config/api/httpEndpoint";
import { STORAGE } from "../../config/storage/auth/authStorage";
import { POST } from "../../config/api/httpMethods";

// ========== Login ==========
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.auth.LOGIN, { email, password });

      if (res?.access_token) {
        STORAGE.setToken(res.access_token);
      }

      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to login user",
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
      console.log("paymentIntent:", res);
      if (res?.success) {
        return res;
      }
    } catch (err) {
      console.log("paymentIntent:", err);
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
      console.log("paymentSubscriptions:", res);
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
