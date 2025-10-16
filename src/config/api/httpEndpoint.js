export const endpoints = {
  auth: {
    LOGIN: '/auth/admin/login',
    REGISTER: '/auth/register',
  },
  admin: {
    GET_ALL_USERS: '/admin/users/pending',
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
