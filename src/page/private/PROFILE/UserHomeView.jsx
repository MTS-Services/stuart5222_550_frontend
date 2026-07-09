import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUserProfile,
  rejectedProfile,
} from "../../../features/public/profile/profileFetch";
import ProfileInfoView from "./components/ProfileInfoView";
import { updateUser } from "../../../features/auth/authSlice";
import { GET } from "../../../config/api/httpMethods";
import { endpoints } from "../../../config/api/httpEndpoint";
import { FaPowerOff, FaUser } from "react-icons/fa";
import { AUTH_COOKIE } from "../../../utils/authCookie";
import { buildOrderedImagesFromProfile } from "../../../utils/profileImages";

const formatRejectionDateTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const UserHomeView = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const rejectionReason = user?.profile?.rejectionReason;
  const rejectionHistory = Array.isArray(user?.profile?.rejectionHistory)
    ? user.profile.rejectionHistory
    : [];
  const isVerified = user?.status === "VERIFIED";
  const isProfileDeactivated = user?.profile?.isActive === false;
  const images = buildOrderedImagesFromProfile(userProfile);

  const email = user?.email;
  const userId = user?.id;

  useEffect(() => {
    // Only fetch profile data when user is VERIFIED — non-verified users have no profile record yet
    if (email && isVerified) {
      dispatch(fetchUserProfile({ userMail: email }));
    }

    // Only fetch rejection reason when user is in PAID_SETUP (rejected state)
    if (userId && user?.status === "PAID_SETUP") {
      dispatch(rejectedProfile({ id: userId }));
    }

    // Fetch latest user data to ensure status is current
    const fetchUserData = async () => {
      try {
        const response = await GET(endpoints.user.USER_PROFILE);
        if (response?.data) {
          dispatch(updateUser(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch, email, userId, isVerified, user?.status]);

  const handleLogout = () => {
    AUTH_COOKIE.remove();
    window.location.href = "/auth/login";
  };

  const getStatusName = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Profile Setup";
      case "PAID_SETUP":
        return "Edit Profile";
      case "PROFILE_PENDING":
        return "Pending Approval";
      default:
        return "Unknown Status";
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-[#3B3B3D] px-4 py-4 text-white">
      {isVerified && isProfileDeactivated ? (
        <div className="flex min-h-screen items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-red-500/30 bg-slate-800/10 p-8 shadow">
              {/* User Email Badge */}
              <div className="mb-6 flex items-center justify-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-700/50 px-4 py-2">
                  <svg
                    className="h-4 w-4 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-200">
                    {user?.email}
                  </span>
                </div>
              </div>

              {/* Deactivated Icon */}
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                  <svg
                    className="h-10 w-10 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
              </div>

              {/* Deactivated Message */}
              <div className="mb-8 text-center">
                <h2 className="mb-3 text-xl font-bold text-red-400">
                  Account Deactivated
                </h2>
                <p className="text-sm leading-relaxed text-slate-400">
                  Your account has been deactivated by an administrator. Your
                  profile is not publicly visible and QR card scanning is
                  disabled.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  If you believe this is a mistake, please contact support for
                  assistance.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="font-medium text-red-400">
                  Profile Status: Deactivated
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-slate-800/10 px-3 py-2 text-sm text-orange-400 shadow hover:bg-slate-700/20 hover:text-orange-300"
              >
                <FaPowerOff /> Logout
              </button>
            </div>
          </div>
        </div>
      ) : isVerified ? (
        <>
          <ProfileInfoView profileData={userProfile} images={images} editUrl={`/user/edit-profile/${user?.email}`} />
        </>
      ) : (
        <div className="flex min-h-screen w-full items-start justify-center py-10">
          <div className="w-full max-w-md">
            {/* Status Card */}
            {user.status === "PAID_SETUP" && (rejectionHistory.length > 0 || rejectionReason) && (
              <div className="mb-4 space-y-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <h4 className="text-xl">You are rejected!</h4>
                <hr className="border-gray-500" />
                <h4 className="text-lg font-semibold">Previous rejection feedback:</h4>
                <div className="space-y-3">
                  {rejectionHistory.length > 0 ? (
                    [...rejectionHistory].reverse().map((entry, index) => (
                      <div key={`${entry.reviewedAt}-${index}`} className="rounded-lg bg-red-500/10 p-3">
                        <p className="text-xs text-red-300">{formatRejectionDateTime(entry.reviewedAt)}</p>
                        <p className="mt-1">{entry.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p>{rejectionReason}</p>
                  )}
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-orange-500/30 bg-slate-800/10 p-8 shadow">
              {/* User Email Badge */}
              <div className="mb-6 flex items-center justify-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-700/50 px-4 py-2">
                  <svg
                    className="h-4 w-4 text-orange-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-200">
                    {user?.email}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <div
                  className={`h-3 w-3 animate-pulse rounded-full ${
                    user?.status === "ACTIVE"
                      ? "bg-green-500"
                      : user?.status === "PAID_SETUP"
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-sm font-medium text-slate-400">
                  Status:{" "}
                  <span className="font-semibold text-slate-300">
                    {getStatusName(user?.status)}
                  </span>
                </span>
              </div>

              {/* Main Message */}
              <div className="mb-8 text-center">
                <h2 className="mb-3 text-lg font-bold text-white">
                  Profile Verification Required
                </h2>
                <p className="text-sm leading-relaxed text-slate-400">
                  Your profile status is currently{" "}
                  <span className="font-semibold text-orange-400">
                    {getStatusName(user?.status)}
                  </span>
                  .
                  <br />
                  You'll gain full access once verification is complete.
                </p>
              </div>

              {/* Action Section */}
              <div className="space-y-4">
                {/* ACTIVE Status */}
                {user?.status === "ACTIVE" && (
                  <Link
                    to={`/user/setup-profile/${user?.email}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-400"
                  >
                    <FaUser className="h-5 w-5" />
                    Setup Your Profile
                  </Link>
                )}

                {/* PAID_SETUP Status */}
                {user?.status === "PAID_SETUP" && (
                  <Link
                    to={`/user/edit-profile/${user?.email}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-400"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Your Profile
                  </Link>
                )}

                {/* Pending Approval */}
                {user?.status !== "ACTIVE" && user?.status !== "PAID_SETUP" && (
                  <div className="flex items-center justify-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <svg
                      className="h-5 w-5 animate-spin text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium text-yellow-400">
                      Please wait for admin approval
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-slate-800/10 px-3 py-2 text-sm text-orange-400 shadow hover:bg-slate-700/20 hover:text-orange-300"
              >
                <FaPowerOff /> Logout
              </button>
            </div>

            {/* Progress Steps */}
            {/* <div className="mt-8 flex items-center justify-around px-4">
              {["ACTIVE", "PROFILE_PENDING", "PAID_SETUP", "VERIFIED"].map(
                (status, index, array) => (
                  <div key={status} className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        user?.status === status
                          ? "scale-110 bg-orange-500 text-white shadow"
                          : index < array.indexOf(user?.status)
                            ? "bg-green-500 text-white"
                            : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {index < array.indexOf(user?.status) ? "✓" : index + 1}
                    </div>
                    <span className="mt-2 whitespace-nowrap text-xs capitalize text-slate-200">
                      {status.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                ),
              )}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomeView;
