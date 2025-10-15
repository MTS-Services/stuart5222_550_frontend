import React, { lazy } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

// Guards
import PrivateGuard from './guards/PrivateGuard';
import PublicGuard from './guards/PublicGuard';
import AuthGuard from './guards/AuthGuard';
import AuthLayout from '../layout/auth/authLayout';

// Layouts
const AdminLayout = lazy(() => import('../layout/admin/AdminLayout'));
const MainLayout = lazy(() => import('../layout/main/MainLayout'));
const ErrorView = lazy(() => import('../page/public/error/ErrorView'));

// 🔓 Public Pages
const HomeView = lazy(() => import('../page/public/home/HomeView'));
const LetsConnectView = lazy(() =>
  import('../page/public/connect/ConnectView')
);
const LoginView = lazy(() => import('../page/auth/login/LoginView'));

// 🔒 Private Pages
const AdminView = lazy(() => import('../page/private/admin/AdminView'));
const UserManageView = lazy(() =>
  import('../page/private/userManagements/UserManageView')
);
const UserEdit = lazy(() => import('../page/private/userEdit/UserEdit'));
const Settings = lazy(() => import('../page/private/settings/Settings'));
const Notification = lazy(() =>
  import('../page/private/notification/Notification')
);

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 🔓 Public Routes */}
      <Route element={<PublicGuard />}>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomeView />} />
          <Route path='connect' element={<LetsConnectView />} />
        </Route>
      </Route>

      {/* 🛂 Auth Routes */}
      <Route element={<AuthGuard />}>
        <Route path='/auth' element={<AuthLayout />}>
          <Route index path='login' element={<LoginView />} />
        </Route>
      </Route>

      {/* 🔒 Private Routes */}
      <Route element={<PrivateGuard />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<AdminView />} />
          <Route path='user-management' element={<UserManageView />} />
          <Route path='user-edit' element={<UserEdit />} />
          <Route path='settings' element={<Settings />} />
          <Route path='notifications' element={<Notification />} />
        </Route>
      </Route>

      {/* ⚠️ 404 */}
      <Route path='*' element={<ErrorView />} />
    </>
  )
);
