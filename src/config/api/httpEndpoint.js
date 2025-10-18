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
    GET_PROFILE: '/admin/profile',
    UPDATE_PROFILE: '/admin/profile',
    UPDATE_PASSWORD: '/admin/profile/password',
  },
  user: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    WAITLIST: '/auth/register',
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },
  subscription: {
    GET_ALL: '/subscriptions',
    CREATE: '/subscriptions/create',
  },
  check: {
    GET_CHECKS: '/checks',
    CREATE_CHECK: '/checks',
    GET_CHECK_BY_ID: (id) => `/checks/${id}`,
    UPDATE_CHECK: (id) => `/checks/${id}`,
    DELETE_CHECK: (id) => `/checks/${id}`,
  },
};
