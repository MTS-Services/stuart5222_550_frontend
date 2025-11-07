import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, UPDATE } from "../../../config/api/httpMethods";
import { endpoints } from "../../../config/api/httpEndpoint";

// Thunk to fetch all mail templates for admin
export const fetchedMailTemplates = createAsyncThunk(
  "admin/fetchMailTemplates",
  async (_, thunkAPI) => {
    try {
      const res = await GET(endpoints.admin.GET_MAIL_TEMPLATES_ALL);
      console.log("Fetched mail templates:", res);
      return res;
    } catch (error) {
      console.log("Error fetching mail templates:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ------------------------------------------
// Thunk to update mail templates for admin
// ------------------------------------------
export const updateMailTemplates = createAsyncThunk(
  "admin/updateMailTemplates",
  async ({ templateData }, { rejectWithValue }) => {
    try {
      const res = await UPDATE(
        endpoints.admin.UPDATE_MAIL_TEMPLATE_APPROVED,
        templateData,
      );
      console.log("Updated mail templates:", res);
      return res;
    } catch (error) {
      console.log("Error updating mail templates:", error);
      return rejectWithValue(error.message);
    }
  },
);
