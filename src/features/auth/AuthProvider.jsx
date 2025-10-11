// import { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import instance from '../../utils/axiosInstance';
// import { AuthContext } from './AuthContext';

// const COOKIE_NAME = 'token';

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const setToken = (token) =>
//     Cookies.set(COOKIE_NAME, token, { expires: 7, sameSite: 'Lax' });
//   const clearToken = () => Cookies.remove(COOKIE_NAME);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = Cookies.get(COOKIE_NAME);
//       if (token) {
//         try {
//           const res = await instance.get(`/users/${token}`);
//           if (res.data.role !== 'ADMIN') {
//              throw new Error('User is not an Admin');
//           }
//           setUser(res.data);
//         } catch {
//           clearToken();
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, []);

//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       let userData;

//       if (email === 'amitbiswas.dev@gmail.com' && password === '000000') {
//         userData = { id: 'admin', email, role: 'ADMIN', canAccessServices: true };
//       } else {
//         const res = await instance.get(`/users?email=${email}&password=${password}`);
//         userData = res.data[0];
//         if (!userData) throw new Error('Invalid credentials');
//       }

//       if (userData.role !== 'ADMIN') {
//         setLoading(false);
//         return { 
//           success: false, 
//           message: 'Access Denied: Only administrators can log in here.' 
//         };
//       }

//       setUser(userData);
//       setToken(userData.id || 'special');
//       setLoading(false);
//       return { success: true, user: userData };
      
//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//       return { success: false, message: 'Invalid credentials. Please try again.' };
//     }
//   };

//   const logout = () => {
//     clearToken();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "./AuthContext";
import { getData } from './../../utils/axiosInstance';

const COOKIE_NAME = "token";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = (token) =>
    Cookies.set(COOKIE_NAME, token, { expires: 7, sameSite: "Lax" });
  const clearToken = () => Cookies.remove(COOKIE_NAME);

  // Keep user logged in after reload
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get(COOKIE_NAME);
      if (token) {
        try {
          const res = await getData("/adminLogin");
          const admins = res.adminLogin || res; // ensure we get the array
          const loggedInUser = admins.find((u) => u.email === token);
          if (!loggedInUser) throw new Error("Not an admin");
          setUser(loggedInUser);
        } catch {
          clearToken();
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await getData("/adminLogin");
      const admins = res.adminLogin || res; // get array

      const userData = admins.find(
        (u) => u.email === email && u.password === password
      );

      if (!userData) {
        setLoading(false);
        return { success: false, message: "Invalid email or password" };
      }

      setUser(userData);
      setToken(userData.email); // save email as token
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      console.error(err);
      setLoading(false);
      return { success: false, message: "Server error. Please try again." };
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
