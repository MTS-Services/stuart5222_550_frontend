import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../../config/api/httpEndpoint";
import { DELETE, GET } from "../../../config/api/httpMethods";

const isAbortError = (err) =>
  err?.name === "CanceledError" ||
  err?.name === "AbortError" ||
  err?.code === "ERR_CANCELED";

// ========== GET All Users-list ==========
export const allUserList = createAsyncThunk(
  "admin/allUserList",
  async ({ page, limit, status, username }, { rejectWithValue, signal }) => {
    try {
      const res = await GET(
        endpoints.admin.GET_ALL_USERS,
        {
          page,
          limit,
          status,
          username: username?.trim() || undefined,
        },
        { signal },
      );

      return res;
    } catch (err) {
      if (isAbortError(err) || signal?.aborted) {
        return rejectWithValue({ aborted: true });
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch all users list",
      );
    }
  },
);

// ========== GET single user (any status) ==========
export const fetchAllUserById = createAsyncThunk(
  "admin/fetchAllUserById",
  async (userId, { rejectWithValue, signal }) => {
    try {
      const res = await GET(
        `${endpoints.admin.GET_USER_BY_ID}/${userId}`,
        undefined,
        { signal },
      );
      return res;
    } catch (err) {
      if (isAbortError(err) || signal?.aborted) {
        return rejectWithValue({ aborted: true });
      }
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user details",
      );
    }
  },
);

// ========== Delete user account (any status, with or without profile) ==========
export const adminDeleteUser = createAsyncThunk(
  "admin/deleteUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await DELETE(`${endpoints.admin.DELETE_USER}/${userId}`);
      return { ...res, userId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user",
      );
    }
  },
);
