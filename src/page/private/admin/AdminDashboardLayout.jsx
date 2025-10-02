import { Link, Outlet } from "react-router-dom";
import { AdminLeftSideBar } from "./AdminLeftSideBar";
import { FaRegBell, FaRegUser } from "react-icons/fa";

export const AdminDashboardLayout = () => {
  return (
    <section className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed z-10 h-screen lg:relative lg:w-[260px]">
        <AdminLeftSideBar />
      </div>

      {/* Main content */}
      <div className="flex-1 w-full mt-[68px] lg:mt-0">
        <div className="flex items-center justify-end py-5">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
            <Link to={`/admin/notification`}>
              <FaRegBell />
            </Link>
            <div className=" bg-green-50 rounded-full p-2.5">
              <FaRegUser className="w-4 h-4" />
            </div>
            <div className="font-medium text-black/90">
              <h2 className="text-base font-semibold mb-1">John Davis</h2>
              <p className="text-sm">Administrator</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9FAFB] h-[90%]">
          <Outlet />
        </div>
      </div>
    </section>
  );
};
