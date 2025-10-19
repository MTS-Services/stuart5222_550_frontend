import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className='bg-[#3B3B3D]'>
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
