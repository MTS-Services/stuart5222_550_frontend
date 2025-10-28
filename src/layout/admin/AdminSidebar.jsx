import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CgDice4 } from 'react-icons/cg';
import { FaPowerOff, FaRegBell, FaUsers, FaUsersCog } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { FiMenu, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { STORAGE } from '../../config/storage/auth/authStorage';

/* ---------------- NAV LINKS DATA ---------------- */
const navLinks = [
  { name: 'Dashboard', icon: <CgDice4 size={18} />, path: '/admin' },
  {
    name: 'User Management',
    icon: <FaUsers size={20} />,
    path: '/admin/user-management',
  },
  {
    name: 'User Edit',
    icon: <FaUsersCog size={20} />,
    path: '/admin/user-edit',
  },
  { name: 'Settings', icon: <FaGear size={20} />, path: '/admin/settings' },
];

/* ---------------- SIDEBAR LINK COMPONENT ---------------- */
const SidebarLink = ({ link, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2 lg:py-4  relative w-full text-left transition-colors duration-200 ${
      active
        ? 'bg-white font-semibold text-[#000044]'
        : 'text-gray-700 hover:text-[#000044] font-medium'
    }`}
  >
    {active && (
      <div className='absolute left-0 top-0 h-full w-1 bg-[#F07400] rounded-tr-sm rounded-br-sm' />
    )}
    <span className='flex items-center justify-center'>{link.icon}</span>
    <span className='whitespace-nowrap'>{link.name}</span>
  </button>
);

const AdminSidebar = () => {
  const { unreadCount } = useSelector((state) => state.notifications);

  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    STORAGE.clearAll();
    window.location.href = '/auth/login';
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <div className='fixed z-50 flex w-full items-center justify-between bg-white p-2  lg:hidden'>
        <a href='/'>
          <img
            src='/img/page/home/remove_preview.png'
            alt='Logo'
            className='w-15 h-15'
          />
        </a>
        <div className=' flex items-center gap-4'>
          <div>
            <Link
              to='/admin/notifications'
              className='relative text-gray-600 hover:text-orange-500 transition-colors'
            >
              <FaRegBell size={18} />
              {unreadCount > 0 && (
                <span className='absolute -top-2.5 -right-2 bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </div>
          <div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='text-gray-950 p-1'
            >
              {isOpen ? (
                <FiX className='h-7 w-7' />
              ) : (
                <FiMenu className='h-7 w-7' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 transform bg-[#FFFCFA] text-gray-950 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className='flex items-center justify-between border-b bg-white border-gray-200 p-2 lg:p-3 lg:justify-center'>
          <a href='/'>
            <img
              src='/img/page/home/remove_preview.png'
              alt='Logo'
              className='w-15 h-15 object-contain'
            />
          </a>
        </div>

        {/* Navigation */}
        <nav className='flex flex-col'>
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
          className='bg-red-50 rounded-full p-2.5 hover:bg-red-100 transition lg:hidden m-2'
        >
          <FaPowerOff className='text-red-500' />
        </button>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
