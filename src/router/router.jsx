import React, { lazy } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

// Guards
import PrivateRoute from './guards/PrivateRoute';
import PublicRoute from './guards/PublicRoute';

// Layouts
const AdminLayout = lazy(() => import('../layout/admin/AdminLayout'));
const MainLayout = lazy(() => import('../layout/main/MainLayout'));
const ErrorView = lazy(() => import('../page/public/error/ErrorView'));

// 🔓 Public Pages
const HomeView = lazy(() => import('../page/public/home/HomeView'));
const LetsConnectView = lazy(() =>
  import('../page/public/connect/ConnectView')
);

// 🔒 Private Pages
const AdminView = lazy(() => import('../page/private/admin/AdminView'));
const UserManageView = lazy(() =>
  import('../page/private/userManagements/UserManageView')
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 🔓 Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomeView />} />
          <Route path='connect' element={<LetsConnectView />} />
        </Route>
      </Route>

      {/* 🔒 Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminView />} />
          <Route path='user-management' element={<UserManageView />} />
        </Route>
      </Route>

      {/* ⚠️ 404 */}
      <Route path='*' element={<ErrorView />} />
    </>
  )
);
