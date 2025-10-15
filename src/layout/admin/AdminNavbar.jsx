import { Link } from 'react-router-dom';
import { FaRegBell, FaRegUser } from 'react-icons/fa';

const AdminNavbar = () => {
  return (
    <>
      <nav className='sticky top-0 z-30 flex items-center justify-end bg-white border-b border-gray-200 px-6 py-6'>
        <div className='flex items-center gap-4 sm:gap-5'>
          <Link
            to='/admin/notifications'
            className='text-gray-600 hover:text-orange-500 transition-colors'
          >
            <FaRegBell size={18} />
          </Link>

          <Link
            to='/admin/settings'
            className='bg-green-50 rounded-full p-2.5 hover:bg-green-100 transition'
          >
            <FaRegUser className='w-4 h-4 text-green-700' />
          </Link>

          <div className='font-medium text-gray-800'>
            <h2 className='text-sm font-semibold leading-tight'>John Davis</h2>
            <p className='text-xs text-gray-500'>Administrator</p>
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
