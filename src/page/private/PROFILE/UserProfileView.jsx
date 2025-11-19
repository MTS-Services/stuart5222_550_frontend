import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfileView = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const isVerified = user?.status === "VERIFIED";

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#3B3B3D] px-4">
      <h1 className="mb-6 text-2xl font-semibold text-gray-200">
        User Profile
      </h1>

      {isVerified ? (
        <div className="flex gap-4">
          <button
            onClick={() => navigate(`/user-profile/${user?.email}`)}
            className="rounded border px-6 py-2 text-white hover:bg-gray-700"
          >
            Go to Profile
          </button>

          <button
            onClick={() =>
              navigate(`/checkout/setup-profile/edit/${user?.email}`)
            }
            className="rounded border px-6 py-2 text-white hover:bg-gray-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-400">
          Your profile is <span className="font-semibold">{user?.status}</span>.
          You can’t access profile until verification is complete.
        </p>
      )}
    </div>
  );
};

export default UserProfileView;
