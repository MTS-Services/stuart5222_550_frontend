import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicGuard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? <Navigate to='/admin' /> : <Outlet />;
};

export default PublicGuard;
