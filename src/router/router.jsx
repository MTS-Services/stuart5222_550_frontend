import React, { lazy } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Guards
import PublicGuard from "./guards/new/PublicGuard.jsx";
import RoleGuard from "./guards/new/RoleGuard.jsx";

// Layouts
const AuthLayout = lazy(() => import("../layout/auth/AuthLayout.jsx"));
const AdminLayout = lazy(() => import("../layout/admin/AdminLayout.jsx"));
const MainLayout = lazy(() => import("../layout/main/MainLayout.jsx"));
const ErrorBoundary = lazy(() => import("../components/ErrorBoundary.jsx"));

// 🔓 Public Pages
const ErrorView = lazy(() => import("../page/public/error/ErrorView.jsx"));
const HomeView = lazy(() => import("../page/public/home/HomeView.jsx"));

const LetsConnectView = lazy(
  () => import("../page/public/connect/ConnectView.jsx"),
);
const GalleryView = lazy(
  () => import("../page/public/gallery/GalleryView.jsx"),
);
const WelcomeScanView = lazy(
  () => import("../page/public/welcomeScan/WelcomeScanView.jsx"),
);

// 🛂 Auth Pages
const LoginView = lazy(() => import("../page/auth/login/LoginView.jsx"));
const ForgotPassword = lazy(() => import("../page/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../page/auth/ResetPassword.jsx"));

const UserView = lazy(() => import("../page/public/profile/UserView.jsx"));

// 🔒 Private Pages
const AdminView = lazy(() => import("../page/private/admin/AdminView.jsx"));
const AddUserView = lazy(
  () => import("../page/private/allUsers/AddUserView.jsx"),
);
const EmailTemplatesPage = lazy(() => import("../page/EmailTemplatesPage.jsx"));
// const AllQRCodes = lazy(() => import("../page/private/QR/AllQRCodes.jsx"));
const AllUsersView = lazy(
  () => import("../page/private/allUsers/AllUsersView.jsx"),
);
const UserManageView = lazy(
  () => import("../page/private/userManagements/UserManageView.jsx"),
);
const UserEditView = lazy(
  () => import("../page/private/userEdit/UserEditView.jsx"),
);
const SettingsView = lazy(
  () => import("../page/private/settings/SettingsView.jsx"),
);
const NotificationView = lazy(
  () => import("../page/private/notification/Notification.jsx"),
);
const EditDetailsView = lazy(
  () => import("../page/private/userEdit/EditDetailsView.jsx"),
);
const UserDetailsView = lazy(
  () => import("../page/private/userManagements/UserDetailsView.jsx"),
);

// 🙋 User Pages
const UserHomeView = lazy(
  () => import("../page/private/PROFILE/UserHomeView.jsx"),
);
const UserProfileView = lazy(
  () => import("../page/private/PROFILE/UserProfileView.jsx"),
);
const SetupProfileView = lazy(
  () => import("../page/private/PROFILE/setup-profile/SetupProfileView.jsx"),
);
const EditProfileView = lazy(
  () => import("../page/private/PROFILE/setup-profile/EditProfileView.jsx"),
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* 🔓 Public - Only logged-out users can access */}
      <Route element={<PublicGuard />}>
        <Route element={<MainLayout />} errorElement={<ErrorBoundary />}>
          {/* Public pages */}
          <Route index element={<HomeView />} />
          <Route path="welcome-scan/:id" element={<WelcomeScanView />} />
          <Route path="user/:email/profile" element={<UserView />} />
          <Route path="user/:email/gallery" element={<GalleryView />} />
          <Route
            path="user/:email/lets-connect"
            element={<LetsConnectView />}
          />
          {/* Auth pages */}
          <Route path="auth/login" element={<LoginView />} />
          <Route path="auth/forgot-password" element={<ForgotPassword />} />
          <Route path="auth/reset/:user_email" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* 👑 Admin-only */}
      <Route element={<RoleGuard allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminView />} />
          <Route path="all-users" element={<AllUsersView />} />
          <Route path="all-users/add" element={<AddUserView />} />
          <Route path="user-management" element={<UserManageView />} />
          <Route path="user-management/:userId" element={<UserDetailsView />} />
          <Route path="user-edit" element={<UserEditView />} />
          <Route path="user-edit/:userId" element={<EditDetailsView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="notifications" element={<NotificationView />} />
          <Route path="email-templates" element={<EmailTemplatesPage />} />
          <Route
            path="user-edit/details/:userId"
            element={<EditDetailsView />}
          />
        </Route>
      </Route>

      {/* 🙋 User-only */}
      <Route element={<RoleGuard allowedRoles={["user"]} />}>
        <Route path="/user" element={<UserHomeView />} />
        <Route path="/user/profile" element={<UserProfileView />} />
        <Route
          path="/user/setup-profile/:email"
          element={<SetupProfileView />}
        />
        <Route path="/user/edit-profile/:email" element={<EditProfileView />} />
      </Route>

      {/* ⚠️ 404 Fallback */}
      <Route path="*" element={<ErrorView />} />
    </>,
  ),
);

export default router;
