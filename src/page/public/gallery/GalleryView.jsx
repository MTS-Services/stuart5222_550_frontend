import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUserProfile } from "../../../features/public/profile/profileFetch";
import { buildOrderedImagesFromProfile } from "../../../utils/profileImages";

const GalleryView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email } = useParams();
  const { userProfile, fetchLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    if (email) {
      dispatch(fetchUserProfile({ userMail: email }));
    }
  }, [dispatch, email]);

  const images = buildOrderedImagesFromProfile(userProfile);

  return (
    <div className="mx-auto max-w-4xl bg-[#3B3B3D] px-[10px] py-2 sm:py-4 md:py-6 lg:py-8">
      <div className="">
        <h3
          onClick={() => navigate(-1)}
          className="mb-3 flex cursor-pointer items-center gap-2 text-white"
        >
          <IoMdArrowBack /> Back
        </h3>

        {fetchLoading ? (
          <p className="py-8 text-center text-white">Loading photos...</p>
        ) : images.length === 0 ? (
          <p className="py-8 text-center text-white">No photos available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 py-8 md:grid-cols-2 lg:grid-cols-3">
            {images.map((img, index) => (
              <div key={img.url || index} className="overflow-hidden rounded-lg">
                <img
                  src={img.url}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full bg-yellow-200 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;
