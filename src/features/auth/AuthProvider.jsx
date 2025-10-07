// src/providers/AuthProvider.jsx

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import instance from '../../utils/axiosInstance';
import { AuthContext } from './AuthContext';

const COOKIE_NAME = 'token';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get(COOKIE_NAME)
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===========code by shakil munshi=========
  // Set and clear tokens in cookies
  // ================================================
  const setToken = (token) => {
    Cookies.set(COOKIE_NAME, token, {
      expires: 7,
      secure: true,
      sameSite: 'Lax',
    });
  };

  const clearToken = () => {
    Cookies.remove(COOKIE_NAME);
  };

  // ===========code by shakil munshi=========
  // Fetch user data on component mount
  // ================================================
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        try {
          const res = await instance.get(`/users/${token}`);
          const currentUser = res.data;

          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            clearToken();
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          clearToken();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // ===========code by shakil munshi=========
  // User authentication functions
  // ================================================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await instance.get(
        `/users?email=${email}&password=${password}`
      );
      const userData = res.data[0];
      if (userData) {
        setToken(userData.id);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
        return { success: true, user: userData };
      } else {
        setLoading(false);
        return { success: false, message: 'Invalid email or password.' };
      }
    } catch (error) {
      setLoading(false);
      console.error('Login failed:', error);
      return { success: false, message: 'An error occurred during login.' };
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const registerUser = async (userData) => {
    setLoading(true);
    try {
      const existingUser = await instance.get(`/users?email=${userData.email}`);
      if (existingUser.data.length > 0) {
        setLoading(false);
        return {
          success: false,
          message: 'A user with this email already exists.',
        };
      }

      const res = await instance.post('/users', userData);
      setLoading(false);
      return { success: true, user: res.data };
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error);
      return {
        success: false,
        message: 'An error occurred during registration.',
      };
    }
  };

  // ===========code by shakil munshi=========
  // Password reset and OTP functions
  // ================================================
  const requestPasswordResetOTP = async (email) => {
    console.log(`Password reset OTP requested for: ${email}`);
    return {
      success: true,
      message: 'An OTP has been sent to your email.',
      otp: '123456',
    };
  };

  const verifyOTPForReset = async (email, otp) => {
    console.log(`Verifying OTP for ${email}: ${otp}`);
    if (otp === '123456') {
      return {
        success: true,
        message: 'OTP verified. You can now reset your password.',
      };
    } else {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const res = await instance.get(`/users?email=${email}`);
      const userToUpdate = res.data[0];
      if (!userToUpdate) {
        return { success: false, message: 'User not found.' };
      }
      const updatedUser = { ...userToUpdate, password: newPassword };
      await instance.put(`/users/${userToUpdate.id}`, updatedUser);
      return {
        success: true,
        message: 'Password has been reset successfully.',
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      return {
        success: false,
        message: 'An error occurred during password reset.',
      };
    }
  };

  const verifyRegistrationOTP = async (otp, token) => {
    console.log('Verifying registration OTP:', otp);
    return {
      success: true,
      message: 'Registration successful. You can now log in.',
    };
  };

  const resendOTP = async (email) => {
    console.log(`Resending OTP to: ${email}`);
    return { success: true, message: 'New OTP sent successfully!' };
  };

  const deleteAccount = async () => {
    try {
      if (user) {
        await instance.delete(`/users/${user.id}`);
        logout();
        return { success: true, message: 'Account deleted successfully.' };
      }
      return { success: false, message: 'No user is logged in.' };
    } catch (error) {
      console.error('Account deletion failed:', error);
      return { success: false, message: 'Failed to delete account.' };
    }
  };

  // ===========code by shakil munshi=========
  // Subscription functions (Trial and Paid)
  // ================================================
  const startTrial = async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return { success: false, message: 'No user is logged in.' };
    }
    const updatedUser = {
      ...user,
      isSubscribed: true,
      planType: 'trial',
      hasUsedTrial: true,
      subscriptionEndDate: new Date(Date.now() + 3 * 60 * 1000).toISOString(),
    };
    try {
      const res = await instance.put(`/users/${user.id}`, updatedUser);
      setUser(res.data);
      setLoading(false);
      return { success: true, user: res.data };
    } catch (error) {
      setLoading(false);
      console.error('Failed to start trial:', error);
      return { success: false, message: 'Failed to start trial.' };
    }
  };

  const subscribe = async (plan) => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return { success: false, message: 'No user is logged in.' };
    }
    const durationInDays = plan.id === 1 ? 30 : 365;
    const updatedUser = {
      ...user,
      isSubscribed: true,
      planType: plan.id === 1 ? 'monthly' : 'annual',
      subscriptionEndDate: new Date(
        Date.now() + durationInDays * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    try {
      const res = await instance.put(`/users/${user.id}`, updatedUser);
      setUser(res.data);
      setLoading(false);
      return { success: true, user: res.data };
    } catch (error) {
      setLoading(false);
      console.error('Failed to subscribe:', error);
      return { success: false, message: 'Subscription failed.' };
    }
  };

  // ===========code by shakil munshi=========
  // Value object for the context provider
  // ================================================
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    registerUser,
    requestPasswordResetOTP,
    verifyOTPForReset,
    resetPassword,
    verifyRegistrationOTP,
    resendOTP,
    deleteAccount,
    startTrial,
    subscribe,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
