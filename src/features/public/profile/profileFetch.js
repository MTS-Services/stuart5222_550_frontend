import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, UPDATE } from "../../../config/api/httpMethods";
import { endpoints } from "../../../config/api/httpEndpoint";

export const getApiErrorMessage = (err, fallback) => {
  if (typeof err === "string" && err.trim()) return err;
  const message = err?.response?.data?.message ?? err?.payload;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  if (typeof err?.message === "string" && err.message.trim()) return err.message;
  return fallback;
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async ({ userMail }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.user.FETCH_PROFILE(userMail));

      return res;
    } catch (err) {
      console.error("❌ Failed to fetch user profile:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user profile",
      );
    }
  },
);

export const rejectedProfile = createAsyncThunk(
  "user/rejectedProfile",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await GET(
        `${endpoints.admin.GET_USER_REJECTED_PROFILE}/${id}`,
      );
      return res;
    } catch (err) {
      console.error("❌ Failed to fetch rejected profile:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch rejected profile",
      );
    }
  },
);

export const submitProfile = createAsyncThunk(
  "user/setProfile",
  async (submitData, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.user.SETUP_PROFILE, submitData);
      console.log("submitted-after:", res);
      return res;
    } catch (err) {
      console.error("Failed to submit profile:", err);
      return rejectWithValue(
        getApiErrorMessage(err, "Failed to submit profile"),
      );
    }
  },
);

export const submitEditProfile = createAsyncThunk(
  "user/editProfile",
  async (submitData, { rejectWithValue }) => {
    try {
      const res = await UPDATE(endpoints.user.EDIT_PROFILE, submitData);

      return res;
    } catch (err) {
      console.error("Failed to submit profile:", err);
      return rejectWithValue(
        getApiErrorMessage(err, "Failed to submit profile"),
      );
    }
  },
);

export const reorderProfileImages = async (email, payload) => {
  try {
    const res = await UPDATE(
      endpoints.user.REORDER_PROFILE_IMAGES(email),
      payload,
    );
    return res;
  } catch (err) {
    const message = getApiErrorMessage(err, "Failed to save photo order");
    throw new Error(message);
  }
};

export const profileStatusChange = createAsyncThunk(
  "user/statusChange",
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await POST(endpoints.user.STATUS_CHANGE, { email });
      return res;
    } catch (err) {
      console.error("Failed to submit profile:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to submit profile",
      );
    }
  },
);
