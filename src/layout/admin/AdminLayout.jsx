import { use, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useDispatch } from "react-redux";

import {
  getAdminNotifications,
  getUnreadNotificationsCount,
} from "../../features/admin/notifications/notificationsFetch";
import { fetchAdminSettingsProfile } from "../../features/admin/home/dashboardFetch";
import { AUTH_COOKIE } from "../../utils/authCookie";
import { toast } from "react-toastify";

/* ---------------- MAIN LAYOUT ---------------- */
const AdminLayout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAdminNotifications({ page: 0, limit: 20 }));
    dispatch(fetchAdminSettingsProfile());
    dispatch(getUnreadNotificationsCount());
  }, [dispatch]);

  const user = AUTH_COOKIE.getUser();
  const userToken = AUTH_COOKIE.getToken();

  /* ---------------- SESSION EXPIRY HANDLER ---------------- */
  useEffect(() => {
    if (!user || !userToken) return; // skip if not logged in

    const timer = setTimeout(() => {
      // Set a message so we can display it AFTER reload
      localStorage.setItem(
        "logoutMessage",
        "Session expired. Please log in again.",
      );
      AUTH_COOKIE.remove(); // Remove cookies (logout)
      window.location.reload(); // Refresh AFTER clearing cookies
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, [user, userToken]);

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
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
