import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
// Path check: Assuming src/providers/AuthProvider.jsx needs to step up one level (..) to reach src/utils/axiosInstance.js
import { AuthContext, useAuth } from '../auth/AuthContext';
import instance from '../../utils/axiosInstance';

const COOKIE_NAME = 'token';

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get(COOKIE_NAME)
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper functions for token management
  const setToken = (token) => {
    // Setting user ID (token) in cookie for session management, synced with axiosInstance
    Cookies.set(COOKIE_NAME, token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
  };

  const clearToken = () => {
    Cookies.remove(COOKIE_NAME);
  };

  // Check if subscription is valid based on end date
  const isSubscribed = () => {
    if (!user || !user.subscriptionEndDate) return false;
    const now = new Date();
    const endDate = new Date(user.subscriptionEndDate);
    // User is subscribed if the current date is before the subscription end date
    return now < endDate;
  };

  // Fetch user details based on token (runs on mount)
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        try {
          // json-server: token is the user ID
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

  // Login function (GET with query params for json-server)
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Find user by email and password
      const res = await instance.get(
        `/users?email=${email}&password=${password}`
      );
      const userData = res.data[0]; // json-server returns an array

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

  // Register function (uses POST request)
  const registerUser = async (userData) => {
    setLoading(true);
    try {
      // 1. Check if user already exists
      const existingUser = await instance.get(`/users?email=${userData.email}`);
      if (existingUser.data.length > 0) {
        setLoading(false);
        return {
          success: false,
          message: 'A user with this email already exists.',
        };
      }

      // 2. Add default subscription status and initial data
      const newUser = {
        ...userData,
        // Default properties for new users
        isSubscribed: false,
        planType: 'free', // Set default plan to free
        subscriptionEndDate: null,
      };

      // 3. Post new user data (json-server automatically assigns ID)
      const res = await instance.post('/users', newUser);

      // Automatically log in the new user
      const loggedInUser = res.data;
      setToken(loggedInUser.id);
      setUser(loggedInUser);
      setIsAuthenticated(true);

      setLoading(false);
      return { success: true, user: loggedInUser };
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error);
      return {
        success: false,
        message: 'An error occurred during registration.',
      };
    }
  };

  // Subscription functions (Paid only)
  const subscribe = async (planDetails) => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return { success: false, message: 'No user is logged in.' };
    }

    let durationInDays;
    let planType;

    // Define plan logic (Removed 'trial' logic)
    if (planDetails.type === 'monthly') {
      durationInDays = 30;
      planType = 'monthly';
    } else if (planDetails.type === 'annual') {
      durationInDays = 365;
      planType = 'annual';
    } else {
      setLoading(false);
      return { success: false, message: 'Invalid plan type.' };
    }

    // Prepare updated user object
    const updatedUser = {
      ...user,
      isSubscribed: true,
      planType: planType,
      subscriptionEndDate: new Date(
        Date.now() + durationInDays * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    try {
      // Update user data on json-server
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

  // Value object for the context provider
  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    registerUser,
    subscribe,
    isSubscribed,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We only render children once the initial loading is complete */}
      {!loading && children}
      {/* Basic Loading Indicator */}
      {loading && (
        <div className='flex items-center justify-center h-screen bg-gray-900 text-white text-lg font-semibold'>
          <svg
            className='animate-spin h-6 w-6 mr-3 text-pink-500'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
          Authentication Loading...
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
