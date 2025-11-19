import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateGuard = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const content =
    isAuthenticated && user?.role === "user" ? (
      <Outlet />
    ) : (
      <Navigate to={`/user-profile/${user?.email}/profile`} />
    );
  return content;
};

export default PrivateGuard;
