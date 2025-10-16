// src/api/axiosInstance.js
import axios from 'axios';
import { STORAGE } from '../storage/auth/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // ⏱ optional safety timeout
});

// =============== Request Interceptor ===============
api.interceptors.request.use(
  (config) => {
    const token = STORAGE.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional logging (for debugging)
    if (import.meta.env.DEV) {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =============== Response Interceptor ===============
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('🚫 Unauthorized — redirecting to login...');
      // example: window.location.href = '/login';
    }

    if (status >= 500) {
      console.error('💥 Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
