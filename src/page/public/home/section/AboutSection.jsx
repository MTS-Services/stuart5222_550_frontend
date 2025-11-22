import {
  MdOutlinePrivacyTip,
  MdOutlineMarkEmailRead,
  MdOutlineQrCode,
} from "react-icons/md";
import { RiHeartsFill } from "react-icons/ri";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { SlPlane } from "react-icons/sl";
import { FaUser } from "react-icons/fa";

const features = [
  {
    icon: MdOutlineQrCode,
    title: "Unique QR Cards",
    text: "Get 50 cards with your personalized QR code that leads to your curated profile.",
  },
  {
    icon: MdOutlinePrivacyTip,
    title: "Privacy First",
    text: "Photos loaded to your profile page will have the location data scrubbed. Once your cards are mailed, we delete your information. The only contact information shared is that which you provide.",
  },
  {
    icon: FaUser,
    title: "Manual Review",
    text: "Every profile is manually reviewed to ensure quality and compliance with our community standards.",
  },
  {
    icon: RiHeartsFill,
    title: "Real Connections",
    text: "Skip the endless swiping. Make genuine connections through real-world encounters.",
  },
  {
    icon: MdOutlineMarkEmailRead,
    title: "Contact Information",
    text: "You choose what to share with someone. We suggest a dedicated phone number and/or a unique email.",
  },
  {
    icon: IoCheckmarkCircleOutline,
    title: "Limited Scans",
    text: "Each card is limited to 5 scans to enhance privacy and protect from random sharing.",
  },
  {
    icon: SlPlane,
    title: "Travel Mode",
    text: "Love doesn’t always live next door – sometimes it’s waiting on your next adventure. Use Travel Mode to share when and where you’ll be exploring.",
  },
];

function AboutSection() {
  return (
    <div className="mx-auto mb-10 max-w-[600px] px-2 font-raleway md:px-0 md:py-6">
      <div className="inline-flex flex-col items-center justify-start gap-8 text-center sm:py-6">
        {/* 🔥 Title and Description (unchanged) */}
        <div className="flex flex-col items-start justify-start gap-4 self-stretch">
          <h2 className="self-stretch text-center font-raleway text-2xl font-bold capitalize text-orange-500">
            What is Scan Me Maybe?{" "}
          </h2>{" "}
          <p className="max-w-[600px] self-stretch text-justify font-raleway text-base font-normal leading-normal text-white">
            A spontaneous approach to dating that combines the authenticity of
            real-world meetings with the convenience of digital profiles. Get
            your story out there, one card at a time.{" "}
          </p>{" "}
        </div>

        {/* 🎉 Mapped Feature Cards */}
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex w-full flex-col items-center justify-start gap-2.5 rounded-lg p-5 outline outline-1 outline-orange-500 md:w-[600px]"
            >
              <div className="relative h-10 w-10 overflow-hidden rounded bg-orange-500 p-1">
                <Icon className="h-full w-full text-white" />
              </div>
              <div className="flex flex-col items-center justify-start gap-3.5 self-stretch">
                <h3 className="text-center font-raleway text-xl font-bold capitalize text-white">
                  {item.title}
                </h3>
                <p className="justify-start self-stretch text-center font-raleway text-base font-normal leading-6 text-white">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AboutSection;
