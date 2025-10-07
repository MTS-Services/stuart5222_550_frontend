// auth/AuthContext.js
import { createContext, useContext } from 'react';

// 1. Creating AuthContext
// This Context allows any component in the application to access authentication status.
export const AuthContext = createContext(null);

// This provides a simple way to consume AuthContext.
export const useAuth = () => {
  return useContext(AuthContext);
};
