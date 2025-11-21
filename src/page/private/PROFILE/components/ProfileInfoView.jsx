import React, { useState, useRef, useEffect } from "react";
import {
  FaPowerOff,
  FaRegCalendar,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { AUTH_COOKIE } from "../../../../utils/authCookie";
import { shouldShowTravelMode } from "../../../../utils/travelMode";

const ProfileInfoView = ({ profileData, images }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState(3);
  const photosContainerRef = useRef(null);

  const {
    email,
    age,
    height,
    bio,
    location,
    bodyType,
    displayName,
    dealbreakers,
    startDate,
    endDate,
    area,
  } = profileData || {};

  // Format date for better readability
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    AUTH_COOKIE.remove();
    window.location.href = "/auth/login";
  };

  const handleLoadMore = () => {
    if (isExpanding) return; // Prevent multiple clicks during animation

    setIsExpanding(true);

    if (!showAllPhotos) {
      // Show more photos with smooth reveal
      setShowAllPhotos(true);
      setTimeout(() => {
        if (images?.length > 3) {
          setVisiblePhotos(Math.min(images.length, visiblePhotos + 3));
        }
        setIsExpanding(false);
      }, 150);
    } else {
      // Collapse photos
      setVisiblePhotos(3);
      setShowAllPhotos(false);
      setIsExpanding(false);

      // Smooth scroll back to photos section
      if (photosContainerRef.current) {
        photosContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  // Get displayed images based on current state
  const displayedImages = images?.slice(0, visiblePhotos) || [];
  const hasMorePhotos = images?.length > 3;
  const canLoadMore = visiblePhotos < images?.length;

  if (!profileData && images) {
    return (
      <div className="p-6 text-center text-gray-200">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-gray-300"></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[600px] p-6">
      <div className="my-8 flex items-center justify-center">
        <img
          src="/img/assets/logo.png"
          alt="preview"
          className="h-24 w-36 object-cover"
        />
      </div>
      {/* Profile Header */}
      <div className="mb-8 rounded-xl border border-gray-500/50 bg-gray-800/30 p-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Profile Card */}
          <div className="flex items-center gap-4 rounded-2xl">
            <div className="relative">
              <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-orange-400">
                <img
                  className="h-full w-full object-cover"
                  src={images[0]?.url || "/img/page/public/img1.png"}
                  alt={displayName || "User"}
                />
              </div>
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-gray-900 bg-green-500" />
            </div>

            <div>
              <p className="max-w-[180px] truncate text-xl font-semibold text-white">
                {displayName}
              </p>
              <p className="max-w-[180px] truncate text-sm text-gray-400">
                {email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/70 p-3 text-gray-300 backdrop-blur-sm transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400"
            aria-label="Logout"
          >
            <FaPowerOff className="text-lg group-hover:animate-pulse" />
          </button>
        </div>
      </div>

      {shouldShowTravelMode(profileData) && (
        <div className="flex w-full items-center justify-center text-center">
          <div className="my-6 w-[600px] overflow-hidden rounded-lg border-l border-t border-orange-500 bg-gradient-to-b from-orange-500/10 to-white/0 p-8 shadow-md">
            {/* Content */}
            <h2 className="mb-[21px] text-start font-raleway text-xl font-bold text-gray-100 md:text-[32px]">
              I am traveling and will be in:
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-raleway text-orange-600">
                  <FaRegCalendar size={20} />
                </span>
                <div className="text-start">
                  <p className="font-raleway text-xl font-medium text-gray-300">
                    Start-Date: {formatDate(startDate)}
                  </p>
                  <p className="font-raleway text-xl font-medium text-gray-300">
                    End-Date: {formatDate(endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-start">
                <span className="font-raleway text-xl text-orange-600">
                  <GrLocation size={20} />
                </span>
                <p className="font-raleway text-xl font-medium text-gray-300">
                  Location: {location}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photos Section */}
      <div ref={photosContainerRef} className="flex flex-col gap-5">
        {/* Main photo */}

        <div className="rounded-xl border border-gray-400/50">
          <img
            src={displayedImages[0]?.url || "/img/page/home/remove_preview.png"}
            alt="Profile photo"
            className="h-full w-full bg-cover object-cover"
          />
        </div>

        {/* Secondary photos grid */}
        <div className="grid grid-cols-2 gap-4">
          {displayedImages.slice(1, 3).map((image, index) => (
            <div
              key={`secondary-${index}`}
              className="group relative overflow-hidden rounded-xl border border-gray-400/50 transition-all duration-300 hover:border-orange-500/50"
            >
              <img
                src={image?.url || "/img/page/home/remove_preview.png"}
                alt={`Photo ${index + 2}`}
                className="h-full w-full bg-cover object-cover"
              />
            </div>
          ))}
        </div>

        {/* Additional photos (revealed on load more) */}
        {showAllPhotos && displayedImages.length > 3 && (
          <div
            className={`grid gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
              isExpanding ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
            } ${displayedImages.length > 6 ? "grid-cols-3" : "grid-cols-2"}`}
            style={{
              transform: isExpanding ? "translateY(-20px)" : "translateY(0)",
            }}
          >
            {displayedImages.slice(3).map((image, index) => (
              <div
                key={`additional-${index}`}
                className="group relative overflow-hidden rounded-xl border border-gray-400/50 transition-all duration-300 hover:border-orange-500/50"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: !isExpanding
                    ? "slideInUp 0.6s ease-out forwards"
                    : "none",
                }}
              >
                <img
                  src={image?.url || "/img/page/home/remove_preview.png"}
                  alt={`Additional photo ${index + 4}`}
                  className="h-full w-full bg-cover object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More / Show Less Button */}
        {hasMorePhotos && (
          <button
            onClick={handleLoadMore}
            disabled={isExpanding}
            className="text-right underline"
          >
            {!showAllPhotos
              ? `See ${Math.min(3, (images?.length || 0) - 3)} more photos`
              : canLoadMore
                ? `Load ${Math.min(3, (images?.length || 0) - visiblePhotos)} more`
                : "Show less photos"}
          </button>
        )}
      </div>

      <div className="">
        <h2 className="font-raleway text-2xl font-semibold text-[#F07400]">
          Profile Details
        </h2>
        <div className="my-4 rounded-lg bg-[#505050] p-6">
          <p className="font-raleway text-xl font-normal">
            Name : {displayName || "Not provided"}
          </p>
          <p className="my-5 font-raleway text-xl font-normal">
            Age : {age || "Not provided"}
          </p>
          <p className="font-raleway text-xl font-normal">
            Height : {height || "Not provided"}
          </p>
          <p className="my-5 font-raleway text-xl font-normal">
            Body type : {bodyType || "Not provided"}
          </p>
          <p className="font-raleway text-xl font-normal">
            Area : {area || location || "Not provided"}
          </p>
          <p className="my-5 font-raleway text-xl font-normal">
            Dealbreakers : {dealbreakers || "None specified"}
          </p>
        </div>
      </div>
      <h2 className="mt-10 font-raleway text-xl font-medium">Bio</h2>
      <div className="my-4 rounded-lg bg-[#FFFFFF14]">
        <p className="p-4 font-raleway text-xs font-medium md:text-base">
          {bio || "No bio available"}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfoView;

// Add these styles to your global CSS or as a styled component
// @keyframes slideInUp {
//   from {
//     opacity: 0;
//     transform: translateY(30px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

{
  /* Date Information */
}
{
  // <div className="mb-8 flex w-full items-center justify-center text-center">
  //   <div className="my-6 w-[600px] overflow-hidden rounded-lg border-l border-t border-orange-500 bg-gradient-to-b from-orange-500/10 to-white/0 p-8 shadow-md">
  //     {/* Content */}
  //     <h2 className="mb-[21px] text-start font-raleway text-xl font-bold text-gray-100 md:text-[32px]">
  //       I am traveling and will be in:
  //     </h2>
  //     <div className="space-y-4">
  //       <div className="flex items-center gap-4">
  //         <span className="font-raleway text-orange-600">
  //           <FaRegCalendar size={20} />
  //         </span>
  //         <div className="text-start">
  //           <p className="font-raleway text-xl font-medium text-gray-300">
  //             Start-Date: {formatDate(startDate)}
  //           </p>
  //           <p className="font-raleway text-xl font-medium text-gray-300">
  //             End-Date: {formatDate(endDate)}
  //           </p>
  //         </div>
  //       </div>
  //       <div className="flex items-center gap-4 text-start">
  //         <span className="font-raleway text-xl text-orange-600">
  //           <GrLocation size={20} />
  //         </span>
  //         <p className="font-raleway text-xl font-medium text-gray-300">
  //           Location: {location}
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // </div>;
}

{
  /* Basic Information */
}
{
  /* <div className="mb-8 rounded-lg border-l border-orange-500 p-6 text-white shadow-md">
  <h2 className="mb-4 text-xl font-semibold text-gray-200">
    Basic Information
  </h2>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">User ID</label>
      <span className="text-gray-200">{userId}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Age</label>
      <span className="text-gray-200">{age} years</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Birth</label>
      <span className="text-gray-200">
        Month {birthMonth}, {birthYear}
      </span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Height</label>
      <span className="text-gray-200">{height}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Body Type</label>
      <span className="text-gray-200">{bodyType}</span>
    </div>
  </div>
</div>; */
}

{
  /* Contact Information */
}
{
  /* <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
  <h2 className="mb-4 text-xl font-semibold text-gray-200">
    Contact Information
  </h2>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Email</label>
      <span className="break-all text-gray-200">{email}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Phone</label>
      <span className="text-gray-200">{phone}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Gmail</label>
      <span className="text-gray-200">{gmail || "Not provided"}</span>
    </div>
  </div>
</div>; */
}

{
  /* Location Information */
}
{
  /* <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
  <h2 className="mb-4 text-xl font-semibold text-gray-200">Location</h2>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Location</label>
      <span className="text-gray-200">{location}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">County</label>
      <span className="capitalize text-gray-200">{county}</span>
    </div>
  </div>
</div>; */
}

{
  /* Bio Section */
}
{
  /* <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
  <h2 className="mb-4 text-xl font-semibold text-gray-200">About</h2>
  <div className="">
    <p className="whitespace-pre-line leading-relaxed text-gray-200">{bio}</p>
  </div>
</div>; */
}

{
  /* Dealbreakers */
}
{
  // dealbreakers && dealbreakers !== "None-Somoker" && (
  //   <div className="mb-8 rounded-lg border-l-4 border-red-500 bg-gray-50 p-6">
  //     <h2 className="mb-4 text-xl font-semibold text-gray-200">Dealbreakers</h2>
  //     <div className="rounded border border-gray-200 bg-white p-4">
  //       <p className="text-gray-200">{dealbreakers}</p>
  //     </div>
  //   </div>
  // );
}

{
  /* System Information */
}
{
  /* <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
  <h2 className="mb-4 text-xl font-semibold text-gray-200">
    System Information
  </h2>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Profile ID</label>
      <span className="font-mono text-gray-200">{id}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Created</label>
      <span className="text-gray-200">{formatDate(createdAt)}</span>
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-100">Last Updated</label>
      <span className="text-gray-200">{formatDate(updatedAt)}</span>
    </div>
  </div>
</div>; */
}
