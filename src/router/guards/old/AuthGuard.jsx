import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthGuard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const content =
    isAuthenticated && user?.role === "admin" ? (
      <Navigate to="/admin" />
    ) : (
      <Outlet />
    );

  return content;
};

export default AuthGuard;
