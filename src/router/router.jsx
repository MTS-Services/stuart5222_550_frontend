import { createBrowserRouter } from "react-router";
import { MainLayout } from "./../layout/main/MainLayout";
import { HomeView } from "./../page/public/home/HomeView";
import { AdminDashboardLayout } from "../layout/admin/AdminDashboardLayout";
import { UserManagement } from "../page/private/admin/components/userManagements/UserManagement";
import { UserEdit } from "./../page/private/admin/components/userEdit/UserEdit";
import { UserManagementLayout } from "./../page/private/user/UserManagementLayout";
import { AdminDashboard } from "../page/private/admin/components/dashboard/AdminDashboard";
import { UserDetailsPage } from "../page/private/admin/components/userManagements/components/UserDetailsPage";
import { EditResponse } from "../page/private/admin/components/userEdit/components/EditResponse";
import { Notification } from "../page/private/admin/components/userManagements/notification/Notification";
import { UserDetails } from "../page/private/admin/components/userManagements/userDetails/UserDetails";
import { WelcomeScanView } from "../page/public/welcomeScan/WelcomeScanView";
import { CherylAnnView } from "../page/public/cherylAnn/CherylAnnView";
import { SeeMorePhone } from "../page/public/Seemorephotos/SeeMorePhone";
import { LetsConnect } from "../page/public/connect/LetsConnect";
import { Oops } from "../page/public/ops/Oops";
import { SignUpPick } from "../page/public/signUpPick/SignUpPick";
import { AdminLogin } from "../page/private/adminLogin/AdminLogin";

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
        path: "/welcome-scan",
        element: <WelcomeScanView />,
      },
      {
        path: "/cheryl-ann-view",
        element: <CherylAnnView />,
      },
      {
        path: "/sign-up-pick",
        element: <SignUpPick />,
      },
      {
        path: "/oops-sorry",
        element: <Oops />,
      },
    ],
  },
  {
    path: "/see-more-phone",
    element: <SeeMorePhone />,
  },
  {
    path: "/lets-connect",
    element: <LetsConnect />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
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
        path: "user-details/:id",
        element: <UserDetailsPage />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/profiles/${params.id}`),
      },
      {
        path: "edit-response/:id",
        element: <EditResponse />,
        loader: ({ params }) =>
          fetch(`http://localhost:5000/profiles/${params.id}`),
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
