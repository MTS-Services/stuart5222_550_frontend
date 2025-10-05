// instance.js

import axios from "axios";


const BASE_URL = "/fakejsondata"; // public/fakejsondata will be served from /fakejsondata

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});


export const getData = async (endpoint, id = null, params = {}) => {
  try {
    const url = id ? `${endpoint}/${id}` : endpoint;
    const response = await instance.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`GET Error [/${endpoint}]:`, error);
    throw error;
  }
};

// postData, updateData এবং deleteData ফাংশনগুলোও একইভাবে ঠিক করা প্রয়োজন।
export const postData = async (endpoint, payload) => {
  try {
    const response = await instance.post(`${endpoint}`, payload);
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
