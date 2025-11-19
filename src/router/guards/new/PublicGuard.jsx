import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicGuard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Outlet />;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "user") return <Navigate to="/user" replace />;

  return <Navigate to="/" replace />;
};

export default PublicGuard;
