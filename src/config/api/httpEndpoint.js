export const endpoints = {
  auth: {
    LOGIN: '/auth/admin/login',
    REGISTER: '/auth/register',
    PAYMENT: '/payment/simple-payment',
  },
  admin: {
    HOME_DATA: '/admin/dashboard',
    GET_ALL_USERS: '/admin/users/all',
    GET_WAITLIST: '/admin/users/waitlist',
    GET_PENDING_USERS: '/admin/users/pending',
    APPROVE_USER: `/admin/users/approve`,
    REJECT_USER: `/admin/users/reject`,
    GET_USER_VERIFIED_PROFILE: `/admin/profiles/verified`,

    GET_USER_DETAILS: `/admin/users`,
    GET_PROFILE: '/admin/profile',
    UPDATE_PROFILE: '/admin/profile/update',
    UPDATE_PASSWORD: '/admin/profile/update-password',

    GET_NOTIFICATIONS: '/admin/notifications',
    GET_UNREAD_COUNT: '/admin/notifications/unread-count',
  },
  user: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    WAITLIST: '/auth/register',
    PROFILE: '/profile',
    SETTINGS: '/user/settings',
    QR_CODE: (qr_code) => `/qr-cards/scan/${qr_code}`,
  },
  subscription: {
    GET_ALL: '/subscriptions',
    CREATE: '/subscriptions/create',
  },
};
