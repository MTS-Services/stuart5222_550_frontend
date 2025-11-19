import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AUTH_COOKIE } from "../../../utils/authCookie";

const RoleGuard = ({ allowedRoles }) => {
  const {
    isAuthenticated,
    user: reduxUser,
    loading,
  } = useSelector((state) => state.auth);

  if (loading) return null; // or a spinner skeleton

  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Try to get user from Redux first, then fallback to cookie
  let user = reduxUser;

  if (!user) {
    user = AUTH_COOKIE.getUser();
  }

  return allowedRoles.includes(user?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default RoleGuard;
