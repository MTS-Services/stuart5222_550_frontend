// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000, // ⏱ optional safety timeout
});

// =============== Request Interceptor ===============
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('access_token');
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWdvdmFudzcwMDAwZG5mamYzczU4bjJ1IiwiZW1haWwiOiJuYXllbUBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwicmVtZW1iZXJNZSI6ZmFsc2UsImlhdCI6MTc2MDQyMTA2NiwiZXhwIjoxNzYwNTA3NDY2fQ.KwrBQD7ZwaW9E5EAibDlN3JrqflSNIZV2cN_7O3_ih4';

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
