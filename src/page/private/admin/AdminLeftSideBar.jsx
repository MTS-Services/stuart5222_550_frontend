import { useState } from "react";
import { CgDice4 } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FiMenu, FiUsers, FiX } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";

const navLinksData = [
  {
    name: "Dashboard",
    icon: <CgDice4 />,
    path: "/admin/dashboard",
  },
  {
    name: "User management",
    icon: <FaUsers />,
    path: "/admin/admin-user-management",
  },
  {
    name: "User Edit",
    icon: <FaUsers />,
    path: "/admin/user-edit",
  },
];

export const AdminLeftSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Mobile Top Bar */}
      <div className="fixed z-50 flex w-full items-center justify-between bg-[#f5ceb5] px-4 py-3 text-white lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <FiMenu className="h-7 w-7" />
        </button>
        <a href="/">
          <img
            src="/img/page/home/remove_preview.png"
            alt="Logo"
            className="w-10 h-10"
          />
        </a>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform bg-[#FFFCFA] text-gray-950 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="items-center border-b border-gray-700 p-4 lg:justify-center">
          <a href="/">
            <img
              src="/img/page/home/remove_preview.png"
              alt="Logo"
              className="w-[80px] h-[56px] bg-cover object-cover p-2"
            />
          </a>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white lg:hidden"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col">
          {navLinksData.map((link) => (
            <a
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsOpen(false);
              }}
              className={`relative flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-base font-normal Export CSVExport CSV capitalize transition-colors duration-200 ${
                isActive(link.path)
                  ? "text-[#000044] font-semibold bg-white"
                  : "text-[#002244] hover:text-[#002244] font-medium"
              }`}
            >
              {/* Left bar for active */}
              {isActive(link.path) && (
                <div className="absolute top-2 left-0 h-10 w-1 rounded-tr-sm rounded-br-sm bg-[#F07400]" />
              )}

              {/* Icon bubble */}
              <span
                className={`rounded-lg p-2 transition-colors duration-200 w-6 h-6 ${
                  isActive(link.path)
                    ? "text-[#000044] font-semibold w-6 h-6"
                    : "text-[#002244] hover:text-[#002244] font-medium w-6 h-6"
                }`}
              >
                {link.icon}
                {/* <FaUsers className="w-6 h-6" /> */}
              </span>

              {/* Label */}
              <span className="whitespace-nowrap">{link.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
