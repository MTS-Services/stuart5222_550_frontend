import { FiUsers } from "react-icons/fi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdOutlineMarkEmailRead, MdOutlinePrivacyTip, MdOutlineQrCode } from "react-icons/md";
import { RiHeartsFill } from "react-icons/ri";
import { SlPlane } from "react-icons/sl";

export default function AboutSection() {
  return (
    <div className="w-96 px-4 py-6 inline-flex flex-col justify-start items-center gap-8">
      {/* Section Title */}
      <div className="self-stretch flex flex-col justify-start items-start gap-4">
        <h2 className="self-stretch text-center text-orange-500 text-3xl font-bold capitalize">
          What is Scan Me Maybe?
        </h2>
        <p className="self-stretch text-justify text-white text-base font-normal leading-normal">
          A spontaneous approach to dating that combines the authenticity of
          real-world meetings with the convenience of digital profiles. Get your
          story out there, one card at a time.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1">
          <MdOutlineQrCode className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Unique QR Cards
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            Get 50 cards with your personalized QR code that leads to your
            curated profile.
          </p>
        </div>
      </div>

      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1">
          <MdOutlinePrivacyTip className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Privacy First
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            Photos loaded to your profile page will have the location data
            scrubbed. Once your cards are mailed, we delete your information.
            Only contact information you are comfortable with is shared when
            someone matches with you.
          </p>
        </div>
      </div>

      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1">
          <FiUsers className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Manual Review
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            Every profile is manually reviewed to ensure quality and compliance
            with our community standards.
          </p>
        </div>
      </div>

      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1">
          <RiHeartsFill className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Real Connections
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            Skip the endless swiping. Make genuine connections through
            real-world encounters.
          </p>
        </div>
      </div>

      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1">
          <MdOutlineMarkEmailRead className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Contact Information
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            You choose what to share with someone. We suggest a dedicated phone
            number and/or a unique email.
          </p>
        </div>
      </div>

      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded-lg overflow-hidden p-1">
          <IoCheckmarkCircleOutline className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Limited Scans
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            Each card is limited to 5 scans to enhance privacy and protect from
            random sharing.
          </p>
        </div>
      </div>

      <div className="w-80 p-5 rounded-lg outline outline-1 outline-orange-500 flex flex-col justify-start items-center gap-2.5">
        <div className="w-10 h-10 relative bg-orange-500 rounded-lg overflow-hidden p-1">
          <SlPlane className="w-full h-full text-white left-[5px] top-[5px]" />
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h3 className="text-center text-white text-xl font-bold capitalize">
            Travel Mode
          </h3>
          <p className="self-stretch text-center text-white text-base font-normal leading-normal">
            Sometimes it’s waiting on your next adventure. Use Travel Mode to
            share where and when you’ll be exploring.
          </p>
        </div>
      </div>
    </div>
  );
}
