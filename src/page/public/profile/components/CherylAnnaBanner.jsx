import { GrLocation } from "react-icons/gr";
import { FaRegCalendar } from "react-icons/fa";

import { Link } from "react-router-dom";

export const CherylAnnaBanner = () => {
  return (
    <div className="px-2 py-6 font-raleway text-white">
      <div className="flex items-center justify-center">
        <div className="text-center">
          {/* Image */}
          <img
            src="/img/page/home/remove_preview.png"
            alt="preview"
            className="h-[104px] w-[146px] bg-cover object-cover"
          />

          {/* Heading */}
          <h1 className="mb-4 text-center font-raleway text-[40px] font-bold">
            Cheryl Ann
          </h1>
        </div>
      </div>

      <div className="flex w-full items-center justify-center text-center">
        <div className="relative my-6 w-[600px] overflow-hidden rounded-2xl bg-gradient-to-b from-orange-200 via-amber-50 to-yellow-50 p-8 shadow-lg">
          {/* Gradient border overlay */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-full rounded-2xl border-l-4 border-r-4 border-t-4 border-transparent"
            style={{
              borderImage:
                "linear-gradient(to bottom, #FED7AA, #FEF3C7, #FEF9C3) 1",
            }}
          ></div>

          {/* Content */}
          <h2 className="mb-[21px] text-start text-xl font-bold text-gray-900 md:text-[32px]">
            I am traveling and will be in:
          </h2>

          <div className="space-y-4">
            <div className="">
              <div className="flex items-center gap-3">
                <span className="mt-0.5 text-orange-600">
                  <FaRegCalendar />
                </span>
                <div className="flex gap-2 text-xl font-medium text-black md:text-2xl">
                  Start-Date: October 1, 2025
                </div>
              </div>
              <div className="ml-8 flex gap-2 text-xl font-medium text-black md:text-2xl">
                End-Date: October 20, 2025
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-xl text-orange-600">
                <GrLocation />
              </span>
              <div className="flex gap-2 text-xl font-medium text-black md:text-2xl">
                Location: Anywhere, USA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="">
        <div className="flex items-center justify-center text-center">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center">
              <img
                src="/img/page/chery/img1.jpg"
                alt="preview"
                className="h-full w-full rounded-xl bg-cover object-cover"
              />
            </div>
            <div className="flex w-full items-center gap-5">
              <img
                src="/img/page/chery/img2.jpg"
                alt="preview"
                className="h-[50%] w-[49%] rounded-xl bg-cover object-cover"
              />
              <img
                src="/img/page/chery/img3.jpg"
                alt="preview"
                className="h-[50%] w-[49%] rounded-xl bg-cover object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto my-2 max-w-[600px]">
          <Link to={`/user-profile/gallery`}>
            <p className="flex items-center justify-end font-raleway text-base font-semibold">
              See more photos
            </p>
          </Link>

          <div className="">
            <h2 className="font-raleway text-[32px] font-semibold text-[#F07400]">
              Profile Details
            </h2>
            <div className="my-4 rounded-lg bg-[#505050] p-6">
              <p className="font-raleway text-xl font-normal md:text-2xl">
                Name : Cheryl Ann
              </p>
              <p className="my-5 font-raleway text-xl font-normal md:text-2xl">
                Age : 56
              </p>
              <p className="font-raleway text-xl font-normal md:text-2xl">
                Height : 5’7
              </p>
              <p className="my-5 font-raleway text-xl font-normal md:text-2xl">
                Body type : Curvy
              </p>
              <p className="font-raleway text-xl font-normal md:text-2xl">
                Area : Hamilton, Montana
              </p>
              <p className="my-5 font-raleway text-xl font-normal md:text-2xl">
                Dealbreakers : Smokers
              </p>
            </div>
          </div>

          <h2 className="mt-10 font-raleway text-xl font-medium">Bio</h2>
          <div className="my-4 rounded-lg bg-[#FFFFFF14]">
            <p className="p-4 font-raleway text-xs font-medium md:text-base">
              “Hi, I’m Cheryl Ann, 56, standing 5’7 with a curvy body type. I
              enjoy genuine connections and meaningful conversations. Looking to
              meet someone authentic — dealbreaker for me is smoking.”
            </p>
          </div>

          <p className="my-14 text-center font-raleway text-xl font-medium md:px-4 md:text-2xl">
            If you’ve read this far and you’re intrigued, don’t overthink it.
            Let’s see what a good conversation might bring.
          </p>

          <h2 className="mb-3 text-center font-raleway text-2xl font-bold md:text-4xl">
            It's not a scam, it's a Scan.
          </h2>

          <Link to={`/user-profile/connect`}>
            <button
              type="submit"
              className="my-2 w-full rounded-lg bg-orange-500 p-2.5 text-base font-semibold text-white transition hover:bg-orange-600 md:my-4"
            >
              Let’s Connect
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
