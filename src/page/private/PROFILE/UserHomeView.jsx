import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserProfile } from "../../../features/public/profile/profileFetch";
import ProfileInfoView from "./components/ProfileInfoView";

const UserHomeView = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.profile);

  const isVerified = user?.status === "VERIFIED";

  const images = userProfile?.images || [];

  const email = user?.email;

  useEffect(() => {
    if (email) {
      dispatch(fetchUserProfile({ userMail: email }));
    }
  }, [dispatch, email]);

  return (
    <div className="flex flex-col items-center justify-center bg-[#3B3B3D] px-4 text-white">
      {isVerified ? (
        <>
          <ProfileInfoView profileData={userProfile} images={images} />
        </>
      ) : (
        <div className="w-full max-w-md rounded-lg border border-gray-400 p-6 text-center shadow-lg">
          <span className="font-semibold">{user?.email}</span>
          <p className="text-lg text-gray-400">
            Your profile status is{" "}
            <span className="font-semibold">{user?.status}</span>.
            <br /> You can’t access your profile until verification is complete.
          </p>
          <div className="mt-4">
            {user?.status === "ACTIVE" ? (
              <Link
                to={`/user/setup-profile/${user?.email}`}
                className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
              >
                Setup Profile
              </Link>
            ) : (
              <span className="text-yellow-400">
                Please wait for admin approval.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomeView;
