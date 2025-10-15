import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const isAuth = true; // replace with selector from Redux
  return isAuth ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
