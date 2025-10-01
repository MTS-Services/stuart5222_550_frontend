import { createBrowserRouter } from "react-router";
import { MainLayout } from './../layout/main/MainLayout';
import { HomeView } from './../page/public/home/HomeView';
import { SecondView } from './../page/public/second/SecondView';
import { AdminDashboardLayout } from "../page/private/admin/AdminDashboardLayout";
import { UserManagement } from "../page/private/admin/components/userManagements/UserManagement";
import { UserEdit } from './../page/private/admin/components/userEdit/UserEdit';
import { UserManagementLayout } from './../page/private/user/UserManagementLayout';
import { AdminDashboard } from "../page/private/admin/components/dashboard/AdminDashboard";

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
    ],
  },
  {
    path: "/admin",
    element: <AdminDashboardLayout />,
    children: [
      {
        path: "admin-user-management",
        element: <UserManagement />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "user-edit",
        element: <UserEdit />,
      },
    ],
  },
  {
    path: "/user",
    element: <UserManagementLayout />,
  },
]);
