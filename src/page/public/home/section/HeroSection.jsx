import { JoinWaitlist } from "../components/JoinWaitlist";

const HeroSection = () => {
  const handleNavigate = () => {
    window.location.href = "/auth/login";
  };
  return (
    <div className="mx-auto max-w-[600px] py-10 md:py-6">
      <div className="flex items-center justify-center">
        <div className="text-center">
          {/* Image */}
          <div className="flex justify-center pt-[20px]">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-56 w-56 object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="mb-[40px] font-raleway text-[32px] font-bold text-white sm:text-[40px] md:text-[50px]">
            Why “Scan Me Maybe”?
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center text-white">
        <div className="">
          <p className="mb-[16px] font-raleway font-normal md:mb-6 md:text-2xl">
            Let’s be honest:
          </p>

          <p className="my-7 font-raleway font-bold leading-6 md:text-2xl">
            Dating apps? A disaster.
          </p>
          <div className="ml-4 md:ml-8">
            <p className="my-5 font-raleway md:text-2xl">- fake profiles</p>
            <p className="font-raleway md:text-2xl">- ghosting</p>
            <p className="my-5 font-raleway md:text-2xl">
              - long-distance pen pals
            </p>
            <p className="my-5 font-raleway md:text-2xl">
              - the eventual ask for money
            </p>
          </div>
          <p className="mt-7 font-raleway font-bold md:text-2xl">
            Approaching someone out in the world?
            <br /> Complicated.
          </p>

          <div className="ml-4 md:ml-8">
            <p className="my-5 font-raleway font-normal md:text-2xl">
              {" "}
              - awkward
            </p>
            <p className="font-raleway font-normal md:text-2xl">
              - negative reaction to a simple "hello"
            </p>
            <p className="my-5 font-raleway font-normal md:text-2xl">
              - fear of rejection
            </p>
          </div>
          <div className="">
            <h2 className="mt-7 text-center font-raleway text-[24px] font-bold">
              It’s not a scam, it’s a Scan
            </h2>
            <div className="rounded-lg bg-[#434343] px-4 py-[74px] sm:py-8">
              <h2 className="mb-4 text-center font-raleway text-[32px] font-bold">
                Scan Me Maybe
              </h2>
              <p className="mb-[40px] max-w-[600px] text-justify font-raleway leading-6">
                Revolutionizing dating through personalized cards and genuine
                connections. because sometimes, the best matches happen when you
                least expect them.
              </p>
              {/* Form */}
              <JoinWaitlist />

              <p className="mt-3 text-center font-raleway">or</p>

              <button
                onClick={handleNavigate}
                className="mt-4 w-full rounded-lg bg-orange-500 p-2.5 text-base font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
