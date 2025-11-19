import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicGuard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const content =
    isAuthenticated && user?.role === "admin" ? (
      <Navigate to="/admin" />
    ) : (
      <Outlet />
    );

  return content;
};

export default PublicGuard;
