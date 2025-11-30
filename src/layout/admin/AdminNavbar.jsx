import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AUTH_COOKIE } from "../../utils/authCookie";
import { useSelector, useDispatch } from "react-redux";
import { FaPowerOff, FaRegUser } from "react-icons/fa";
import { fetchAdminSettingsProfile } from "../../features/admin/home/dashboardFetch";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector((state) => state.notifications);
  const { profileSettings, loading } = useSelector((state) => state.dashboard);

  // Fetch admin profile on component mount
  useEffect(() => {
    dispatch(fetchAdminSettingsProfile());
  }, [dispatch]);

  const handleLogout = () => {
    AUTH_COOKIE.remove();
    window.location.href = "/auth/login";
  };

  // Get display name - prioritize firstName, fallback to username, then email
  const getDisplayName = () => {
    if (!profileSettings || Object.keys(profileSettings).length === 0) {
      return "Admin User";
    }

    const { firstName, lastName, username, email } = profileSettings;

    if (firstName && firstName.trim()) {
      return lastName && lastName.trim()
        ? `${firstName} ${lastName}`
        : firstName;
    }

    if (username && username.trim()) {
      return username;
    }

    if (email && email.trim()) {
      return email;
    }

    return "Admin User";
  };

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-end border-b border-gray-200 bg-white p-[22px]">
      <div className="flex items-center gap-4 px-10 sm:gap-5">
        {/* 🔔 Notification Icon with Badge */}
        {/* <Link
          to="/admin/notifications"
          className="relative text-gray-600 transition-colors hover:text-orange-500"
        >
          <FaRegBell size={18} />

          {unreadCount > 0 && (
            <span className="absolute -right-2 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link> */}

        {/* 👤 User Icon */}
        <Link
          to="/admin/settings"
          className="rounded-full bg-green-50 p-2.5 transition hover:bg-green-100"
        >
          <FaRegUser className="h-4 w-4 text-green-700" />
        </Link>

        {/* 🧑 User Info */}
        <div className="font-medium text-gray-800">
          <h2 className="font-raleway text-sm font-semibold leading-tight">
            {getDisplayName()}
          </h2>
          <p className="font-raleway text-xs text-gray-500">
            {profileSettings?.role && profileSettings.role.trim()
              ? profileSettings.role.charAt(0).toUpperCase() +
                profileSettings.role.slice(1)
              : "Administrator"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-full bg-red-50 p-2.5 transition hover:bg-red-100"
        >
          <FaPowerOff className="text-red-500" />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
