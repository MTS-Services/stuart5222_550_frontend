import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QRCard from "../../../components/common/QRCard";

import {
  shouldShowTravelMode,
  formatTravelDate,
} from "../../../utils/travelMode";

import { getUserQRcode } from "../../../features/admin/home/dashboardFetch";
import { FaRegCalendar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

const ProfileDetailsView = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { qrCodeList, isQrLoading } = useSelector((state) => state.dashboard);
  const { list, isLoading, error } = useSelector(
    (state) => state.adminUsers.verified,
  );

  const user = list.find((u) => u.id === Number(userId));

  const user_email = user?.email;

  useEffect(() => {
    if (user_email) {
      dispatch(getUserQRcode(user_email));
    }
  }, [dispatch, user_email]);

  if (isLoading)
    return <div className="mx-auto justify-center">Loading...</div>;
  if (error)
    return <div className="mx-auto justify-center">Error: {error}</div>;
  if (!user)
    return <div className="pt-10 text-center">User Edit not found!</div>;

  const {
    user: userInfo,
    age,
    height,
    bio,
    image,
    bodyType,
    dealbreakers,
    location,
    startDate,
    endDate,
  } = user;

  return (
    <div className="space-y-10 p-10 font-raleway text-black">
      {/* User Info Section */}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[80px] w-[80px]">
              <img
                className="h-full w-full rounded-full border border-gray-300 object-cover"
                src={image[0]}
                alt={userInfo.name || "User"}
              />
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-medium text-[#252525]">
                {userInfo.name}
              </h3>
              <p className="my-1.5 text-sm text-[#242424]">{userInfo.email}</p>
              <p className="text-xs text-[#464646]">{userInfo.phone}</p>
              <p>
                Status:{" "}
                <span className="rounded-full bg-green-400 px-2 py-1 font-raleway text-xs font-bold text-white">
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 space-y-1 text-[#404040]">
            <div>
              {/* QR Codes Section */}
              {isQrLoading ? (
                <div className="flex h-[140px] w-[150px] items-center justify-center rounded-lg border border-gray-300 text-gray-500">
                  Loading...
                </div>
              ) : qrCodeList && qrCodeList.length > 0 ? (
                qrCodeList.map((card) => (
                  <QRCard
                    key={card.id}
                    qrCode={card.qrCode}
                    userInfo={card.profile}
                    scanCount={card.scanCount}
                    maxScans={card.maxScans}
                  />
                ))
              ) : (
                <div className="flex h-[140px] w-[150px] items-center justify-center rounded-lg border border-gray-300 text-gray-500">
                  No QR Cards
                </div>
              )}
            </div>

            <div>
              <p className="font-raleway">Age: {age}</p>
              <p className="font-raleway">Height: {height}</p>
              <p className="font-raleway">Body type: {bodyType}</p>
              <p className="font-raleway">Dealbreakers: {dealbreakers}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="my-4 font-raleway text-2xl font-semibold text-black">
            Bio
          </h2>
          {bio ? (
            Array.isArray(bio) ? (
              bio.map((paragraph, idx) => (
                <p key={idx} className="my-2 font-raleway text-base">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="font-raleway text-base">{bio}</p>
            )
          ) : (
            <p>No bio available</p>
          )}
        </div>
      </div>

      {/* Traveling Component - Only show if travel data is valid and not expired */}
      {shouldShowTravelMode(user) && (
        <div className="flex flex-col gap-6 rounded-lg border bg-gradient-to-b from-orange-500/10 to-white p-6">
          <div className="text-xl font-bold text-neutral-800">
            <span className="font-raleway uppercase">I</span>
            <span className="font-raleway lowercase">
              am traveling and will be in:
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Location */}
            <div className="flex items-center gap-3">
              <GrLocation size={20} />
              <span className="font-raleway text-xl font-medium text-neutral-800">
                Location: {location}
              </span>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-3">
              <FaRegCalendar size={20} />
              <span className="font-raleway text-xl font-medium text-neutral-800">
                Start-Date: {formatTravelDate(startDate)}
              </span>
            </div>

            {/* End Date */}
            <div className="flex items-center gap-3">
              <FaRegCalendar size={20} />
              <span className="font-raleway text-xl font-medium text-neutral-800">
                End-Date: {formatTravelDate(endDate)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      <div className="pt-4">
        <h3 className="mb-5 font-raleway text-2xl font-bold">Images</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {image.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <img
                src={img}
                alt={`Image ${index + 1}`}
                className="h-96 w-96 rounded-lg border border-gray-300 bg-yellow-200 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
    </div>
  );
};

export default ProfileDetailsView;
