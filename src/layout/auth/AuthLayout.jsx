import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className='bg-[#3B3B3D]'>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
