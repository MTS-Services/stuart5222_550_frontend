import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CardExport from "../../../components/common/CardExport";

import {
  shouldShowTravelMode,
  formatTravelDate,
  getPrimaryArea,
} from "../../../utils/travelMode";
import BioText from "../../../components/common/BioText";
import { buildOrderedImagesFromProfile } from "../../../utils/profileImages";

import { getUserQRcode } from "../../../features/admin/home/dashboardFetch";
import { UserVerifiedProfile } from "../../../features/admin/management/usreFetch";
import { FaRegCalendar } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";
import { FaQrcode } from "react-icons/fa6";
import Modal from "../../../components/ui/Modal";
import CardDetails from "../../../components/common/CardDetails";

const ProfileDetailsView = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const routerLocation = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { list, isLoading, error } = useSelector(
    (state) => state.adminUsers.verified,
  );
  const user = list.find((u) => u.id === Number(userId));
  const user_email = user?.email;

  // Always re-fetch on mount to ensure we have latest data from DB
  useEffect(() => {
    dispatch(UserVerifiedProfile({ page: 1, limit: 200 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when returning from edit profile or when tab regains focus
  useEffect(() => {
    if (routerLocation.state?.refresh) {
      dispatch(UserVerifiedProfile({ page: 1, limit: 200 }));
    }
  }, [routerLocation.state?.refresh, dispatch]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        dispatch(UserVerifiedProfile({ page: 1, limit: 200 }));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [dispatch]);

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
    return (
      <div className="rounded-md border-2 border-dashed border-gray-300 py-20">
        <p colSpan="5" className="text-center">
          No user profiles found.
        </p>
      </div>
    );

  const {
    user: userInfo,
    age,
    height,
    bio,
    image,
    images: structuredImages,
    changedFields,
    displayName,
    bodyType,
    dealbreakers,
    county,
    location,
    startDate,
    endDate,
  } = user;

  const orderedImages = buildOrderedImagesFromProfile(user).map((img, index) => ({
    url: typeof img === "string" ? img : img.url,
    label: index === 0 ? "Face" : index === 1 ? "Full Body" : index === 2 ? "Toothy Grin" : `Extra ${index - 2}`,
    required: index < 3,
  }));

  // Check if a field was changed by the user (for highlighting)
  const isFieldChanged = (fieldName) => {
    return Array.isArray(changedFields) && changedFields.includes(fieldName);
  };

  const handleCardDetailsQR = () => {
    setIsOpen(true);
  };

  const handleCardPreviewQR = () => {
    setOpenModal(true);
  };

  return (
    <div className="space-y-10 p-10 font-raleway text-black">
      {/* Changed Fields Banner */}
      {Array.isArray(changedFields) && changedFields.length > 0 && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="font-raleway font-semibold text-yellow-800">
            ⚠ User has edited their profile. Changed fields:{' '}
            <span className="font-bold">{changedFields.join(', ')}</span>
          </p>
        </div>
      )}

      {/* User Info Section */}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[80px] w-[80px]">
              <img
                className="h-full w-full rounded-full border border-gray-300 object-cover"
                src={orderedImages[0]?.url || image?.[0] || "/img/placeholder.jpg"}
                alt={displayName || userInfo.name || "User"}
              />
            </div>

            <div className="flex flex-col">
              <h3 className="text-base font-medium text-[#252525]">
                {displayName || "No display name"}
              </h3>
              <p className="my-1 text-xs text-gray-500">
                Legal name (private): {userInfo.name}
              </p>
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
            {/* QR Codes Section */}
            <div className="flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleCardDetailsQR}
                className="w-full rounded-lg border bg-orange-500 px-4 py-2 font-semibold text-white transition-transform duration-200 hover:scale-105 focus:outline-none"
              >
                <span>Details QR</span>
              </button>
              <button
                onClick={handleCardPreviewQR}
                className="w-full rounded-lg border bg-orange-500 px-4 py-2 font-semibold text-white transition-transform duration-200 hover:scale-105 focus:outline-none"
              >
                <span>Preview QR</span>
              </button>
              <Link
                to={`/admin/edit-profile/${user_email}`}
                state={{ returnTo: `/admin/user-profile/${userId}` }}
                className="w-full rounded-lg border bg-orange-500 px-4 py-2 text-center font-semibold text-white transition-transform duration-200 hover:scale-105 focus:outline-none"
              >
                Edit Profile
              </Link>
            </div>
            <FaQrcode size={100} className="rounded border p-1" />

            <div>
              <p className={`font-raleway ${isFieldChanged('age') ? 'rounded bg-yellow-100 px-1 font-bold' : ''}`}>
                Age: {age} {isFieldChanged('age') && <span className="ml-1 text-xs text-yellow-600">●</span>}
              </p>
              <p className={`font-raleway ${isFieldChanged('height') ? 'rounded bg-yellow-100 px-1 font-bold' : ''}`}>
                Height: {height} {isFieldChanged('height') && <span className="ml-1 text-xs text-yellow-600">●</span>}
              </p>
              <p className={`font-raleway ${isFieldChanged('bodyType') ? 'rounded bg-yellow-100 px-1 font-bold' : ''}`}>
                Body type: {bodyType} {isFieldChanged('bodyType') && <span className="ml-1 text-xs text-yellow-600">●</span>}
              </p>
              <p className={`font-raleway ${isFieldChanged('county') ? 'rounded bg-yellow-100 px-1 font-bold' : ''}`}>
                Primary area: {getPrimaryArea(user)} {isFieldChanged('county') && <span className="ml-1 text-xs text-yellow-600">●</span>}
              </p>
              <p className={`font-raleway ${isFieldChanged('dealbreakers') ? 'rounded bg-yellow-100 px-1 font-bold' : ''}`}>
                Dealbreakers: {dealbreakers} {isFieldChanged('dealbreakers') && <span className="ml-1 text-xs text-yellow-600">●</span>}
              </p>
            </div>
          </div>
        </div>

        {/* QR Card Modal */}
        <Modal
          size="lx"
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Preview & Export QR Card"
        >
          <div className="flex h-[650px] justify-center overflow-auto bg-slate-100">
            <CardExport user={user} />
          </div>
        </Modal>

        <Modal
          size="lx"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Details QR & Statistics "
        >
          <div className="flex h-[650px] justify-center overflow-auto bg-slate-100">
            <CardDetails user={user} />
          </div>
        </Modal>

        <div className="mt-4">
          <h2 className="my-4 font-raleway text-2xl font-semibold text-black">
            Bio
            {isFieldChanged('bio') && (
              <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">UPDATED</span>
            )}
          </h2>
          <BioText bio={bio} className="font-raleway text-base" />
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
        <h3 className="mb-5 font-raleway text-2xl font-bold">
          Images
          {isFieldChanged('image') && (
            <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">UPDATED</span>
          )}
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {orderedImages.map((item, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <div className="mb-1">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${item.required ? 'bg-orange-500' : 'bg-gray-500'}`}>
                  {item.label}
                </span>
              </div>
              <img
                src={item.url}
                alt={item.label}
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
