import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from "../../../features/admin/management/usreFetch";

const UserDetailsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userProfiles, isLoading, error } = useSelector(
    (state) => state.adminUsers,
  );

  const user = userProfiles?.find((u) => u.id === Number(id));

  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState({ approve: false, reject: false });

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;
  if (error)
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!user) return <div className="p-6 text-center">User not found</div>;

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

  // ✅ Approve
  const handleApprove = async () => {
    setLoading({ approve: true, reject: false });
    try {
      await dispatch(adminUserApprovedProfile({ id: user.id })).unwrap();
      toast.success("User approved!");
    } catch (err) {
      toast.error(err.message || "Approval failed");
    } finally {
      setLoading({ approve: false, reject: false });
    }
  };

  // ❌ Reject
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason");
      return;
    }

    setLoading({ approve: false, reject: true });
    try {
      await dispatch(
        adminUserRejectedProfile({
          id: user.id,
          reason: rejectionReason.trim(),
        }),
      ).unwrap();
      toast.success("User rejected!");
      setRejectionReason(""); // clear after success
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
    <div className="space-y-8 p-6 font-raleway text-black">
      {/* User Info */}
      <div className="rounded-sm p-4">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="h-[80px] w-[80px]">
              <img
                src={image?.[0] || "/img/placeholder.jpg"}
                alt={userInfo.name || "User"}
                className="h-full w-full rounded-full border object-cover"
                onError={(e) => (e.target.src = "/img/placeholder.jpg")}
              />
            </div>
            <div>
              <h3 className="font-raleway text-base font-medium text-[#252525]">
                {userInfo.name}
              </h3>
              <p className="my-1.5 font-lato text-sm text-[#242424]">
                {userInfo.email}
              </p>
              <p className="text-xs text-[#464646]">{userInfo.phone}</p>
              <p className="flex items-center gap-2">
                Status:
                <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs text-white">
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-1 text-[#404040]">
            <div>Hello</div>

            <div>
              <p>Age: {age}</p>
              <p>Height: {height}</p>
              <p>Body type: {bodyType}</p>
              <p>Dealbreakers: {dealbreakers}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="my-4 font-raleway text-2xl font-semibold">Bio</h2>
          {bio ? (
            Array.isArray(bio) ? (
              bio.map((p, i) => (
                <p key={i} className="my-2 font-raleway text-base">
                  {p}
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

      {/* Travel Info */}
      <div className="rounded-lg border bg-gradient-to-b from-orange-500/10 to-white p-6">
        <div className="text-xl font-bold text-neutral-800">
          <span className="uppercase">I </span>
          <span className="lowercase">am traveling and will be in:</span>
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-500">📍</span>
            <span className="text-xl font-medium">Location: {location}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-500">📅</span>
            <span className="text-xl font-medium">Start Date: {startDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-500">📅</span>
            <span className="text-xl font-medium">End Date: {endDate}</span>
          </div>
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="mb-5 text-2xl font-semibold">Images</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {image?.map((img, idx) => (
            <div key={idx} className="">
              <img
                src={img}
                alt={`Img ${idx + 1}`}
                className="h-full w-full rounded-md object-cover"
                onError={(e) => (e.target.src = "/img/placeholder.jpg")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Section – NO MODAL */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-xl font-medium">Reject with Feedback</h3>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Write a reason for rejection..."
          className="min-h-[120px] w-full rounded border border-gray-300 bg-[#E6EEF6] p-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <div className="mt-4 space-x-4">
          <button
            onClick={handleApprove}
            disabled={loading.approve}
            className={`w-64 flex-1 rounded py-2.5 font-medium ${
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
            className={`w-64 flex-1 rounded py-2.5 font-medium ${
              loading.reject
                ? "cursor-not-allowed bg-orange-400"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {loading.reject ? "Rejecting..." : "Reject"}
          </button>

          <button
            onClick={handleCencel}
            className={`w-64 flex-1 rounded bg-red-500 py-2.5 font-medium text-white hover:bg-orange-600`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;
