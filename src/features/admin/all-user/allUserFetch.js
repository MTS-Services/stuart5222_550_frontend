import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../../config/api/httpEndpoint";
import { GET } from "../../../config/api/httpMethods";

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
        // Returning nothing with a special reject keeps aborted requests out of UI errors
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
