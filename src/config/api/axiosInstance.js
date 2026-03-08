// src/api/axiosInstance.js
import axios from "axios";
import { AUTH_COOKIE } from "../../utils/authCookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000, // ⏱ default timeout 30 seconds
});

// Extended timeout for file uploads (20 minutes)
export const FILE_UPLOAD_TIMEOUT = 1200000;

// =============== Request Interceptor ===============
api.interceptors.request.use(
  (config) => {
    const token = AUTH_COOKIE.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional logging (for debugging)
    if (import.meta.env.DEV) {
      console.log("📤 Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =============== Response Interceptor ===============
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (!error.response) {
      console.error("🌐 Network error");
      return Promise.reject(error);
    }

    if (status === 401) {
      console.warn("🚫 Session expired");
      // Remove token immediately
      AUTH_COOKIE.removeToken();
      localStorage.setItem("expired", true); // Trigger logout across tabs
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/auth/login")) {
        // Store session expired flag in sessionStorage
        sessionStorage.setItem("sessionExpired", "true");
        // Redirect to login page
        window.location.href = "/auth/login";
      }
    }

    if (status >= 500) {
      console.error("💥 Server error:", error.response.data);
    }

    return Promise.reject(error);
  },
);

export default api;
