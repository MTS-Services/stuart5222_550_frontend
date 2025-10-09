import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from './AuthContext';
import instance from '../../utils/axiosInstance';

const COOKIE_NAME = 'token';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = (token) =>
    Cookies.set(COOKIE_NAME, token, { expires: 7, sameSite: 'Lax' });
  const clearToken = () => Cookies.remove(COOKIE_NAME);

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        try {
          // json-server: token = userId
          const res = await instance.get(`/users/${token}`);
          setUser(res.data);
        } catch {
          clearToken();
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      let userData;

      // ✅ Hardcoded admin
      if (email === 'amitbiswas.dev@gmail.com' && password === '000000') {
        userData = { id: 'admin', email, role: 'ADMIN', canAccessServices: true };
      } else {
        const res = await instance.get(`/users?email=${email}&password=${password}`);
        userData = res.data[0];
        if (!userData) throw new Error('Invalid credentials');
      }

      setUser(userData);
      setToken(userData.id || 'special');
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      setLoading(false);
      return { success: false, message: 'Invalid credentials. Please try again.' };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
