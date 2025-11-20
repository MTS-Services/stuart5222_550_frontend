import React from "react";
import { FaPowerOff, FaRegCalendar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { AUTH_COOKIE } from "../../../../utils/authCookie";

const ProfileInfoView = ({ profileData, images }) => {
  if (!profileData) {
    return <div className="p-4 text-gray-100">Loading profile data...</div>;
  }

  const {
    id,
    userId,
    email,
    age,
    birthMonth,
    birthYear,
    height,
    bio,
    location,
    bodyType,
    county,
    displayName,
    phone,
    gmail,
    dealbreakers,
    startDate,
    endDate,
    photoCount,
    createdAt,
    updatedAt,
  } = profileData;

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

  return (
    <div className="mx-auto max-w-[600px] p-6">
      <div className="flex justify-center py-[40px]">
        <div className="flex flex-col items-center text-center">
          <img
            src="/img/assets/logo.png"
            alt="preview"
            className="h-24 w-36 object-cover"
          />

          <div className="flex items-center justify-between text-center">
            <div className="mt-4 h-[80px] w-[80px] overflow-hidden rounded-full border-2 border-orange-500">
              <img
                className="h-full w-full rounded-full object-cover"
                src={images[0]?.url || "/img/page/public/img1.png"}
                alt={displayName || "User"}
              />
            </div>
          </div>
          <h1 className="pt-4 font-raleway text-3xl font-bold text-gray-100">
            {displayName}
          </h1>
          <button
            onClick={handleLogout}
            className="mt-8 rounded-full bg-red-50 p-2.5 transition hover:bg-red-100"
          >
            <FaPowerOff className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Date Information */}
      {
        <div className="mb-8 flex w-full items-center justify-center text-center">
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
      }

      {/* Basic Information */}
      <div className="mb-8 rounded-lg border-l border-orange-500 p-6 text-white shadow-md">
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
            <label className="text-sm font-medium text-gray-100">
              Body Type
            </label>
            <span className="text-gray-200">{bodyType}</span>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
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
      </div>

      {/* Location Information */}
      <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-200">Location</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-100">
              Location
            </label>
            <span className="text-gray-200">{location}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-100">County</label>
            <span className="capitalize text-gray-200">{county}</span>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-200">About</h2>
        <div className="">
          <p className="whitespace-pre-line leading-relaxed text-gray-200">
            {bio}
          </p>
        </div>
      </div>

      {/* Dealbreakers */}
      {dealbreakers && dealbreakers !== "None-Somoker" && (
        <div className="mb-8 rounded-lg border-l-4 border-red-500 bg-gray-50 p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-200">
            Dealbreakers
          </h2>
          <div className="rounded border border-gray-200 bg-white p-4">
            <p className="text-gray-200">{dealbreakers}</p>
          </div>
        </div>
      )}

      {/* Photos Section */}
      <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-200">
          Photos ({photoCount})
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
            >
              <img
                src={image.url}
                alt={`${displayName} ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="mb-8 rounded-lg border-l border-orange-500 p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-200">
          System Information
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-100">
              Profile ID
            </label>
            <span className="font-mono text-gray-200">{id}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-100">Created</label>
            <span className="text-gray-200">{formatDate(createdAt)}</span>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-100">
              Last Updated
            </label>
            <span className="text-gray-200">{formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoView;
