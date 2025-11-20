import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserProfile } from "../../../features/public/profile/profileFetch";
import ProfileInfoView from "./components/ProfileInfoView";
import { updateUser } from "../../../features/auth/authSlice";
import { GET } from "../../../config/api/httpMethods";
import { endpoints } from "../../../config/api/httpEndpoint";

const UserHomeView = () => {
  const dispatch = useDispatch();

  const { userProfile } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  const isVerified = user?.status === "VERIFIED";
  const images = userProfile?.images || [];
  const email = user?.email;

  useEffect(() => {
    if (email) {
      dispatch(fetchUserProfile({ userMail: email }));
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
  }, [dispatch, email]);

  return (
    <div className="flex flex-col items-center justify-center bg-[#3B3B3D] px-4 text-white">
      {isVerified ? (
        <>
          <ProfileInfoView profileData={userProfile} images={images} />
        </>
      ) : (
        <div className="mt-10 h-screen w-full max-w-md text-center">
          <div className="flex flex-col items-center justify-center rounded-lg border border-orange-500 p-8">
            <span className="font-semibold">{user?.email}</span>
            <p className="text-lg text-gray-400">
              Your profile status is{" "}
              <span className="font-semibold">{user?.status}</span>.
              <br /> You can’t access your profile until verification is
              complete.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                {user?.status === "ACTIVE" ? (
                  <Link
                    to={`/user/setup-profile/${user?.email}`}
                    className="rounded bg-orange-600 px-4 py-2 hover:bg-orange-700"
                  >
                    Setup Profile
                  </Link>
                ) : (
                  <span className="text-yellow-400">
                    Please wait for admin approval.
                  </span>
                )}
              </div>

              <div>
                {user?.status === "PAID_SETUP" && (
                  <Link
                    to={`/user/edit-profile/${user?.email}`}
                    className="rounded bg-orange-600 px-4 py-2 hover:bg-orange-700"
                  >
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomeView;
