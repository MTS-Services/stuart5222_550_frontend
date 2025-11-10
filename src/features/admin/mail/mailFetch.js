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
      // Dynamic endpoint based on template name
      const endpoint = `/admin/templates/${templateData.name}`;
      
      // Transform data to match backend expectations
      const payload = {
        subject: templateData.subject,
        body: templateData.body,
        htmlTemplate: templateData.html_template // Convert snake_case to camelCase
      };
      
      console.log("Updating template with endpoint:", endpoint);
      console.log("Payload:", payload);
      
      const res = await UPDATE(endpoint, payload);
      console.log("Updated mail templates:", res);
      return { ...res, name: templateData.name, id: templateData.id };
    } catch (error) {
      console.log("Error updating mail templates:", error);
      return rejectWithValue(error.message);
    }
  },
);
