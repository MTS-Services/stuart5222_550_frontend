import { MdOutlineContentCopy, MdCheck } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Image from "../../../components/ui/Image";
import { useSelector } from "react-redux";
import { useState } from "react";

const LetsConnectView = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.profile);

  // Track which field was copied (by key)
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, fieldKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      // Reset after 2 seconds
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const name = userProfile?.displayName || "Cheryann Smith";
  const email = userProfile?.email || "cheryann@gmail.com";
  const phone = userProfile?.phone || "+1 (555) 010-0001";

  return (
    <div className="min-h-screen bg-[#3B3B3D] px-[10px] py-2 sm:py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-[600px]">
        <h3
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-white"
        >
          <IoMdArrowBack /> Back
        </h3>
        <div className="">
          <div className="flex justify-center py-[40px]">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-24 w-36 object-cover"
            />
          </div>
          <div className="flex justify-center text-center">
            <h2 className="w-[440px] font-raleway text-[32px] font-semibold text-[#F07400] md:text-[40px]">
              Here’s how to reach me
            </h2>
          </div>
        </div>

        <div className="mt-3 rounded-lg bg-[#FFFFFF14] p-4 text-base font-medium text-[#FFFFFF]">
          <p className="flex items-center justify-between">
            Name : {name}
            <button
              type="button"
              onClick={() => handleCopy(name, "name")}
              className="ml-2 text-[#ACACAC] transition-colors hover:text-white"
              aria-label="Copy name"
            >
              {copiedField === "name" ? (
                <MdCheck className="text-green-400" />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </p>
          <p className="my-4 flex items-center justify-between">
            E-mail : {email}
            <button
              type="button"
              onClick={() => handleCopy(email, "email")}
              className="ml-2 text-[#ACACAC] transition-colors hover:text-white"
              aria-label="Copy email"
            >
              {copiedField === "email" ? (
                <MdCheck className="text-green-400" />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </p>
          <p className="flex items-center justify-between">
            Phone number : {phone}
            <button
              type="button"
              onClick={() => handleCopy(phone, "phone")}
              className="ml-2 text-[#ACACAC] transition-colors hover:text-white"
              aria-label="Copy phone number"
            >
              {copiedField === "phone" ? (
                <MdCheck className="text-green-400" />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LetsConnectView;
