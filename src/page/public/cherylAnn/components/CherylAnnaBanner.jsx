import { GrLocation } from "react-icons/gr";
import { FaRegCalendar } from "react-icons/fa";
import { StuartImage } from "../../../../components/allStuartImage/StuartImage";
import { Link } from "react-router-dom";

export const CherylAnnaBanner = () => {
  return (
    <div className="font-raleway text-white px-4 py-6">
      <div className="flex items-center justify-center">
        <div className="text-center">
          {/* Image */}
          <StuartImage />

          {/* Heading */}
          <h1 className="font-raleway font-bold text-[20px] sm:text-[30px] md:text-[40px] text-center mb-4">
            Cheryl Ann
          </h1>
        </div>
      </div>

      <div className="flex justify-center items-center text-center w-full">
        <div className="relative w-[600px] my-6 rounded-2xl p-8 shadow-lg bg-gradient-to-b from-orange-200 via-amber-50 to-yellow-50 overflow-hidden">
          {/* Gradient border overlay */}
          <div
            className="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none border-t-4 border-l-4 border-r-4 border-transparent"
            style={{
              borderImage:
                "linear-gradient(to bottom, #FED7AA, #FEF3C7, #FEF9C3) 1",
            }}
          ></div>

          {/* Content */}
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            I am traveling and will be in:
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-orange-600 text-xl mt-0.5">
                <GrLocation />
              </span>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-900">Location:</span>
                <span className="text-gray-900">Anywhere, USA</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-orange-600 text-xl mt-0.5">
                <FaRegCalendar />
              </span>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-900">End-Date:</span>
                <span className="text-gray-900">October 20, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="">
        <div className="flex justify-center items-center text-center">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center">
              <img
                src="/img/page/chery/img1.jpg"
                alt="preview"
                className="w-full h-full bg-cover object-cover rounded-xl"
              />
            </div>
            <div className="flex items-center w-full gap-5">
              <img
                src="/img/page/chery/img2.jpg"
                alt="preview"
                className="w-[49%] h-[50%] bg-cover object-cover rounded-xl"
              />
              <img
                src="/img/page/chery/img3.jpg"
                alt="preview"
                className="w-[49%] h-[50%] bg-cover object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="max-w-[600px] mx-auto my-2">
          <Link to={`/see-more-phone`}>
            <p className="flex items-center justify-end font-raleway text-base font-semibold">
              See more photos
            </p>
          </Link>

          <div className="">
            <h2 className="text-[32px] font-raleway font-semibold text-[#F07400]">
              Profile Details
            </h2>
            <div className="bg-[#505050] p-6 rounded-lg my-4">
              <p className="font-raleway font-normal text-2xl">
                Name : Cheryl Ann
              </p>
              <p className="font-raleway font-normal text-2xl my-5">Age : 56</p>
              <p className="font-raleway font-normal text-2xl">Height : 5’7</p>
              <p className="font-raleway font-normal text-2xl my-5">
                Body type : Curvy
              </p>
              <p className="font-raleway font-normal text-2xl">
                Area : Hamilton, Montana
              </p>
              <p className="font-raleway font-normal text-2xl my-5">
                Dealbreakers : Smokers
              </p>
            </div>
          </div>

          <h2 className="font-raleway font-medium text-xl mt-10">Bio</h2>
          <div className="bg-[#FFFFFF14] rounded-lg my-4">
            <p className="font-medium font-raleway text-base p-4">
              “Hi, I’m Cheryl Ann, 56, standing 5’7 with a curvy body type. I
              enjoy genuine connections and meaningful conversations. Looking to
              meet someone authentic — dealbreaker for me is smoking.”
            </p>
          </div>

          <p className="font-medium md:text-2xl text-xl font-raleway text-center md:px-4 my-14">
            If you’ve read this far and you’re intrigued, don’t overthink it.
            Let’s see what a good conversation might bring.
          </p>

          <h2 className="font-bold font-raleway md:text-4xl text-2xl text-center mb-3">
            It's not a scam, it's a Scan.
          </h2>

          <Link to={`/lets-connect`}>
            <button
              type="submit"
              className="w-full md:my-4 my-2 p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition"
            >
              Let’s Connect
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
