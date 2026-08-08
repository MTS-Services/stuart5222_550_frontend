import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchAllUserById } from "../../../features/admin/all-user/allUserFetch";
import {
  adminApprove,
  adminReject,
  adminUserApprovedProfile,
  adminUserRejectedProfile,
  toggleProfileActive,
} from "../../../features/admin/management/usreFetch";
import {
  shouldShowTravelMode,
  formatTravelDate,
  getPrimaryArea,
} from "../../../utils/travelMode";
import BioText from "../../../components/common/BioText";
import { buildOrderedImagesFromProfile } from "../../../utils/profileImages";
import {
  formatUserStatusLabel,
  getUserStatusColor,
  splitLegalName,
} from "../../../utils/userStatus";
import { GrLocation } from "react-icons/gr";
import { FaRegCalendar } from "react-icons/fa";

const AllUserDetailsView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const dispatch = useDispatch();

  const { selectedUser, detailLoading, detailError } = useSelector(
    (state) => state.userList,
  );

  const [rejectionReason, setRejectionReason] = useState("");
  const [brokenImages, setBrokenImages] = useState({});
  const [loading, setLoading] = useState({
    approveProfile: false,
    rejectProfile: false,
    approveWaitlist: false,
    rejectWaitlist: false,
    toggleActive: false,
  });

  const loadUser = () => {
    if (userId) return dispatch(fetchAllUserById(userId));
    return null;
  };

  useEffect(() => {
    setBrokenImages({});
    const request = loadUser();
    return () => {
      request?.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (routerLocation.state?.refresh) {
      const request = loadUser();
      return () => {
        request?.abort?.();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.state?.refresh]);

  // Initial load only — keep current content visible while refetching (avoids photo flicker)
  if (detailLoading && !selectedUser) {
    return <div className="p-10 text-center font-raleway">Loading...</div>;
  }

  if (detailError && !selectedUser) {
    return (
      <div className="p-10 text-center font-raleway text-red-600">
        Error: {detailError}
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="p-10 text-center font-raleway">User not found.</div>
    );
  }

  const user = selectedUser;
  const profile = user.profile;
  const { firstName, lastName } = splitLegalName(user.name);

  const orderedImages = profile
    ? buildOrderedImagesFromProfile(profile)
        .map((img, index) => ({
          url: typeof img === "string" ? img : img?.url,
          label: `Photo ${index + 1}`,
          required: index < 3,
        }))
        .filter((item) => typeof item.url === "string" && item.url.trim())
    : [];

  const markBroken = (key) => {
    setBrokenImages((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  const rejectionEntries =
    profile &&
    Array.isArray(profile.rejectionHistory) &&
    profile.rejectionHistory.length > 0
      ? [...profile.rejectionHistory].reverse()
      : profile?.rejectionReason
        ? [{ reason: profile.rejectionReason, reviewedAt: profile.reviewedAt }]
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

  const canReviewProfile = profile?.status === "DRAFT";
  const canEditProfile = Boolean(profile);
  const isWaitlist = user.status === "WAITLIST";

  const handleApproveProfile = async () => {
    if (!profile?.id) return;
    setLoading((s) => ({ ...s, approveProfile: true }));
    try {
      await dispatch(adminUserApprovedProfile({ id: profile.id })).unwrap();
      toast.success("Profile approved!");
      loadUser();
    } catch (err) {
      toast.error(err?.message || err || "Approval failed");
    } finally {
      setLoading((s) => ({ ...s, approveProfile: false }));
    }
  };

  const handleRejectProfile = async () => {
    if (!profile?.id) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }
    setLoading((s) => ({ ...s, rejectProfile: true }));
    try {
      await dispatch(
        adminUserRejectedProfile({
          id: profile.id,
          reason: rejectionReason.trim(),
        }),
      ).unwrap();
      toast.success("Profile rejected — user moved to Needs Edits");
      setRejectionReason("");
      loadUser();
    } catch (err) {
      toast.error(err?.message || err || "Rejection failed");
    } finally {
      setLoading((s) => ({ ...s, rejectProfile: false }));
    }
  };

  const handleApproveWaitlist = async () => {
    setLoading((s) => ({ ...s, approveWaitlist: true }));
    try {
      await dispatch(adminApprove({ user_id: user.id })).unwrap();
      toast.success("Waitlist user approved!");
      loadUser();
    } catch (err) {
      toast.error(err?.message || err || "Waitlist approval failed");
    } finally {
      setLoading((s) => ({ ...s, approveWaitlist: false }));
    }
  };

  const handleRejectWaitlist = async () => {
    setLoading((s) => ({ ...s, rejectWaitlist: true }));
    try {
      await dispatch(adminReject({ user_id: user.id })).unwrap();
      toast.success("Waitlist user rejected!");
      loadUser();
    } catch (err) {
      toast.error(err?.message || err || "Waitlist rejection failed");
    } finally {
      setLoading((s) => ({ ...s, rejectWaitlist: false }));
    }
  };

  const handleToggleActive = async () => {
    if (!profile?.id) return;
    setLoading((s) => ({ ...s, toggleActive: true }));
    try {
      await dispatch(
        toggleProfileActive({
          profileId: profile.id,
          isActive: !profile.isActive,
        }),
      ).unwrap();
      toast.success(
        profile.isActive ? "Profile deactivated" : "Profile activated",
      );
      loadUser();
    } catch (err) {
      toast.error(err?.message || err || "Failed to update profile visibility");
    } finally {
      setLoading((s) => ({ ...s, toggleActive: false }));
    }
  };

  const travelProfile = profile
    ? {
        startDate: profile.startDate,
        endDate: profile.endDate,
        location: profile.location,
        county: profile.county,
        area: profile.area,
      }
    : null;

  return (
    <div className="space-y-8 p-6 font-raleway text-black md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/admin/all-users")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← Back to All Users
        </button>
        <span className={`text-sm ${getUserStatusColor(user.status)}`}>
          Account status: {formatUserStatusLabel(user.status)}
        </span>
      </div>

      {/* Account Information (Private) */}
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-xl font-semibold text-[#002244]">
          Account Information (Private)
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Legal name is visible to administrators only.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <p>
            <span className="font-medium text-gray-600">Legal First Name:</span>{" "}
            {firstName || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Legal Last Name:</span>{" "}
            {lastName || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-medium text-gray-600">Phone:</span>{" "}
            {user.phone || profile?.phone || "—"}
          </p>
          <p>
            <span className="font-medium text-gray-600">Joined:</span>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </section>

      {/* Admin actions */}
      <section className="flex flex-wrap gap-3 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 w-full text-xl font-semibold text-[#002244]">
          Administrative Actions
        </h2>

        {canEditProfile && (
          <Link
            to={`/admin/edit-profile/${user.email}`}
            state={{ returnTo: `/admin/all-users/${userId}` }}
            className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Edit Profile
          </Link>
        )}

        {profile?.status === "APPROVED" && (
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={loading.toggleActive}
            className="rounded-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            {loading.toggleActive
              ? "Updating..."
              : profile.isActive
                ? "Deactivate Profile"
                : "Activate Profile"}
          </button>
        )}

        {isWaitlist && (
          <>
            <button
              type="button"
              onClick={handleApproveWaitlist}
              disabled={loading.approveWaitlist}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading.approveWaitlist ? "Approving..." : "Approve Waitlist"}
            </button>
            <button
              type="button"
              onClick={handleRejectWaitlist}
              disabled={loading.rejectWaitlist}
              className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {loading.rejectWaitlist ? "Rejecting..." : "Reject Waitlist"}
            </button>
          </>
        )}

        {!profile && !isWaitlist && (
          <p className="text-sm text-gray-500">
            No public profile yet. User has not completed profile setup.
          </p>
        )}
      </section>

      {/* Public Profile */}
      {profile ? (
        <>
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-semibold text-[#002244]">
              Public Profile
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Display name is what scanners see.
            </p>

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={
                    brokenImages.avatar
                      ? "/img/placeholder.jpg"
                      : orderedImages[0]?.url ||
                        profile.imageUrls?.[0] ||
                        profile.image?.[0] ||
                        "/img/placeholder.jpg"
                  }
                  alt={profile.displayName || "User"}
                  className="h-20 w-20 rounded-full border object-cover"
                  onError={() => markBroken("avatar")}
                />
                <div>
                  <h3 className="text-lg font-medium">
                    {profile.displayName || "No display name set"}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="mt-1 text-xs">
                    Profile status:{" "}
                    <span className="font-semibold">{profile.status}</span>
                    {profile.isActive != null && (
                      <>
                        {" · "}
                        {profile.isActive ? "Visible" : "Hidden"}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p>Age: {profile.age || "—"}</p>
                <p>Height: {profile.height || "—"}</p>
                <p>Body type: {profile.bodyType || "—"}</p>
                <p>Primary area: {getPrimaryArea(travelProfile) || "—"}</p>
                <p>Dealbreakers: {profile.dealbreakers || "—"}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Bio</h3>
              <BioText bio={profile.bio} className="text-base" />
            </div>
          </section>

          {shouldShowTravelMode(travelProfile) && (
            <section className="rounded-lg border bg-gradient-to-b from-orange-500/10 to-white p-6">
              <div className="mb-4 text-xl font-bold text-neutral-800">
                Travel mode
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <GrLocation size={20} />
                  <span>Location: {profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaRegCalendar size={20} />
                  <span>Start: {formatTravelDate(profile.startDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaRegCalendar size={20} />
                  <span>End: {formatTravelDate(profile.endDate)}</span>
                </div>
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-4 text-2xl font-semibold">Photos</h3>
            {orderedImages.length === 0 ? (
              <p className="text-gray-500">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {orderedImages.map((item, idx) => {
                  const imgKey = `photo-${idx}-${item.url}`;
                  return (
                    <div key={imgKey} className="overflow-hidden rounded-lg">
                      <div className="mb-1">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                            item.required ? "bg-orange-500" : "bg-gray-500"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <img
                        src={
                          brokenImages[imgKey]
                            ? "/img/placeholder.jpg"
                            : item.url
                        }
                        alt={item.label}
                        className="h-64 w-full rounded-lg border bg-gray-100 object-cover"
                        onError={() => markBroken(imgKey)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {rejectionEntries.length > 0 && (
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-semibold">Rejection Notes</h3>
              <div className="space-y-4">
                {rejectionEntries.map((entry, index) => (
                  <div
                    key={`${entry.reviewedAt}-${index}`}
                    className="rounded border border-gray-100 bg-red-50 p-4"
                  >
                    <p className="mb-1 text-sm text-gray-600">
                      {formatRejectionDateTime(entry.reviewedAt)}
                    </p>
                    <p className="font-medium text-red-600">
                      {entry.reason || "No reason provided."}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {canReviewProfile && (
            <section className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-xl font-medium">
                Review — Approve or Reject
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Write a reason for rejection..."
                className="min-h-[120px] w-full rounded border border-gray-300 bg-[#E6EEF6] p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleApproveProfile}
                  disabled={loading.approveProfile}
                  className="rounded bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {loading.approveProfile ? "Approving..." : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={handleRejectProfile}
                  disabled={loading.rejectProfile}
                  className="rounded bg-orange-500 px-6 py-2.5 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading.rejectProfile ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </section>
          )}
        </>
      ) : null}
    </div>
  );
};

export default AllUserDetailsView;
