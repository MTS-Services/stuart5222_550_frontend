import api, { FILE_UPLOAD_TIMEOUT } from './axiosInstance';

export const GET = async (url, params) => {
  const { data: responseData } = await api.get(url, { params });
  return responseData;
};

export const POST = async (url, payload) => {
  const isFormData = payload instanceof FormData;

  const { data: responseData } = await api.post(url, payload, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
    // Use extended timeout for file uploads (FormData), default for others
    timeout: isFormData ? FILE_UPLOAD_TIMEOUT : undefined,
  });

  return responseData;
};

export const UPDATE = async (url, payload) => {
  const isFormData = payload instanceof FormData;

  const { data: responseData } = await api.put(url, payload, {
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
    // Use extended timeout for file uploads (FormData), default for others
    timeout: isFormData ? FILE_UPLOAD_TIMEOUT : undefined,
  });

  return responseData;
};

// Add PUT as an alias for UPDATE to maintain compatibility
export const PUT = UPDATE;

export const DELETE = async (url) => {
  const { data: responseData } = await api.delete(url);
  return responseData;
};
