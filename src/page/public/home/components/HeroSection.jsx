import { Link } from "react-router-dom";
import { StuartImage } from "../../../../components/allStuartImage/StuartImage";
import { JoinWaitlist } from "./JoinWaitlist";

export const HeroSection = () => {
  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-center">
        <div className="text-center">
          {/* Image */}
          <StuartImage />

          {/* Heading */}
          <h1 className="text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] font-bold text-white max-w-[600px] mx-auto my-[40px]">
            Why “Scan Me Maybe”?
          </h1>
        </div>
      </div>
      <div className="text-white flex items-center justify-center">
        <div className="">
          <p className="md:text-2xl text-base font-normal">Let’s be honest:</p>
          <p className="md:text-2xl text-base font-semibold my-6">
            Dating apps? A disaster.
          </p>
          <div className="md:ml-0 ml-4">
            <p className="md:text-2xl text-base font-medium">-fake profiles</p>
            <p className="md:text-2xl text-base font-medium my-6">-ghosting</p>
            <p className="md:text-2xl text-base font-medium">
              -long -distance pen pals
            </p>
            <p className="md:text-2xl text-base font-medium my-6">
              -the eventual ask for money
            </p>
          </div>
          <p className="md:text-2xl text-base font-semibold">
            Approaching someone out in the world?
            <span className="block md:inline md:ml-2 ml-0">Complicated.</span>
          </p>

          <div className="md:ml-0 ml-4">
            <p className="md:text-2xl text-base font-normal my-6">-awkward</p>
            <p className="md:text-2xl text-base font-normal">
              -negative reaction to a simple "hello"
            </p>
            <p className="md:text-2xl text-base font-normal my-6">
              -fear of rejection
            </p>
          </div>
          <div className="">
            <h2 className="font-bold text-[24px] mt-9 mb-6">
              It’s not a scam, it’s a Scan
            </h2>
            <div className="bg-[#434343] px-6 py-8 rounded-lg">
              <h2 className="text-[32px] font-bold mb-4">Scan Me Maybe</h2>
              <p className="text-base font-medium max-w-[568px]">
                Revolutionizing dating through personalized cards and genuine
                connections. because sometimes, the best matches happen when you
                least expect them.
              </p>
              {/* Form */}
              <JoinWaitlist/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
