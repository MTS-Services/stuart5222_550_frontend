import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserHomeView = () => {
  const { user } = useSelector((state) => state.auth);
  const isVerified = user?.status === "VERIFIED";

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#3B3B3D] px-4 text-white">
      {isVerified ? (
        <>
          <div className="mb-6 w-full max-w-md rounded-lg p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">👤 User Information</h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Name:</span> {user?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Role:</span> {user?.role}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {user?.status}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {user?.phone || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Approved:</span>{" "}
                {user?.isApproved ? "Yes" : "No"}
              </p>
            </div>

            <div className="mt-4">
              <Link
                to={`/user/setup-profile`}
                className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
              >
                Setup Profile
              </Link>
            </div>
          </div>
        </>
      ) : (
        <p className="text-lg text-gray-400">
          Your profile is <span className="font-semibold">{user?.status}</span>.
          You can’t access profile until verification is complete.
        </p>
      )}

      <h1 className="mt-4 text-2xl font-semibold text-gray-200">
        User Profile
      </h1>
    </div>
  );
};

export default UserHomeView;
