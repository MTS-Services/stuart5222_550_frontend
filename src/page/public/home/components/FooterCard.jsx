export default function FooterCard() {
  return (
    <div className="w-96 h-72 px-4 pt-5 pb-10 bg-neutral-700 border-b inline-flex flex-col justify-start items-start gap-3">
      
      {/* Feature header */}
      <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <img className="w-20 h-14" src="/img/page/home/remove_preview.png" alt="Feature illustration" />
        <div className="self-stretch py-2 border-b border-neutral-600 inline-flex justify-center items-center gap-2.5">
          <p className="flex-1 text-white text-xl font-semibold">
            Person to person dating, <br />
            but with a safer approach.
          </p>
        </div>
      </div>

      {/* Copyright & Legal */}
      <p className="text-neutral-200 text-[8px] font-normal font-['Plus_Jakarta_Sans'] leading-3">
        © 2025 SCAN ME MAYBE –
      </p>
      <p className="text-neutral-200 text-[8px] font-normal font-['Plus_Jakarta_Sans'] leading-3">
        Scan Me Maybe™ is a trademark of Scan Me Maybe, LLC. All Rights Reserved.
      </p>

      {/* Links */}
      <p className="text-stone-300 text-[8px] font-normal font-['Plus_Jakarta_Sans'] underline leading-3 cursor-pointer">
        Terms & Conditions
      </p>
      <p className="text-stone-300 text-[8px] font-normal font-['Plus_Jakarta_Sans'] underline leading-3 cursor-pointer">
        Privacy Policy
      </p>
    </div>
  );
}
