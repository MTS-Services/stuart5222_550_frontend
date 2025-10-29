import { GrLocation } from "react-icons/gr";
import { FaRegCalendar } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../../features/public/profile/profileFetch";

const UserView = () => {
  const dispatch = useDispatch();

  // Get QR code data (contains profile email)
  const { data: qrData } = useSelector((state) => state.qrcode);

  // Get actual profile data
  const { userProfile, fetchLoading, error } = useSelector(
    (state) => state.profile,
  );
  console.log(userProfile);
  const userEmail = qrData?.profile?.contactEmail;
  const images = userProfile?.images || [];

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchUserProfile({ userMail: userEmail }));
    }
  }, [dispatch, userEmail]);

  // Show loading state
  if (fetchLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#3B3B3D] px-[10px] py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl">⏳</div>
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#3B3B3D] px-[10px] py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl">❌</div>
          <p className="text-xl text-red-400">Error loading profile</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Show message if no profile data
  if (!userProfile || !userProfile.email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#3B3B3D] px-[10px] py-2 sm:py-4 md:py-6 lg:py-8">
        <div className="text-center text-white">
          <div className="mb-4 text-2xl">👤</div>
          <p className="text-xl">No profile found</p>
          <p className="mt-2 text-sm">Please scan a valid QR code first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#3B3B3D] px-[10px] sm:py-4 md:py-6 lg:py-8">
      <div className="px-2 font-raleway text-white">
        <div className="flex justify-center py-[40px]">
          <img
            src="/img/assets/logo.png"
            alt="preview"
            className="h-24 w-36 object-cover"
          />
        </div>

        <h1 className="text-center text-2xl font-bold">
          {userProfile.displayName || "Anonymous User"}
        </h1>

        <div className="flex w-full items-center justify-center text-center">
          <div className="my-6 w-[600px] overflow-hidden rounded-lg border-l border-t border-orange-500 bg-gradient-to-b from-orange-500/10 to-white/0 p-8 shadow-lg">
            {/* Content */}
            <h2 className="mb-[21px] text-start text-xl font-bold text-gray-100 md:text-[32px]">
              I am traveling and will be in:
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-orange-600">
                  <FaRegCalendar size={20} />
                </span>
                <div className="text-start">
                  <p className="text-xl font-medium text-gray-300 md:text-2xl">
                    Start-Date: October 1, 2025
                  </p>
                  <p className="text-xl font-medium text-gray-300 md:text-2xl">
                    End-Date: October 20, 2025
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-start">
                <span className="text-xl text-orange-600">
                  <GrLocation size={20} />
                </span>
                <p className="text-xl font-medium text-gray-300 md:text-2xl">
                  Location: {userProfile.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="">
          <div className="flex items-center justify-center text-center">
            <div className="flex flex-col gap-5">
              {/* Main photo */}
              <div className="flex items-center justify-center">
                <img
                  src={images[0]?.url || "/img/page/home/remove_preview.png"}
                  alt="Profile photo"
                  className="h-full w-full rounded-xl bg-cover object-cover"
                />
              </div>

              {/* Secondary photos */}
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={images[1]?.url || "/img/page/home/remove_preview.png"}
                  alt="Full body photo"
                  className="h-full w-full rounded-xl bg-cover object-cover"
                />
                <img
                  src={images[2]?.url || "/img/page/home/remove_preview.png"}
                  alt="Additional photo"
                  className="h-full w-full rounded-xl bg-cover object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mx-auto my-2 max-w-[600px]">
            <Link to={`/user-profile/gallery`}>
              <p className="flex items-center justify-end font-raleway text-base font-semibold underline hover:text-orange-500">
                See more photos
              </p>
            </Link>

            <div className="">
              <h2 className="font-raleway text-2xl font-semibold text-[#F07400]">
                Profile Details
              </h2>
              <div className="my-4 rounded-lg bg-[#505050] p-6">
                <p className="font-raleway text-xl font-normal md:text-2xl">
                  Name : {userProfile.displayName || "Not provided"}
                </p>
                <p className="my-5 font-raleway text-xl font-normal md:text-2xl">
                  Age : {userProfile.age || "Not provided"}
                </p>
                <p className="font-raleway text-xl font-normal md:text-2xl">
                  Height : {userProfile.height || "Not provided"}
                </p>
                <p className="my-5 font-raleway text-xl font-normal md:text-2xl">
                  Body type : {userProfile.bodyType || "Not provided"}
                </p>
                <p className="font-raleway text-xl font-normal md:text-2xl">
                  Area :{" "}
                  {userProfile.area || userProfile.location || "Not provided"}
                </p>
                <p className="my-5 font-raleway text-xl font-normal md:text-2xl">
                  Dealbreakers : {userProfile.dealbreakers || "None specified"}
                </p>
              </div>
            </div>

            <h2 className="mt-10 font-raleway text-xl font-medium">Bio</h2>
            <div className="my-4 rounded-lg bg-[#FFFFFF14]">
              <p className="p-4 font-raleway text-xs font-medium md:text-base">
                {userProfile.bio || "No bio available"}
              </p>
            </div>

            <p className="my-14 text-center font-raleway font-medium md:px-4 md:text-2xl">
              If you’ve read this far and you’re intrigued, don’t overthink it.
              Let’s see what a good conversation might bring.
            </p>

            <h2 className="mb-3 text-center font-raleway text-2xl font-bold md:text-4xl">
              It's not a scam, it's a Scan.
            </h2>

            <Link to={`/user-profile/connect`}>
              <button className="my-8 w-full rounded-lg bg-orange-500 p-2.5 text-base font-semibold text-white transition hover:bg-orange-600 md:my-4">
                Let’s Connect
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
