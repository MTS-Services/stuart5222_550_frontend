import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

/* ---------------- MAIN LAYOUT ---------------- */
const AdminLayout = () => {
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Sidebar */}
      <div className='hidden lg:block w-64'>
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className='lg:hidden'>
        <AdminSidebar />
      </div>

      {/* Main Area */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        <AdminNavbar />
        <main className='flex-1 overflow-y-auto p-6 bg-[#F9FAFB]'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
