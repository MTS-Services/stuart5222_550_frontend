import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loading } from "../../components/ui/loading";
import { AuthContext } from "./../../features/auth/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  if (!isAdmin && !user.canAccessServices) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

const PrivateAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role?.toUpperCase() === "ADMIN";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export { PrivateRoute, PrivateAdminRoute };
