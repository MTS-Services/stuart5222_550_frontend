// src/utils/authFlow.js
import { AUTH_COOKIE } from "./authCookie";

/**
 * Handle post-login redirect logic based on user role
 * This function should be called after successful login dispatch with unwrap()
 *
 * @param {Function} navigate - React Router navigate function
 * @param {Object} loginResult - Result from the login action (from unwrap())
 * @param {string} defaultRoute - Default route if no role-specific route
 */
export const handlePostLoginRedirect = (
  navigate,
  loginResult,
  defaultRoute = "/",
) => {
  try {
    console.log("🚀 handlePostLoginRedirect called with:", { loginResult });

    // First, try to get user from login result
    let user = loginResult?.user;

    // If not in result, try to get from cookie (should be set by now)
    if (!user) {
      user = AUTH_COOKIE.getUser();
      console.log("📝 Retrieved user from cookie:", user);
    }

    if (!user) {
      console.warn("⚠️ No user data found, redirecting to default route");
      navigate(defaultRoute);
      return;
    }

    // Role-based redirect logic
    const { role } = user;
    console.log("🔐 User role detected:", role);

    switch (role) {
      case "admin":
        console.log("➡️ Redirecting admin to /admin");
        navigate("/admin");
        break;
      case "user":
        console.log("➡️ Redirecting user to /user");
        navigate("/user");
        break;
      default:
        console.log(`➡️ Unknown role: ${role}, redirecting to ${defaultRoute}`);
        navigate(defaultRoute);
    }
  } catch (error) {
    console.error("❌ Error in handlePostLoginRedirect:", error);
    navigate(defaultRoute);
  }
};

/**
 * Get current user role from authentication state
 * Tries multiple sources to ensure data availability
 *
 * @returns {string|null} - User role or null if not found
 */
export const getCurrentUserRole = () => {
  try {
    const user = AUTH_COOKIE.getUser();
    return user?.role || null;
  } catch (error) {
    console.error("❌ Error getting current user role:", error);
    return null;
  }
};

/**
 * Check if user is authenticated and has specific role
 *
 * @param {string} requiredRole - Required role to check
 * @returns {boolean} - True if user has required role
 */
export const hasRequiredRole = (requiredRole) => {
  const userRole = getCurrentUserRole();
  return userRole === requiredRole;
};

/**
 * Get appropriate redirect path based on user role
 *
 * @param {string} defaultPath - Default path if no role match
 * @returns {string} - Redirect path
 */
export const getRedirectPath = (defaultPath = "/") => {
  const role = getCurrentUserRole();

  switch (role) {
    case "admin":
      return "/admin";
    case "user":
      return "/user";
    default:
      return defaultPath;
  }
};
