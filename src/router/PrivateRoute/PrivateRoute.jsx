// src/router/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from '../../components/ui/loading';
import { AuthContext } from './../../features/auth/AuthContext';

// Normal user route
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  if (!user.canAccessServices) return <Navigate to="/" replace />;

  return children;
};

// Admin route
const PrivateAdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = user.role?.toUpperCase() === 'ADMIN';

  return isAdmin ? children : <Navigate to="/" replace />;
};

export { PrivateRoute, PrivateAdminRoute };
