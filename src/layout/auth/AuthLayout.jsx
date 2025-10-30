import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg-[#3B3B3D] font-raleway">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
