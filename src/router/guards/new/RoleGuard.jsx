import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleGuard = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return allowedRoles.includes(user?.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default RoleGuard;
