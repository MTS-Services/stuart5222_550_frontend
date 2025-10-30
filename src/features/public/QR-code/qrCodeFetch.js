//
import { createAsyncThunk } from "@reduxjs/toolkit";
import { endpoints } from "../../../config/api/httpEndpoint";
import { GET, POST } from "../../../config/api/httpMethods";

// ========== POST QR Code Scan ==========
export const qrCodeRequest = createAsyncThunk(
  "qrCode/scan",
  async ({ qr_code, scannerEmail }, { rejectWithValue }) => {
    try {
      // Send body data as the backend expects it
      const body = {};
      if (scannerEmail) {
        body.scannerEmail = scannerEmail;
      }
      const res = await POST(endpoints.user.QR_CODE(qr_code), body);

      return res;
    } catch (err) {
      console.error("QR Code error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "QR Code scan failed, check server logs.",
      );
    }
  },
);
