import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  allUserList,
  fetchAllUserById,
  adminDeleteUser,
} from "./allUserFetch";

const initialState = {
  allUsers: [],
  selectedUser: null,
  pagination: {},
  stats: {},
  isLoading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const allUserSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    resetUsersError: (state) => {
      state.error = null;
      state.detailError = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(allUserList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload?.users || [];
        state.pagination = action.payload?.pagination || {};
        state.stats = action.payload?.stats || {};
        state.error = null;
      })
      .addCase(allUserList.rejected, (state, action) => {
        if (action.meta?.aborted || action.payload?.aborted) {
          state.isLoading = false;
          return;
        }
        state.isLoading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to fetch all users list";
      })
      .addCase(fetchAllUserById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchAllUserById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUser = action.payload;
        state.detailError = null;
      })
      .addCase(fetchAllUserById.rejected, (state, action) => {
        if (action.meta?.aborted || action.payload?.aborted) {
          state.detailLoading = false;
          return;
        }
        state.detailLoading = false;
        state.detailError =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Failed to fetch user details";
        state.selectedUser = null;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        state.allUsers = (state.allUsers || []).filter((u) => u.id !== userId);
        if (state.selectedUser?.id === userId) {
          state.selectedUser = null;
        }
        toast.success("User deleted successfully!");
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        toast.error(action.payload || "Failed to delete user");
      });
  },
});

export const { resetUsersError, clearSelectedUser } = allUserSlice.actions;
export default allUserSlice.reducer;
