import { createSlice } from "@reduxjs/toolkit";
import { allUserList } from "./allUserFetch";

const initialState = {
  allUsers: [],
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  },
  isLoading: false,
  error: null,
};

const allUserSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    resetUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //======================================================
      // ===== All Users Request in HOMEPAGE =====
      // ====================================================
      .addCase(allUserList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(allUserList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.profiles;
        state.pagination = action.payload.pagination; // <-- ADD THIS
        state.error = null;
      })
      .addCase(allUserList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUsersError } = allUserSlice.actions;
export default allUserSlice.reducer;
