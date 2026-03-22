export const endpoints = {
  auth: {
    ADMIN_LOGIN: "/auth/admin/login",
    USER_LOGIN: "/auth/user/login",
    REGISTER: "/auth/register",
    PAYMENT_INTENT: "/payment/create-one-time-payment",
    PAYMENT_SUBSCRIPTION: "/payment/create-subscription",
    FORGOT_PASSWORD: "/auth/admin/forgot-password",
    RESET_PASSWORD: "/auth/admin/reset-password",
    SET_PASSWORD: "/auth/set-password",
  },
  admin: {
    HOME_DATA: "/admin/dashboard",
    GET_ALL_USERS: "/admin/users/all",
    GET_USER_LIST: "/admin/profiles/all",
    GET_WAITLIST: "/admin/users/waitlist",
    APPROVED_WAITLIST_USERS: `/admin/users/approve`,
    GET_PENDING_USERS: "/admin/users/pending",

    VARIFIED_LIST: `/admin/profiles/all`,
    DRAFTS_LIST: "/admin/profiles/draft",

    ALL_PROFILES: "/admin/profiles/all",
    APPROVED_DRAFT: "/admin/profiles",
    REJECTED_DRAFT: "/admin/profiles",
    TOGGLE_PROFILE_ACTIVE: "/admin/profiles",

    GET_USER_DETAILS: `/admin/profiles`,
    GET_USER_VERIFIED_PROFILE: `/admin/profiles/verified`,
    GET_USER_REJECTED_PROFILE: `/admin/profiles`,
    REJECT_USER: `/admin/users/reject`,

    GET_ADMIN_PROFILE: "/admin/profile",
    UPDATE_ADMIN_PROFILE: "/admin/profile",
    UPDATE_ADMIN_PASSWORD: "/admin/profile/update-password",

    GET_NOTIFICATIONS: "/admin/notifications",
    GET_UNREAD_COUNT: "/admin/notifications/unread-count",
    GET_USER_QR_CODE: "/qr-cards/by-email",

    // Email Templates Endpoints
    EMAIL_TEMPLATES: "/admin/templates",
    EMAIL_TEMPLATE_BY_NAME: "/admin/templates", // Use with /:name parameter
    EMAIL_TEMPLATE_TEST: "/admin/templates", // Use with /:name/test parameter
    EMAIL_TEMPLATE_PREVIEW: "/admin/templates", // Use with /:name/preview parameter
    EMAIL_TEMPLATE_DUPLICATE: "/admin/templates/duplicate",
    EMAIL_TEMPLATE_VARIABLES: "/admin/templates/variables",

    // Legacy Mail Templates Endpoints (kept for backward compatibility)
    GET_MAIL_TEMPLATES_ALL: "/admin/templates",
    UPDATE_MAIL_TEMPLATE_APPROVED: "/admin/templates/registration_approved",
    UPDATE_MAIL_TEMPLATE_REJECTED: "/admin/templates/registration_rejected",
    UPDATE_MAIL_TEMPLATE_DRAFT: "/admin/templates/draft_notification",

    // Dummy User Creation
    CREATE_DUMMY_USER: "/admin/users/create-dummy",
  },
  user: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    WAITLIST: "/auth/register",
    SETUP_PROFILE: "/profile",
    EDIT_PROFILE: "/profile",
    STATUS_CHANGE: "/profile/submit",
    SETTINGS: "/user/settings",
    USER_PROFILE: "/user/profile",
    QR_CODE: (qr_code) => `/qr-cards/scan/${qr_code}`,
    FETCH_PROFILE: (userMail) => `/profile/${userMail}`,
  },
  subscription: {
    GET_ALL: "/subscriptions",
    CREATE: "/subscriptions/create",
  },
};
