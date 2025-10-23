import { Link } from 'react-router-dom';
import { FaPowerOff, FaRegBell, FaRegUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { STORAGE } from '../../config/storage/auth/authStorage';

const AdminNavbar = () => {
  const { unreadCount } = useSelector((state) => state.notifications);

  const handleLogout = () => {
    STORAGE.clearAll();
    window.location.href = '/auth/login';
  };

  return (
    <nav className='sticky top-0 z-30 flex items-center justify-end bg-white border-b border-gray-200 px-6 py-6'>
      <div className='flex items-center gap-4 sm:gap-5'>
        {/* 🔔 Notification Icon with Badge */}
        <Link
          to='/admin/notifications'
          className='relative text-gray-600 hover:text-orange-500 transition-colors'
        >
          <FaRegBell size={18} />

          {/* 🔴 Badge */}
          {unreadCount > 0 && (
            <span className='absolute -top-2.5 -right-2 bg-red-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* 👤 User Icon */}
        <Link
          to='/admin/settings'
          className='bg-green-50 rounded-full p-2.5 hover:bg-green-100 transition'
        >
          <FaRegUser className='w-4 h-4 text-green-700' />
        </Link>

        {/* 🧑 User Info */}
        <div className='font-medium text-gray-800'>
          <h2 className='text-sm font-semibold leading-tight'>John Davis</h2>
          <p className='text-xs text-gray-500'>Administrator</p>
        </div>
        <button
          onClick={handleLogout}
          className='bg-red-50 rounded-full p-2.5 hover:bg-red-100 transition'
        >
          <FaPowerOff className='text-red-500' />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
