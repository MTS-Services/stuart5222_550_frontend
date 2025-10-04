export const FooterSection = () => {
  return (
    <div className="flex items-center justify-center bg-[#505050] px-4 py-6">
      <div className="w-full md:w-[568px] md:my-10 mt-[10px] md:mt-0 mb-[40px] md:mb-0">
        {/* Feature header */}
        <div className="self-stretch flex flex-col justify-start items-start gap-5">
          <img
            className="w-20 h-14"
            src="/img/page/home/remove_preview.png"
            alt="Feature illustration"
          />
          <div className="self-stretch mt-1 border-b border-neutral-600 inline-flex justify-center items-center gap-2.5">
            <p className="text-white text-xl font-semibold md:w-[640px] w-full">
              Person to person dating, but with a safer approach.
            </p>
          </div>
        </div>
        {/* Copyright & Legal */}
        <p className="text-neutral-200 text-[8px] font-normal font-raleway leading-3 my-2.5">
          © 2025 SCAN ME MAYBE –
        </p>
        <p className="text-neutral-200 text-[8px] font-normal font-raleway leading-3">
          Scan Me Maybe™ is a trademark of Scan Me Maybe, LLC. All Rights
          Reserved.
        </p>

        {/* Links */}
        <p className="text-stone-300 text-[8px] font-normal font-raleway underline leading-3 cursor-pointer my-2.5">
          Terms & Conditions
        </p>
        <p className="text-stone-300 text-[8px] font-normal font-raleway underline leading-3 cursor-pointer">
          Privacy Policy
        </p>
      </div>
    </div>
  );
};
