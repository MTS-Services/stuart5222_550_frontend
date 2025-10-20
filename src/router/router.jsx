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
import UserDetailsView from '../page/private/userDetails/UserDetailsView';

const UserDetails = lazy(() => import('../page/private/userDetails/UserDetails'));

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
const UserEditView = lazy(() => import('../page/private/userEdit/UserEdit'));
const SettingsView = lazy(() =>
  import('../page/private/settings/SettingsView')
);
const NotificationView = lazy(() =>
  import('../page/private/notification/Notification.jsx')
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
          <Route path='user-management/:id' element={<UserDetailsView />} />
          <Route path='notifications' element={<NotificationView />} />
          <Route path='user-edit' element={<UserEditView />} />
          <Route path='profile-details/:profileId' element={<UserDetails />} />
          <Route path='settings' element={<SettingsView />} />
        </Route>
      </Route>

      {/* ⚠️ 404 */}
      <Route path='*' element={<ErrorView />} />
    </>
  )
);
