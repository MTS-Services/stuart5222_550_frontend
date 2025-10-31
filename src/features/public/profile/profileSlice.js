// store/slices/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserProfile,
  profileStatusChange,
  submitProfile,
} from "./profileFetch";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    submitLoading: false,
    fetchLoading: false,
    userProfile: [],
    imagePreviews: [],
    files: [],
    errors: {},
    submittedProfiles: [],
    success: false,
    error: null,
  },
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    setImagePreviews: (state, action) => {
      state.imagePreviews = action.payload;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    setSubmitLoading: (state, action) => {
      state.submitLoading = action.payload;
    },
    resetProfile: (state) => {
      state.submitLoading = false;
      state.imagePreviews = [];
      state.files = [];
      state.errors = {};
      state.success = false;
      state.error = null;
    },
    removeImage: (state, action) => {
      const index = action.payload;
      state.files = state.files.filter((_, i) => i !== index);
      state.imagePreviews = state.imagePreviews.filter((_, i) => i !== index);
    },
  },
  extraReducers: (builder) => {
    builder
      // SUBMIT PROFILE
      .addCase(submitProfile.pending, (state) => {
        state.submitLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitProfile.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.success = true;
        state.submittedProfiles.push(action.payload);
        // Reset form data
        state.files = [];
        state.imagePreviews = [];
        state.errors = {};
      })
      .addCase(submitProfile.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      //EDIT PROFILE
      .addCase(profileStatusChange.pending, (state) => {
        state.submitLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(profileStatusChange.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.success = true;
        state.errors = {};
      })
      .addCase(profileStatusChange.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Fetch User Profile Cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.fetchLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.success = true;
        state.userProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Failed to fetch user profile";
        state.success = false;
      });
  },
});

export const {
  setFiles,
  setImagePreviews,
  setErrors,
  setSubmitLoading,
  resetProfile,
  removeImage,
} = profileSlice.actions;

export default profileSlice.reducer;
