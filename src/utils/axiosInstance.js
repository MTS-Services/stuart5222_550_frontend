// src/utils/axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';

// ===========code by shakil munshi=========
// Server run comment: npx json-server --watch bd.json --port 3011
// ===========code by shakil munshi=========

// ================================================

const BASE_URL = 'http://localhost:5000';

// ===========code by shakil munshi=========
// Create axios instance
// ================================================

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ===========code by shakil munshi=========
// 🔐 Request Interceptor
// ================================================

instance.interceptors.request.use(
  (config) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to parse userInfo from localStorage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===========code by shakil munshi=========
// 🛠️ CRUD Functions
// ================================================

export const getData = async (endpoint, id = null, params = {}) => {
  try {
    const url = id ? `${endpoint}/${id}` : `${endpoint}`;
    const response = await instance.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`GET Error [/${endpoint}]:`, error);
    throw error;
  }
};

export const postData = async (endpoint, payload) => {
  try {
    const response = await instance.post(`/${endpoint}`, payload);
    return response.data;
  } catch (error) {
    console.error(`POST Error [/${endpoint}]:`, error);
    throw error;
  }
};

export const updateData = async (endpoint, id, payload) => {
  try {
    const response = await instance.put(`/${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`PUT Error [/${endpoint}/${id}]:`, error);
    throw error;
  }
};

export const deleteData = async (endpoint, id) => {
  try {
    const response = await instance.delete(`/${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`DELETE Error [/${endpoint}/${id}]:`, error);
    throw error;
  }
};

// ===========code by shakil munshi=========
// 📦 Export everything for global use
// ================================================

export default instance;
