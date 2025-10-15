import { Navigate, Outlet } from 'react-router-dom';

const AuthGuard = () => {
  const isAuth = false;
  return isAuth ? <Navigate to='/admin' /> : <Outlet />;
};

export default AuthGuard;
