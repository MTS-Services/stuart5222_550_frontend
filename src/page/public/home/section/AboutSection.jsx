import { FiUsers } from "react-icons/fi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import {
  MdOutlineMarkEmailRead,
  MdOutlinePrivacyTip,
  MdOutlineQrCode,
} from "react-icons/md";
import { RiHeartsFill } from "react-icons/ri";
import { SlPlane } from "react-icons/sl";

function AboutSection() {
  return (
    <div className="mx-auto flex max-w-[600px] items-center justify-center pb-6">
      <div className="mb-10 mt-6 inline-flex flex-col items-center justify-start gap-8 text-center sm:py-6">
        {/* Section Title */}
        <div className="flex flex-col items-start justify-start gap-4 self-stretch">
          <h2 className="self-stretch text-center text-4xl font-bold capitalize text-orange-500">
            What is Scan Me Maybe?
          </h2>
          <p className="max-w-[568px] self-stretch text-justify text-base font-normal leading-normal text-white">
            A spontaneous approach to dating that combines the authenticity of
            real-world meetings with the convenience of digital profiles. Get
            your story out there, one card at a time.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-orange-500 p-1">
            <MdOutlineQrCode className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Unique QR Cards
            </h3>
            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              Get 50 cards with your personalized QR code that leads to your
              curated profile.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-orange-500 p-1">
            <MdOutlinePrivacyTip className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Privacy First
            </h3>
            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              Photos loaded to your profile page will have the location data
              scrubbed. Once your cards are mailed, we delete your information.
              The only contact information shared is that which you provide.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-orange-500 p-1">
            <FiUsers className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Manual Review
            </h3>
            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              Every profile is manually reviewed to ensure quality and
              compliance with our community standards.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-orange-500 p-1">
            <RiHeartsFill className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Real Connections
            </h3>
            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              Skip the endless swiping. Make genuine connections through
              real-world encounters.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-orange-500 p-1">
            <MdOutlineMarkEmailRead className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Contact Information
            </h3>
            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              You choose what to share with someone. We suggest a dedicated
              phone number and/or a unique email.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-orange-500 p-1">
            <IoCheckmarkCircleOutline className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Limited Scans
            </h3>
            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              Each card is limited to 5 scans to enhance privacy and protect
              from random sharing.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[568px]">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-orange-500 p-1">
            <SlPlane className="left-[5px] top-[5px] h-full w-full text-white" />
          </div>
          <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
            <h3 className="text-center text-xl font-bold capitalize text-white">
              Travel Mode
            </h3>

            <p className="justify-start self-stretch text-center text-base font-normal leading-6 text-white">
              Love doesn’t always live next door – sometimes it’s waiting on
              your next adventure. Use Travel Mode to share when and where
              you’ll be exploring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
