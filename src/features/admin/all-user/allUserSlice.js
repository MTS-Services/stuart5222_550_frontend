import { createSlice } from "@reduxjs/toolkit";
import { allUserList, fetchAllUserById } from "./allUserFetch";

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
        state.allUsers = action.payload.users;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(allUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
        state.detailLoading = false;
        state.detailError = action.payload;
        state.selectedUser = null;
      });
  },
});

export const { resetUsersError, clearSelectedUser } = allUserSlice.actions;
export default allUserSlice.reducer;
