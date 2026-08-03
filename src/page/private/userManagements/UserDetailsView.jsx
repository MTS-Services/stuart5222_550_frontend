import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
  adminUserDraftProfile,
} from "../../../features/admin/management/usreFetch";
import {
  shouldShowTravelMode,
  formatTravelDate,
  getPrimaryArea,
} from "../../../utils/travelMode";
import BioText from "../../../components/common/BioText";
import { buildOrderedImagesFromProfile } from "../../../utils/profileImages";
import { GrLocation } from "react-icons/gr";
import { FaRegCalendar } from "react-icons/fa";

const UserDetailsView = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const routerLocation = useLocation();
  const dispatch = useDispatch();
  const { userProfiles, isLoading, error } = useSelector(
    (state) => state.adminUsers,
  );

  // Re-fetch on mount and when returning from edit profile
  useEffect(() => {
    dispatch(adminUserDraftProfile({ page: 1, limit: 200 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (routerLocation.state?.refresh) {
      dispatch(adminUserDraftProfile({ page: 1, limit: 200 }));
    }
  }, [routerLocation.state?.refresh, dispatch]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        dispatch(adminUserDraftProfile({ page: 1, limit: 200 }));
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [dispatch]);

  const user = userProfiles?.find((u) => u.id === Number(userId));
  const [rejectionRe, setRejectionRe] = useState("");
  const [loading, setLoading] = useState({ approve: false, reject: false });

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  if (error)
    return <div className="pt-10 text-center text-red-600">Error: {error}</div>;

  if (!user)
    return <div className="pt-10 text-center"> User Details not found!</div>;

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
    rejectionReason,
    rejectionHistory,
    reviewedAt,
  } = user;

  const rejectionEntries = Array.isArray(rejectionHistory) && rejectionHistory.length > 0
    ? [...rejectionHistory].reverse()
    : rejectionReason
      ? [{ reason: rejectionReason, reviewedAt }]
      : [];

  const formatRejectionDateTime = (dateString) => {
    if (!dateString) return "Date unknown";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Build ordered image list with structured JSON + imageUrls fallback
  const orderedImages = buildOrderedImagesFromProfile(user).map((img, index) => ({
    url: typeof img === "string" ? img : img.url,
    label: `Photo ${index + 1}`,
    required: index < 3,
  }));

  // Check if a field was changed by the user (for highlighting)
  const isFieldChanged = (fieldName) => {
    return Array.isArray(changedFields) && changedFields.includes(fieldName);
  };

  // ✅ Approve
  const handleApprove = async () => {
    setLoading({ approve: true, reject: false });
    try {
      await dispatch(adminUserApprovedProfile({ id: user.id })).unwrap();
      toast.success("User approved!");
      setTimeout(() => {
        navigate("/admin/user-management");
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Approval failed");
    } finally {
      setLoading({ approve: false, reject: false });
    }
  };

  // ❌ Reject
  const handleReject = async () => {
    if (!rejectionRe.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    setLoading({ approve: false, reject: true });
    try {
      await dispatch(
        adminUserRejectedProfile({
          id: user.id,
          reason: rejectionRe.trim(),
        }),
      ).unwrap();
      toast.success("User rejected!");
      setRejectionRe("");
      setTimeout(() => {
        navigate("/admin/user-management");
      }, 1000);
    } catch (err) {
      toast.error(err.message || "Rejection failed");
    } finally {
      setLoading({ approve: false, reject: false });
    }
  };

  const handleCencel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-8 p-10 font-raleway text-black">
      {/* Changed Fields Banner */}
      {Array.isArray(changedFields) && changedFields.length > 0 && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="font-raleway font-semibold text-yellow-800">
            ⚠ User has edited their profile. Changed fields:{' '}
            <span className="font-bold">{changedFields.join(', ')}</span>
          </p>
        </div>
      )}

      {/* User Info */}
      <div className="">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="h-[80px] w-[80px]">
              <img
                src={orderedImages[0]?.url || image?.[0] || "/img/placeholder.jpg"}
                alt={displayName || userInfo.name || "User"}
                className="h-full w-full rounded-full border object-cover"
                onError={(e) => (e.target.src = "/img/placeholder.jpg")}
              />
            </div>

            <div>
              <h3 className="font-raleway text-base font-medium text-[#252525]">
                {displayName || "No display name"}
              </h3>
              <p className="my-1 text-xs text-gray-500">
                Legal name (private): {userInfo.name}
              </p>
              <p className="my-1.5 font-lato text-sm text-[#242424]">
                {userInfo.email}
              </p>
              <p className="font-raleway text-xs text-[#464646]">
                {userInfo.phone}
              </p>
              <p className="flex items-center gap-2 font-raleway">
                Status:
                <span
                  className={`rounded-full px-2 py-1 font-raleway text-xs font-bold text-white ${user.status === "DRAFT" ? "bg-yellow-400" : "bg-red-500"}`}
                >
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 space-y-1">
            <Link
              to={`/admin/edit-profile/${userInfo.email}`}
              state={{ returnTo: `/admin/user-management/${userId}` }}
              className="rounded-lg border bg-orange-500 px-3 py-2 text-center font-semibold text-white transition-transform duration-200 hover:scale-105 hover:bg-orange-600 focus:outline-none"
            >
              Edit Profile
            </Link>
            <div className="flex h-[130px] w-[150px] items-center justify-center rounded-lg border border-red-50 bg-white font-medium text-gray-500">
              No QR Available!
            </div>
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

        <div className="mt-6">
          <h2 className="my-4 font-raleway text-2xl font-semibold">
            Bio
            {isFieldChanged('bio') && (
              <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">UPDATED</span>
            )}
          </h2>
          <BioText bio={bio} className="font-raleway text-base" />
        </div>
      </div>

      {/* Travel Info - Only show if travel data is valid and not expired */}
      {shouldShowTravelMode(user) && (
        <div className="rounded-lg border bg-gradient-to-b from-orange-500/10 to-white p-6">
          <div className="text-xl font-bold text-neutral-800">
            <span className="font-raleway uppercase">I </span>
            <span className="font-raleway lowercase">
              am traveling and will be in:
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <GrLocation size={20} />
              <span className="font-raleway text-xl font-medium">
                Location: {location}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaRegCalendar size={20} />
              <span className="font-raleway text-xl font-medium">
                Start Date: {formatTravelDate(startDate)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaRegCalendar size={20} />
              <span className="font-raleway text-xl font-medium">
                End Date: {formatTravelDate(endDate)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Images */}
      <div>
        <h3 className="mb-5 font-raleway text-2xl font-semibold">
          Images
          {isFieldChanged('image') && (
            <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">UPDATED</span>
          )}
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {orderedImages.map((item, idx) => (
            <div key={idx} className="overflow-hidden rounded-lg">
              <div className="mb-1">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${item.required ? 'bg-orange-500' : 'bg-gray-500'}`}>
                  {item.label}
                </span>
              </div>
              <img
                src={item.url}
                alt={item.label}
                className="h-96 w-96 rounded-lg border border-gray-300 object-cover"
                onError={(e) => (e.target.src = "/img/placeholder.jpg")}
              />
            </div>
          ))}
        </div>
      </div>

      {rejectionEntries.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-8">
          <h3 className="mb-3 font-raleway text-2xl font-semibold text-black">
            Previous Rejection Reason
          </h3>
          <div className="space-y-4">
            {rejectionEntries.map((entry, index) => (
              <div
                key={`${entry.reviewedAt}-${index}`}
                className="rounded border border-gray-100 bg-red-50 p-6"
              >
                <p className="mb-2 font-raleway text-sm font-medium text-gray-600">
                  {formatRejectionDateTime(entry.reviewedAt)}
                </p>
                <p className="font-raleway font-medium text-red-600">
                  {entry.reason || "No reason provided."}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {/* Action Section – NO MODAL */}
      {user.status !== "REJECTED" && (
        <>
          <section className="rounded-lg border border-gray-200 bg-white p-8">
            <h3 className="mb-3 font-raleway text-xl font-medium">
              Reject with Feedback
            </h3>
            <textarea
              value={rejectionRe}
              onChange={(e) => setRejectionRe(e.target.value)}
              placeholder="Write a reason for rejection..."
              className="min-h-[120px] w-full rounded border border-gray-300 bg-[#E6EEF6] p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <div className="mt-4 space-x-4">
              <button
                onClick={handleApprove}
                disabled={loading.approve}
                className={`w-64 flex-1 rounded py-2.5 font-raleway font-medium ${
                  loading.approve
                    ? "cursor-not-allowed bg-green-400"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loading.approve ? "Approving..." : "Approve"}
              </button>

              <button
                onClick={handleReject}
                disabled={loading.reject}
                className={`w-64 flex-1 rounded py-2.5 font-raleway font-medium ${
                  loading.reject
                    ? "cursor-not-allowed bg-orange-400"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {loading.reject ? "Rejecting..." : "Reject"}
              </button>

              <button
                onClick={handleCencel}
                className={`w-64 flex-1 rounded bg-red-500 py-2.5 font-raleway font-medium text-white hover:bg-orange-600`}
              >
                Cancel
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default UserDetailsView;
