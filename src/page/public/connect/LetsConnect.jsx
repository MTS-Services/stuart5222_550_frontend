import { MdOutlineContentCopy } from "react-icons/md";
import { StuartImage } from "../../../components/allStuartImage/StuartImage";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const LetsConnect = () => {
  const navigate = useNavigate();

  return (
    <div className="px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] h-screen">
      <div className="max-w-[600px] mx-auto">
        <h3
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-white mb-3 cursor-pointer"
        >
          <IoMdArrowBack /> Back
        </h3>
        <div className="">
          <StuartImage />
          <div className="flex justify-center text-center">
            <h2 className="md:text-[40px] text-[32px] font-raleway font-semibold text-[#F07400] w-[440px]">
              Here’s how to reach me
            </h2>
          </div>
        </div>
        <div className="text-[#FFFFFF] text-base font-medium bg-[#FFFFFF14] p-4 rounded-lg mt-3">
          <p className="flex items-center justify-between">
            Name : Cheryl Ann
            <span>
              <MdOutlineContentCopy className="text-[#ACACAC]" />
            </span>
          </p>
          <p className="flex items-center justify-between my-4">
            E-mail : cheryann@gmail.com
            <span>
              <MdOutlineContentCopy className="text-[#ACACAC]" />
            </span>
          </p>
          <p className="flex items-center justify-between">
            Phone number : +1 (555) 010-0001
            <span>
              <MdOutlineContentCopy className="text-[#ACACAC]" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
