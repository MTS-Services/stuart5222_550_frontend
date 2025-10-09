import { Outlet } from "react-router-dom";
import { FooterSection } from "../../page/public/home/components/FooterSection";

export const MainLayout = () => {
  return (
    <div>
      <Outlet />
      <FooterSection/>
    </div>
  )
}
