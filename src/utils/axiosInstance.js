import axios from "axios";
import Cookies from "js-cookie";

const BASE_URL = "https://staurt5backend.mtscorporate.com";
const COOKIE_NAME = 'token';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get(COOKIE_NAME); 
    
    let finalToken = token;
    if (!finalToken) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        finalToken = userInfo?.token;
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage:", e);
      }
    }

    if (finalToken) {
      config.headers["Authorization"] = `Bearer ${finalToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

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
    const response = await instance.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error(`POST Error [/${endpoint}]:`, error);
    throw error;
  }
};

export const updateData = async (endpoint, id, payload) => {
  try {
    const response = await instance.put(`${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`PUT Error [/${endpoint}/${id}]:`, error);
    throw error;
  }
};

export const deleteData = async (endpoint, id) => {
  try {
    const response = await instance.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`DELETE Error [/${endpoint}/${id}]:`, error);
    throw error;
  }
};

export default instance;