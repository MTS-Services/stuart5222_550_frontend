import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CgDice4 } from "react-icons/cg";
import { FaPowerOff, FaRegBell, FaUsers, FaUsersCog } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { STORAGE } from "../../config/storage/auth/authStorage";

/* ---------------- NAV LINKS DATA ---------------- */
const navLinks = [
  { name: "Dashboard", icon: <CgDice4 size={18} />, path: "/admin" },
  {
    name: "User Management",
    icon: <FaUsers size={20} />,
    path: "/admin/user-management",
  },
  {
    name: "User Edit",
    icon: <FaUsersCog size={20} />,
    path: "/admin/user-edit",
  },
  { name: "Settings", icon: <FaGear size={20} />, path: "/admin/settings" },
];

/* ---------------- SIDEBAR LINK COMPONENT ---------------- */
const SidebarLink = ({ link, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-200 lg:py-4 ${
      active
        ? "bg-white font-semibold text-[#000044]"
        : "font-medium text-gray-700 hover:text-[#000044]"
    }`}
  >
    {active && (
      <div className="absolute left-0 top-0 h-full w-1 rounded-br-sm rounded-tr-sm bg-[#F07400]" />
    )}
    <span className="flex items-center justify-center">{link.icon}</span>
    <span className="whitespace-nowrap font-raleway">{link.name}</span>
  </button>
);

const AdminSidebar = () => {
  const { unreadCount } = useSelector((state) => state.notifications);

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    STORAGE.clearAll();
    window.location.href = "/auth/login";
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed z-50 flex w-full items-center justify-between bg-white p-2 lg:hidden">
        <a href="/">
          <img
            src="/img/assets/logo.png"
            alt="preview"
            className="h-14 w-20 object-cover"
          />
        </a>
        <div className="flex items-center gap-4">
          <div>
            <Link
              to="/admin/notifications"
              className="relative text-gray-600 transition-colors hover:text-orange-500"
            >
              <FaRegBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          </div>
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-gray-950"
            >
              {isOpen ? (
                <FiX className="h-7 w-7" />
              ) : (
                <FiMenu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform bg-[#FFFCFA] text-gray-950 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-2 lg:justify-center lg:p-3">
          <a href="/">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-14 w-20 object-cover"
            />
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.name}
              link={link}
              active={location.pathname === link.path}
              onClick={() => handleNavigate(link.path)}
            />
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="m-2 rounded-full bg-red-50 p-2.5 transition hover:bg-red-100 lg:hidden"
        >
          <FaPowerOff className="text-red-500" />
        </button>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
