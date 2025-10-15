import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const isAuth = true;
  return isAuth ? <Navigate to='/admin' /> : <Outlet />;
};

export default PublicRoute;
