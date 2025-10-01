import { Outlet } from "react-router-dom";
import FooterCard from "../../page/public/home/components/FooterCard";

export const MainLayout = () => {
  return (
    <div>
      <h2 className="text-2xl">Header Section</h2>
      <Outlet />
      <FooterCard/>
    </div>
  );
};
