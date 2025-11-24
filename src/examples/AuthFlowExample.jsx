// Example: How to implement proper role-based authentication
// File: src/examples/AuthFlowExample.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLoginUser, userLoginUser } from "../features/auth/authFetch";
import { logout } from "../features/auth/authSlice";
import { handlePostLoginRedirect, getCurrentUserRole } from "../utils/authFlow";
import { AUTH_COOKIE } from "../utils/authCookie";

const AuthFlowExample = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [debugInfo, setDebugInfo] = useState(null);

  // ✅ CORRECT: Proper login with role-based redirect
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Try user login first, then admin if it fails
      let loginResult;
      try {
        loginResult = await dispatch(userLoginUser(credentials)).unwrap();
      } catch (userError) {
        loginResult = await dispatch(adminLoginUser(credentials)).unwrap();
      }

      // Use helper to handle role-based redirect
      handlePostLoginRedirect(navigate, loginResult);

      // Update debug info
      setTimeout(() => {
        setDebugInfo({
          cookieUser: AUTH_COOKIE.getUser(),
          reduxUser: user,
          role: getCurrentUserRole(),
          timestamp: new Date().toISOString(),
        });
      }, 100); // Small delay to ensure state is updated
    } catch (error) {
      console.error("❌ Login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  // ✅ CORRECT: Proper logout
  const handleLogout = () => {
    dispatch(logout());
    setDebugInfo(null);
    navigate("/");
  };

  // ✅ CORRECT: Check authentication state
  const checkAuthState = () => {
    const authState = {
      reduxState: {
        user,
        isAuthenticated,
        loading,
      },
      cookieState: {
        user: AUTH_COOKIE.getUser(),
        token: !!AUTH_COOKIE.get(),
      },
      currentRole: getCurrentUserRole(),
    };

    setDebugInfo(authState);
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold">Authentication Flow Example</h2>
      {!isAuthenticated ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Login</h3>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full rounded-lg border p-3"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full rounded-lg border p-3"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 rounded bg-gray-100 p-4">
            <p className="font-semibold">Test Credentials:</p>
            <p>Admin: admin@yourapp.com / admin123</p>
            <p>User: user@example.com / SecurePassword123!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Logged In</h3>
          <div className="rounded bg-green-100 p-4">
            <p>Welcome, {user?.email || AUTH_COOKIE.getUser()?.email}!</p>
            <p>
              Role:{" "}
              <span className="font-semibold">{getCurrentUserRole()}</span>
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
            <button
              onClick={() =>
                navigate(getCurrentUserRole() === "admin" ? "/admin" : "/user")
              }
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={checkAuthState}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Check Auth State
        </button>
      </div>

      {debugInfo && (
        <div className="mt-6 rounded bg-gray-50 p-4">
          <h4 className="mb-2 font-semibold">Debug Information:</h4>
          <pre className="overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthFlowExample;
