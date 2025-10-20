import { GET, POST } from '../config/api/httpMethods';
import { endpoints } from '../config/api/httpEndpoint';

// Get user profiles with filters and pagination
export const getUserProfiles = async (status = 'ALL', page = 1, limit = 10) => {
  try {
    const response = await GET(endpoints.admin.GET_PROFILES, {
      status,
      page,
      limit
    });
    return response;
  } catch (error) {
    console.error('Error fetching user profiles:', error);
    throw error;
  }
};

// Get single profile by ID
export const getProfileById = async (profileId) => {
  try {
    const response = await GET(endpoints.admin.GET_PROFILE_BY_ID(profileId));
    return response;
  } catch (error) {
    console.error('Error fetching profile details:', error);
    throw error;
  }
};

// Approve profile
export const approveProfile = async (profileId, feedback = '') => {
  try {
    console.log('🎯 Approving profile:', profileId, 'with feedback:', feedback);
    
    // Try with different request body structures
    let response;
    
    try {
      // Attempt 1: Send with feedback only
      response = await POST(endpoints.admin.APPROVE_PROFILE(profileId), {
        feedback
      });
    } catch (error) {
      if (error.response?.status === 404) {
        // Attempt 2: Send empty body
        response = await POST(endpoints.admin.APPROVE_PROFILE(profileId), {});
      } else {
        throw error;
      }
    }
    
    console.log('✅ Approve response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error approving profile:', error);
    console.error('📍 Request details:', {
      profileId,
      endpoint: endpoints.admin.APPROVE_PROFILE(profileId),
      feedback
    });
    throw error;
  }
};

// Reject profile
export const rejectProfile = async (profileId, feedback = '') => {
  try {
    console.log('🎯 Rejecting profile:', profileId, 'with feedback:', feedback);
    
    // Try with different request body structures
    let response;
    
    try {
      // Attempt 1: Send with feedback only
      response = await POST(endpoints.admin.REJECT_PROFILE(profileId), {
        feedback
      });
    } catch (error) {
      if (error.response?.status === 404) {
        // Attempt 2: Send empty body
        response = await POST(endpoints.admin.REJECT_PROFILE(profileId), {});
      } else {
        throw error;
      }
    }
    
    console.log('✅ Reject response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error rejecting profile:', error);
    console.error('📍 Request details:', {
      profileId,
      endpoint: endpoints.admin.REJECT_PROFILE(profileId),
      feedback
    });
    throw error;
  }
};