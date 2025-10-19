export const endpoints = {
  auth: {
    LOGIN: '/auth/admin/login',
    REGISTER: '/auth/register',
  },
  admin: {
    HOME_DATA: '/admin/dashboard',
    GET_ALL_USERS: '/admin/users/all',
    GET_PENDING_USERS: '/admin/users/pending',
    APPROVE_USER: `/admin/users/approve`,
    REJECT_USER: `/admin/users/reject`,
    USER_PROFILE: `/admin/profiles/verified`,
  },
  user: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    WAITLIST: '/auth/register',
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    QR_CODE: (qr_code) => `/qr-cards/scan/${qr_code}`,
  },
  subscription: {
    GET_ALL: '/subscriptions',
    CREATE: '/subscriptions/create',
  },
};
