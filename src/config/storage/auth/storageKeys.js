// src/config/storage/auth/storageKeys.js

// Optional: prefix for safety if multiple apps share a domain
const APP_PREFIX = 'app_';

export const storageKeys = {
  USER: `${APP_PREFIX}user`,
  TOKEN: `${APP_PREFIX}token`,
  WAITLIST: `${APP_PREFIX}waitlist`,
};
