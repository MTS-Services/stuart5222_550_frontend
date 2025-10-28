import React, { lazy } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Guards
import PrivateGuard from './guards/PrivateGuard';
import PublicGuard from './guards/PublicGuard';
import AuthGuard from './guards/AuthGuard';

const AllQRCodes = lazy(() => import('../page/private/QR/AllQRCodes.jsx'));
// Layouts
const AuthLayout = lazy(() => import('../layout/auth/AuthLayout.jsx'));
const AdminLayout = lazy(() => import('../layout/admin/AdminLayout.jsx'));
const MainLayout = lazy(() => import('../layout/main/MainLayout.jsx'));

// 🔓 Public Pages
const ErrorView = lazy(() => import('../page/public/error/ErrorView.jsx'));
const HomeView = lazy(() => import('../page/public/home/HomeView.jsx'));
const LetsConnectView = lazy(() =>
  import('../page/public/connect/ConnectView.jsx')
);
const GalleryView = lazy(() =>
  import('../page/public/gallery/GalleryView.jsx')
);
const WelcomeScanView = lazy(() =>
  import('../page/public/welcomeScan/WelcomeScanView.jsx')
);

// 🛂 Auth Pages
const CheckoutView = lazy(() =>
  import('../page/auth/checkout/CheckoutView.jsx')
);
const LoginView = lazy(() => import('../page/auth/login/LoginView.jsx'));

// 🔒 Private Pages
const AdminView = lazy(() => import('../page/private/admin/AdminView.jsx'));
const UserManageView = lazy(() =>
  import('../page/private/userManagements/UserManageView.jsx')
);
const UserEditView = lazy(() =>
  import('../page/private/userEdit/UserEditView.jsx')
);
const SettingsView = lazy(() =>
  import('../page/private/settings/SettingsView.jsx')
);
const NotificationView = lazy(() =>
  import('../page/private/notification/Notification.jsx')
);
const SetupProfileView = lazy(() =>
  import('../page/auth/setup-profile/SetupProfileView.jsx')
);

const UserView = lazy(() => import('../page/public/profile/UserView.jsx'));
const EditDetailsView = lazy(() =>
  import('../page/private/userEdit/EditDetailsView.jsx')
);
const UserDetailsView = lazy(() =>
  import('../page/private/userManagements/UserDetailsView.jsx')
);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 🔓 Public Routes */}
      <Route element={<PublicGuard />}>
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomeView />} />

          <Route path='welcome/:id' element={<WelcomeScanView />} />
          <Route path='user-profile' element={<UserView />} />
          <Route path='user-profile/gallery' element={<GalleryView />} />
          <Route path='user-profile/connect' element={<LetsConnectView />} />
          <Route
            path='checkout/:user_email'
            element={
              <Elements stripe={stripePromise}>
                <CheckoutView />
              </Elements>
            }
          />
          <Route path='checkout/setup-profile' element={<SetupProfileView />} />
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
          <Route path='user-edit/:id' element={<EditDetailsView />} />
          <Route path='user-edit/qr-code/:email' element={<AllQRCodes />} />
          <Route path='settings' element={<SettingsView />} />
        </Route>
      </Route>

      {/* ⚠️ 404 */}
      <Route path='*' element={<ErrorView />} />
    </>
  )
);

export default router;
