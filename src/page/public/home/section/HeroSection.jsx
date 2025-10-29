import { JoinWaitlist } from "../components/JoinWaitlist";

const HeroSection = () => {
  return (
    <div className="mx-auto max-w-[600px] md:py-6">
      <div className="flex items-center justify-center">
        <div className="text-center">
          {/* Image */}
          <div className="flex justify-center py-[40px]">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-24 w-36 object-cover"
            />
          </div>

          {/* Heading */}
          <h1 className="mb-[40px] font-raleway text-[30px] font-bold text-white sm:text-[40px] md:text-[50px]">
            Why “Scan Me Maybe”?
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center text-white">
        <div className="">
          <p className="mb-[16px] text-base font-normal md:mb-6 md:text-2xl">
            Let’s be honest:
          </p>

          <p className="my-7 text-base font-semibold leading-6 md:text-2xl">
            Dating apps? A disaster.
          </p>
          <div className="ml-4 md:ml-0">
            <p className="my-5 text-base md:text-2xl">- fake profiles</p>
            <p className="text-base md:text-2xl">- ghosting</p>
            <p className="my-5 text-base md:text-2xl">
              - long-distance pen pals
            </p>
            <p className="my-5 text-base md:text-2xl">
              - the eventual ask for money
            </p>
          </div>
          <p className="mt-7 font-semibold md:text-2xl">
            Approaching someone out in the world?
            <span className="ml-0 block md:ml-2 md:inline">Complicated.</span>
          </p>

          <div className="ml-4 md:ml-0">
            <p className="my-5 text-base font-normal md:text-2xl"> - awkward</p>
            <p className="text-base font-normal md:text-2xl">
              - negative reaction to a simple "hello"
            </p>
            <p className="my-5 text-base font-normal md:text-2xl">
              - fear of rejection
            </p>
          </div>
          <div className="">
            <h2 className="mb-5 text-center text-[24px] font-bold">
              It’s not a scam, it’s a Scan
            </h2>
            <div className="rounded-lg bg-[#434343] px-4 py-[74px] sm:py-8">
              <h2 className="mb-4 text-center text-[32px] font-bold">
                Scan Me Maybe
              </h2>
              <p className="mb-[40px] max-w-[568px] text-justify leading-6">
                Revolutionizing dating through personalized cards and genuine
                connections. because sometimes, the best matches happen when you
                least expect them.
              </p>
              {/* Form */}
              <JoinWaitlist />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
