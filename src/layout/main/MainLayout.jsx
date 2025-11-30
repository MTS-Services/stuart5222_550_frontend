import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { useEffect } from "react";
import { toast } from "react-toastify";

const MainLayout = () => {
  /* ---------------- SHOW TOAST AFTER RELOAD ---------------- */
  useEffect(() => {
    const message = localStorage.getItem("logoutMessage");

    if (message) {
      toast.info(message);
      localStorage.removeItem("logoutMessage");
    }
  }, []);

  return (
    <div className="bg-[#3B3B3D] font-raleway">
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
