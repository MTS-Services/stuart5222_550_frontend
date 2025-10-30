import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useDispatch } from "react-redux";

import {
  getAdminNotifications,
  getUnreadNotificationsCount,
} from "../../features/admin/notifications/notificationsFetch";
import { fetchAdminSettingsProfile } from "../../features/admin/home/dashboardFetch";

/* ---------------- MAIN LAYOUT ---------------- */
const AdminLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAdminNotifications({ page: 0, limit: 20 }));
    dispatch(fetchAdminSettingsProfile());
    dispatch(getUnreadNotificationsCount());
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-50 font-raleway">
      {/* Sidebar */}
      <div className="hidden w-64 lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <AdminSidebar />
      </div>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
