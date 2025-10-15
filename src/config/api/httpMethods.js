import api from './axiosInstance';

export const GET = async (url, params) => {
  const { data: responseData } = await api.get(url, { params });
  return responseData;
};

export const POST = async (url, payload) => {
  const { data: responseData } = await api.post(url, payload);
  return responseData;
};

export const UPDATE = async (url, data) => {
  const { data: responseData } = await api.put(url, data);
  return responseData;
};

export const DELETE = async (url) => {
  const { data: responseData } = await api.delete(url);
  return responseData;
};
