import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../../config/api/httpEndpoint";
import { GET } from "../../../config/api/httpMethods";

// ========== GET All Users-list ==========
export const allUserList = createAsyncThunk(
  "admin/allUserList",
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      const res = await GET(endpoints.admin.GET_ALL_USERS, {
        page,
        limit,
        status,
      });

      console.log("user list:", res);

      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch all users list",
      );
    }
  },
);
