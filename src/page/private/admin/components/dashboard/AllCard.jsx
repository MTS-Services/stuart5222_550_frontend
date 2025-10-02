import { FaUsers } from "react-icons/fa";

export const AllCard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div className="rounded-lg border border-white/100 bg-white self-stretch p-5">
        <div className="self-stretch inline-flex justify-between items-center">
          {/* Left Section */}
          <div className="w-32 inline-flex flex-col justify-center items-start gap-2">
            <div className="self-stretch justify-start text-White-800 text-xs font-normal font-lato leading-none">
              Total User
            </div>
            <div className="self-stretch justify-start text-White-800 text-2xl font-semibold font-poppins leading-9">
              4,000
            </div>
            <div className="justify-start">
              <span className="text-green-600 text-xs font-normal font-lato leading-none">
                +12%
              </span>
              <span className="text-White-600 text-xs font-normal font-lato leading-none ml-2">
                vs last month
              </span>
            </div>
          </div>

          {/* Right Section (Icon Box) */}
          <div className="bg-green-50 p-3 rounded-lg">
            <FaUsers className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
