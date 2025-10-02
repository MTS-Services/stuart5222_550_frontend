import { AllCard } from "./AllCard";
import { DateDropDown } from "./DateDropDown";

export const AdminDashboard = () => {
  return (
    <div className="text-black p-8">
      <div className="">
        <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
          Dashboard Overview
        </h2>
        <p className="justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-3 mt-1">
          Monitor your user performance
        </p>
        <h3 className="justify-center text-[#111827] text-base font-normal font-['Poppins'] leading-normal">
          Last 30 days overview
        </h3>
        <DateDropDown/>
      </div>
      <AllCard/>
    </div>
  );
};
