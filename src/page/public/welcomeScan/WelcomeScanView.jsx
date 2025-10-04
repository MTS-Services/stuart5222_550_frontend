import { BsCheck } from "react-icons/bs";

export const WelcomeScanView = () => {
  return (
    <div className="bg-[#313132] md:h-screen py-16">
      {/* Image */}
      <div className="flex justify-center mb-6">
        <img
          src="/img/page/home/remove_preview.png"
          alt="preview"
          className="w-[146px] h-[104px] bg-cover object-cover"
        />
      </div>
      <div className="flex items-center justify-center text-white px-4">
        <div className="text-center max-w-[600px]">
          {/* Heading */}
          <h1 className="font-raleway font-bold text-[20px] sm:text-[30px] md:text-[40px] text-center mb-4">
            Welcome to Scan Me Maybe{" "}
            <span className="font-medium block sm:inline">
              So…. you got the card.
            </span>
          </h1>

          {/* Paragraph */}
          <p className="md:text-base text-xs font-normal font-raleway md:py-5 py-2.5 md:w-[600px] w-[361px]">
            If you’re reading this, it means I – or one of my wonderful friends
            – saw something in you. Maybe it was your smile, your energy, or the
            way you carried yourself. You weren’t obviously partnered, and if
            you are in a relationship – congratulations, and feel free to
            disregard all of this with a smile.
          </p>

          <div className="bg-[#505050] flex gap-4 px-4 py-3 rounded-lg w-full my-8">
            {/* Checkbox */}
            <div className="inline-flex items-center">
              <label className="flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  defaultChecked
                  className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded border border-orange-500 checked:bg-orange-500 checked:border-orange-500"
                />
                {/* Checkmark */}
                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <BsCheck className="text-white w-3.5 h-3.5" />
                </span>
              </label>
            </div>

            {/* Text */}
            <div className="flex flex-col text-start text-sm">
              <p className="font-semibold text-white">
                Read terms and conditions
              </p>
              <p className="text-sm text-orange-500">
                Yes, I have accepted the terms and conditions.
              </p>
            </div>
          </div>

          <div className="">
            <h2 className="font-raleway text-[26px] font-bold md:my-6 my-4">
              It’s not a scam, it’s a Scan
            </h2>
            <div className="w-full flex items-center gap-4 mt-[20px] font-semibold font-raleway">
              <button
                type="submit"
                className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base hover:bg-orange-600 transition"
              >
                Let’s go
              </button>
              <button
                type="submit"
                className="w-full p-2.5 bg-orange-500 rounded-lg text-white text-base hover:bg-orange-600 transition"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
