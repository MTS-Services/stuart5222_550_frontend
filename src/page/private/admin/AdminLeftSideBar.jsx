import { useState } from "react";
import { CgDice4 } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const navLinksData = [
  { name: "Dashboard", icon: <CgDice4 />, path: "/admin/dashboard" },
  { name: "User management", icon: <FaUsers />, path: "/admin/admin-user-management" },
  { name: "User Edit", icon: <FaUsers />, path: "/admin/user-edit" },
];

export const AdminLeftSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Mobile Top Bar */}
      <div className="fixed z-50 flex w-full items-center justify-between bg-white px-4 py-3 shadow lg:hidden">
        <a href="/">
          <img
            src="/img/page/home/remove_preview.png"
            alt="Logo"
            className="w-10 h-10 object-cover"
          />
        </a>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-950 p-1">
          {isOpen ? <FiX className="h-7 w-7" /> : <FiMenu className="h-7 w-7" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform bg-[#FFFCFA] text-gray-950 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b bg-white border-gray-200 p-4">
          <a href="/">
            <img
              src="/img/page/home/remove_preview.png"
              alt="Logo"
              className="w-[80px] h-[56px] object-cover"
            />
          </a>
          {/* <button onClick={() => setIsOpen(false)} className="text-gray-950 lg:hidden p-1">
            <FiX className="h-6 w-6" />
          </button> */}
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col mt-4">
          {navLinksData.map((link) => (
            <a
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg relative cursor-pointer transition-colors duration-200 ${
                isActive(link.path)
                  ? "bg-white font-semibold text-[#000044]"
                  : "text-gray-700 hover:text-[#000044] font-medium"
              }`}
            >
              {/* Active bar */}
              {isActive(link.path) && (
                <div className="absolute left-0 top-0 h-full w-1 bg-[#F07400] rounded-tr-sm rounded-br-sm" />
              )}

              {/* Icon */}
              <span className="w-6 h-6 flex items-center justify-center text-inherit">
                {link.icon}
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
