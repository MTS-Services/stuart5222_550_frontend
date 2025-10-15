import { Navigate, Outlet } from 'react-router-dom';

const PublicGuard = () => {
  const isAuth = false;
  return isAuth ? <Navigate to='/admin' /> : <Outlet />;
};

export default PublicGuard;
