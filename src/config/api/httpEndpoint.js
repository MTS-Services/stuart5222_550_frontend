export const endpoints = {
  auth: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  user: {
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
