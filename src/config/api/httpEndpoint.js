export const endpoints = {
  auth: {
    LOGIN: "/auth/admin/login",
    REGISTER: "/auth/register",
    PAYMENT_INTENT: "/payment/create-one-time-payment",
    PAYMENT_SUBSCRIPTION: "/payment/create-subscription",
    FORGOT_PASSWORD: "/auth/admin/forgot-password",
    RESET_PASSWORD: "/auth/admin/reset-password",
  },
  admin: {
    HOME_DATA: "/admin/dashboard",
    GET_ALL_USERS: "/admin/users/all",
    GET_WAITLIST: "/admin/users/waitlist",
    APPROVED_WAITLIST_USERS: `/admin/users/approve`,
    GET_PENDING_USERS: "/admin/users/pending",

    APPROVE_LIST: `/admin/profiles/approved`,
    DRAFTS_LIST: "/admin/profiles/draft",

    ALL_PROFILES: "/admin/profiles/all",
    APPROVED_DRAFT: "/admin/profiles",
    REJECTED_DRAFT: "/admin/profiles",

    GET_USER_DETAILS: `/admin/profiles`,
    GET_USER_VERIFIED_PROFILE: `/admin/profiles/verified`,

    REJECT_USER: `/admin/users/reject`,

    GET_ADMIN_PROFILE: "/admin/profile",
    UPDATE_ADMIN_PROFILE: "/admin/profile",
    UPDATE_ADMIN_PASSWORD: "/admin/profile/update-password",

    GET_NOTIFICATIONS: "/admin/notifications",
    GET_UNREAD_COUNT: "/admin/notifications/unread-count",
    GET_USER_QR_CODE: "/qr-cards/by-email",

    // Mail Templates Endpoints
    GET_MAIL_TEMPLATES_ALL: "/admin/templates",

    UPDATE_MAIL_TEMPLATE_APPROVED: "/admin/templates/registration_approved",
    UPDATE_MAIL_TEMPLATE_REJECTED: "/admin/templates/registration_rejected",
    UPDATE_MAIL_TEMPLATE_APPROVED: "/admin/templates/registration_approved",
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
    QR_CODE: (qr_code) => `/qr-cards/scan/${qr_code}`,
    FETCH_PROFILE: (userMail) => `/profile/${userMail}`,
  },
  subscription: {
    GET_ALL: "/subscriptions",
    CREATE: "/subscriptions/create",
  },
};
