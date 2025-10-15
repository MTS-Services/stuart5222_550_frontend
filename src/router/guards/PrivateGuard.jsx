import { Navigate, Outlet } from 'react-router-dom';

const PrivateGuard = () => {
  const isAuth = false; // replace with selector from Redux
  return isAuth ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateGuard;
