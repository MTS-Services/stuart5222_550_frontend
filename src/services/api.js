import { GET, POST, PUT, DELETE } from "../config/api/httpMethods";
import { endpoints } from "../config/api/httpEndpoint";

// ===================================
// Admin Profile Management
// ===================================
export const getAdminProfile = async () => {
  try {
    const response = await GET(endpoints.admin.GET_PROFILE);
    return response;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};

export const updateAdminProfile = async (profileData) => {
  try {
    const response = await PUT(endpoints.admin.UPDATE_PROFILE, profileData);
    return response;
  } catch (error) {
    console.error("Error updating admin profile:", error);
    throw error;
  }
};

export const updateAdminPassword = async (passwordData) => {
  try {
    const response = await PUT(endpoints.admin.UPDATE_PASSWORD, passwordData);
    return response;
  } catch (error) {
    console.error("Error updating admin password:", error);
    throw error;
  }
};

// ===================================
// Email Template Management
// ===================================
export const getEmailTemplates = async () => {
  try {
    const response = await GET(endpoints.admin.EMAIL_TEMPLATES);
    return response;
  } catch (error) {
    console.error("Error fetching email templates:", error);
    throw error;
  }
};

export const getEmailTemplate = async (templateName) => {
  try {
    const response = await GET(
      `${endpoints.admin.EMAIL_TEMPLATE_BY_NAME}/${templateName}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching email template:", error);
    throw error;
  }
};

export const createEmailTemplate = async (templateData) => {
  try {
    const response = await POST(endpoints.admin.EMAIL_TEMPLATES, templateData);
    return response;
  } catch (error) {
    console.error("Error creating email template:", error);
    throw error;
  }
};

export const updateEmailTemplate = async (templateName, templateData) => {
  try {
    const response = await PUT(
      `${endpoints.admin.EMAIL_TEMPLATE_BY_NAME}/${templateName}`,
      templateData,
    );
    return response;
  } catch (error) {
    console.error("Error updating email template:", error);
    throw error;
  }
};

export const deleteEmailTemplate = async (templateName) => {
  try {
    const response = await DELETE(
      `${endpoints.admin.EMAIL_TEMPLATE_BY_NAME}/${templateName}`,
    );
    return response;
  } catch (error) {
    console.error("Error deleting email template:", error);
    throw error;
  }
};

export const sendTestEmail = async (templateName, email, variables = {}) => {
  try {
    // Ensure common variables are included for testing
    const defaultVariables = {
      userEmail: email,
      email: email,
      userName: "Test User",
      appName: "Scan Me Maybe",
      currentYear: new Date().getFullYear(),
      resetToken: "sample-reset-token-123",
      editProfileUrl: `/profile/edit/${encodeURIComponent(email)}`,
      checkoutUrl: `/checkout/${encodeURIComponent(email)}`,
      resetPasswordUrl: `/auth/reset-password/${encodeURIComponent(email)}`,
      ...variables, // User-provided variables override defaults
    };

    const response = await POST(
      `${endpoints.admin.EMAIL_TEMPLATE_TEST}/${templateName}/test`,
      {
        email,
        variables: defaultVariables,
      },
    );
    return response;
  } catch (error) {
    console.error("Error sending test email:", error);
    throw error;
  }
};

export const previewEmailTemplate = async (templateName, variables = {}) => {
  try {
    // Ensure common variables are included for preview
    const defaultVariables = {
      userEmail: "user@example.com",
      email: "user@example.com",
      userName: "John Doe",
      appName: "Scan Me Maybe",
      currentYear: new Date().getFullYear(),
      resetToken: "sample-reset-token-123",
      editProfileUrl: "/profile/edit/user@example.com",
      checkoutUrl: "/checkout/user@example.com",
      resetPasswordUrl:
        "/auth/set-password?email=user@example.com&token=sample-reset-token-123",
      ...variables, // User-provided variables override defaults
    };

    const response = await POST(
      `${endpoints.admin.EMAIL_TEMPLATE_PREVIEW}/${templateName}/preview`,
      {
        variables: defaultVariables,
      },
    );
    return response;
  } catch (error) {
    console.error("Error previewing email template:", error);
    throw error;
  }
};

export const duplicateEmailTemplate = async (
  sourceTemplateName,
  newTemplateName,
) => {
  try {
    const response = await POST(endpoints.admin.EMAIL_TEMPLATE_DUPLICATE, {
      sourceTemplateName,
      newTemplateName,
    });
    return response;
  } catch (error) {
    console.error("Error duplicating email template:", error);
    throw error;
  }
};

export const getEmailVariables = async () => {
  try {
    const response = await GET(endpoints.admin.EMAIL_TEMPLATE_VARIABLES);
    return response;
  } catch (error) {
    console.error("Error fetching email variables:", error);
    throw error;
  }
};

// ===================================
// Dashboard Stats
// ===================================
export const getDashboardStats = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await GET(
      `/api/admin/dashboard${queryParams ? `?${queryParams}` : ""}`,
    );
    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// ===================================
// User Management
// ===================================
export const getUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    }).toString();
    const response = await GET(`/api/admin/users?${queryParams}`);
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await PUT(`/api/admin/users/${userId}/approve`);
    return response;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error;
  }
};

export const rejectUser = async (userId, reason) => {
  try {
    const response = await PUT(`/api/admin/users/${userId}/reject`, { reason });
    return response;
  } catch (error) {
    console.error("Error rejecting user:", error);
    throw error;
  }
};

// ===================================
// QR Card Management
// ===================================
export const getQRCards = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    }).toString();
    const response = await GET(`/api/admin/qr-cards?${queryParams}`);
    return response;
  } catch (error) {
    console.error("Error fetching QR cards:", error);
    throw error;
  }
};

// Export as adminAPI object for easier imports
export const adminAPI = {
  // Profile
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,

  // Email Templates
  getEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  sendTestEmail,
  previewEmailTemplate,
  duplicateEmailTemplate,
  getEmailVariables,

  // Dashboard
  getDashboardStats,

  // Users
  getUsers,
  approveUser,
  rejectUser,

  // QR Cards
  getQRCards,
};

export default adminAPI;
