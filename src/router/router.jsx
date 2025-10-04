import { createBrowserRouter } from "react-router";
import { MainLayout } from "./../layout/main/MainLayout";
import { HomeView } from "./../page/public/home/HomeView";
import { SecondView } from "./../page/public/second/SecondView";
import { AdminDashboardLayout } from "../page/private/admin/AdminDashboardLayout";
import { UserManagement } from "../page/private/admin/components/userManagements/UserManagement";
import { UserEdit } from "./../page/private/admin/components/userEdit/UserEdit";
import { UserManagementLayout } from "./../page/private/user/UserManagementLayout";
import { AdminDashboard } from "../page/private/admin/components/dashboard/AdminDashboard";
import { UserDetailsPage } from "../page/private/admin/components/userManagements/components/UserDetailsPage";
import { EditResponse } from "../page/private/admin/components/userEdit/components/EditResponse";
import { Notification } from "../page/private/admin/components/userManagements/notification/Notification";
import { UserDetails } from "../page/private/admin/components/userManagements/userDetails/UserDetails";
import { WelcomeScanView } from "../page/public/welcomeScan/WelcomeScanView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: "/",
        element: <HomeView />,
      },
      {
        path: "/secondView",
        element: <SecondView />,
      },
      {
        path: "/welcome-scan",
        element: <WelcomeScanView />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin-user-management",
        element: <UserManagement />,
      },
      {
        path: "user-edit",
        element: <UserEdit />,
      },
      {
        path: "user-details",
        element: <UserDetailsPage />,
      },
      {
        path: "edit-response",
        element: <EditResponse />,
      },
      {
        path: "notification",
        element: <Notification />,
      },
      {
        path: "notification-user-details",
        element: <UserDetails />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserManagementLayout />,
  },
]);
