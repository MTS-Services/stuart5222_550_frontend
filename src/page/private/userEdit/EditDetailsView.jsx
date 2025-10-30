import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from "../../../features/admin/management/usreFetch";
import { useEffect, useState } from "react";
import QRCard from "../../../components/common/QRCard";
import CustomModal from "../../../components/common/CustomModal";
import { getUserQRcode } from "../../../features/admin/home/dashboardFetch";
import { formatDate } from "../../../utils/formatDate";

const EditDetailsView = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { qrCodeList } = useSelector((state) => state.dashboard);
  const { approved_list, isLoading, error } = useSelector(
    (state) => state.adminUsers,
  );
  const user = approved_list.find((u) => u.id === Number(id));
  const qr_code = qrCodeList?.scans;
  const [loading, setLoading] = useState({ approve: false, reject: false });

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [rejectionReason, setRejectionReason] = useState("");

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
    return <div className="mx-auto justify-center">User not found</div>;
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
    <div className="space-y-8 text-black">
      {/* User Info Section */}
      <div className="rounded-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[80px] w-[80px]">
              <img
                className="h-full w-full rounded-full object-cover"
                src={image[0]}
                alt={userInfo.name || "User"}
              />
            </div>

            <div className="flex flex-col">
              <h3 className="font-poppins text-base font-medium text-[#252525]">
                {userInfo.name}
              </h3>
              <p className="my-1.5 font-lato text-sm text-[#242424]">
                {userInfo.email}
              </p>
              <p className="text-xs text-[#464646]">{userInfo.phone}</p>
              <p>
                Status:{" "}
                <span className="rounded-full bg-green-300 p-1 text-xs text-white">
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 space-y-1 text-[#404040]">
            <div className="">
              {qrCodeList && qrCodeList.length > 0 ? (
                qrCodeList.map((card) => (
                  <QRCard
                    key={card.id}
                    qrCode={card.qrCode}
                    scanCount={card.scanCount}
                    maxScans={card.maxScans}
                  />
                ))
              ) : (
                <div className="flex h-[140px] w-[150px] items-center justify-center rounded-lg border border-gray-300 text-gray-500">
                  No QR Cards
                </div>
              )}

              {/* {qrCodeList && qrCodeList.length > 0 && (
                <p
                  onClick={openModal}
                  className="mt-2 cursor-pointer text-center underline"
                >
                  See more...
                </p>
              )} */}
            </div>
            <CustomModal isOpen={isOpen} onClose={closeModal} size="2xl">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <p>QR Code Details</p>
                <div className="flex flex-col items-center justify-center gap-4 border">
                  {qrCodeList.map((card) => (
                    <QRCard
                      key={card.id}
                      qrCode={card.qrCode}
                      scanCount={card.scanCount}
                      maxScans={card.maxScans}
                    />
                  ))}
                </div>
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        IP Address
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        User Agent
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {qrCodeList.map((card) =>
                      card.scans.map((scan) => (
                        <tr key={scan.id}>
                          <td className="px-4 py-2 text-sm text-gray-800">
                            {scan.id}
                          </td>
                          <td className="px-4 py-2 text-left text-sm text-gray-800">
                            {scan.ipAddress}
                          </td>
                          <td className="break-all px-4 py-2 text-left text-sm text-gray-800">
                            {scan.userAgent.slice(0, 40)}...
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-800">
                            {formatDate(scan.createdAt)}
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </CustomModal>

            <div>
              <p>Age: {age}</p>
              <p>Height: {height}</p>
              <p>Body type: {bodyType}</p>
              <p>Dealbreakers: {dealbreakers}</p>
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

      {/* Traveling Component */}
      <div className="flex flex-col gap-6 rounded-lg border bg-gradient-to-b from-orange-500/10 to-white p-6">
        <div className="text-xl font-bold text-neutral-800">
          <span className="uppercase">I </span>
          <span className="lowercase">am traveling and will be in:</span>
        </div>

        <div className="flex flex-col gap-4">
          {/* Location */}
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-500">📍</span>
            <span className="text-xl font-medium text-neutral-800">
              Location: {location}
            </span>
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-500">📅</span>
            <span className="text-xl font-medium text-neutral-800">
              Start-Date: {startDate}
            </span>
          </div>

          {/* End Date */}
          <div className="flex items-center gap-3">
            <span className="text-2xl text-orange-500">📅</span>
            <span className="text-xl font-medium text-neutral-800">
              End-Date: {endDate}
            </span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="pt-4">
        <h3 className="mb-5 text-2xl font-bold">Images</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {image.map((img, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <img
                src={img}
                alt={`Image ${index + 1}`}
                className="h-full w-full bg-yellow-200 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
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

export default EditDetailsView;
