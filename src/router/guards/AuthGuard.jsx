import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthGuard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to='/admin' /> : <Outlet />;
};

export default AuthGuard;
