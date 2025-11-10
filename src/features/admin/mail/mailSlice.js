import { createSlice } from "@reduxjs/toolkit";
import { fetchedMailTemplates, updateMailTemplates } from "./mailFetch";

const initialState = {
  templates: [],
  isError: null,
  isLoading: false,
  success: false,
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    resetUsersError: (state) => {
      state.isError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchedMailTemplates.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchedMailTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload.templates; // <- assign the array directly
        state.isError = null;
      })
      .addCase(fetchedMailTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // -------------------------
      // Update Mail Templates
      // -------------------------
      .addCase(updateMailTemplates.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(updateMailTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the specific template in the array
        state.templates = state.templates.map((template) =>
          template.name === action.payload.name 
            ? { ...template, ...action.payload.template } 
            : template
        );
        state.isError = null;
        state.success = true;
      })
      .addCase(updateMailTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.success = false;
      });
  },
});

export const { resetUsersError } = mailSlice.actions;
export const selectMailTemplates = (state) => state.mail.templates;
export default mailSlice.reducer;
