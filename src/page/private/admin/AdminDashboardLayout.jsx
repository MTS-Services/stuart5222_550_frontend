import { Outlet } from "react-router-dom";
import { AdminLeftSideBar } from "./AdminLeftSideBar";

export const AdminDashboardLayout = () => {
  return (
    <section className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed z-10 h-screen lg:relative lg:w-[260px] bg-[#FFFCFA]">
        <AdminLeftSideBar />
      </div>

      {/* Main content */}
      <div className="flex-1 w-full overflow-y-auto mt-[68px] lg:mt-0">
        <Outlet />
      </div>
    </section>
  );
};
