import { GET, UPDATE } from '../config/api/httpMethods';
import { endpoints } from '../config/api/httpEndpoint';

// Get admin profile
export const getAdminProfile = async () => {
  try {
    const response = await GET(endpoints.admin.GET_PROFILE);
    return response;
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    throw error;
  }
};

// Update admin profile (personal details)
export const updateAdminProfile = async (profileData) => {
  try {
    const response = await UPDATE(endpoints.admin.UPDATE_PROFILE, profileData);
    return response;
  } catch (error) {
    console.error('Error updating admin profile:', error);
    throw error;
  }
};

// Update admin password
export const updateAdminPassword = async (passwordData) => {
  try {
    const response = await UPDATE(
      endpoints.admin.UPDATE_PASSWORD,
      passwordData
    );
    return response;
  } catch (error) {
    console.error('Error updating admin password:', error);
    throw error;
  }
};
