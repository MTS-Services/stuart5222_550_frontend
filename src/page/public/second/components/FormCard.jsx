const FormCard = () => {
  return (
    <div className="w-96 h-[471px] px-4 py-8 bg-neutral-700 rounded-lg inline-flex flex-col justify-center items-center gap-6">
      <div className="self-stretch flex flex-col justify-start items-center gap-4">
        <div className="self-stretch justify-start text-white text-xl font-bold capitalize">
          <span>P</span>
          <span className="lowercase">
            erson to person dating, but with a safer approach.
          </span>
        </div>
      </div>

      <div className="w-80 flex flex-col justify-start items-start gap-6">
        {/* Name Field */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch justify-start text-white text-base font-semibold leading-normal">
            Name
          </div>
          <div className="self-stretch h-11 p-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-2.5">
            <div className="justify-start text-neutral-700 text-xs font-medium">
              Enter your Name
            </div>
          </div>
        </div>

        {/* E-mail Field */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="justify-start text-white text-base font-semibold leading-normal">
            E-mail
          </div>
          <div className="self-stretch h-11 p-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-2.5">
            <div className="justify-start text-neutral-700 text-xs font-medium">
              Enter your e-mail
            </div>
          </div>
        </div>

        {/* Phone Field */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch justify-start text-white text-base font-semibold leading-normal">
            Phone number
          </div>
          <div className="self-stretch h-11 p-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-2.5">
            <div className="justify-start text-neutral-700 text-xs font-medium">
              Enter your phone number
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="self-stretch p-2.5 bg-orange-500 rounded-lg inline-flex justify-center items-center gap-2.5 cursor-pointer">
          <div className="text-center justify-start text-white text-base font-semibold leading-normal">
            Submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
