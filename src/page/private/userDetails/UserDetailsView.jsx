import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Traveling from "./components/Traveling";

const images = [
  { id: 1, image: "/img/page/admin/img1.png" },
  { id: 2, image: "/img/page/admin/img2.png" },
  { id: 3, image: "/img/page/admin/img3.png" },
  { id: 4, image: "/img/page/admin/img4.png" },
  { id: 5, image: "/img/page/admin/img5.png" },
];

const UserDetailsView = () => {
  const { id } = useParams();
  const { approved_list, isLoading, error } = useSelector(
    (state) => state.adminUsers,
  );

  if (isLoading)
    return <div className="mx-auto justify-center">Loading...</div>;
  if (error)
    return <div className="mx-auto justify-center">Error: {error}</div>;

  const user = approved_list.find((u) => u.id === Number(id));

  if (!user)
    return <div className="mx-auto justify-center">User not found</div>;

  const {
    user: userInfo,
    age,
    height,
    bio,
    facePhoto,
    fullBodyPhoto,
    thirdPhoto,
    bodyType,
    dealbreakers,
  } = user;

  return (
    <div className="font-raleway text-black">
      {/* User Info Section */}
      <div className="rounded-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-[80px] w-[80px]">
              <img
                className="h-full w-full rounded-full object-cover"
                src={"/img/page/admin/img1.png"}
                alt={userInfo.name || "User"}
              />
            </div>

            <div className="flex flex-col">
              <h3 className="font-raleway text-base font-medium text-[#252525]">
                {userInfo.name}
              </h3>
              <p className="my-1.5 font-lato text-sm text-[#242424]">
                {userInfo.email}
              </p>
              <p className="text-xs text-[#464646]">{userInfo.phone}</p>
            </div>
          </div>

          <div className="flex flex-col font-lato text-xs font-medium text-[#404040]">
            <p>Age: {age}</p>
            <p className="my-1.5">Height: {height}</p>
            <p>Body type: {bodyType}</p>
            <p className="my-1.5">Dealbreakers: {dealbreakers}</p>
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
      <Traveling />

      {/* Image Gallery */}
      <div className="pt-8">
        <h3 className="mb-5 text-2xl font-semibold">Images</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {[
            facePhoto,
            fullBodyPhoto,
            thirdPhoto,
            ...images.map((i) => i.image),
          ].map((img, index) => (
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
      <div className="my-6 rounded-lg border border-gray-100 bg-white p-4">
        <h3 className="mb-4 text-xl font-medium">Cancel With Feedback.</h3>
        <textarea
          className="mb-4 max-h-[195px] min-h-[195px] w-full rounded-[6px] border border-gray-300 bg-[#E6EEF6] p-2 focus:outline-none focus:ring-1 focus:ring-orange-300"
          placeholder="Write a review message here..."
        />
        <button className="mb-6 w-full rounded-[4px] bg-[#FF8C00] py-2 text-black">
          Send
        </button>
        <div className="items-center gap-4 space-y-6 sm:space-y-0 md:flex md:w-[50%]">
          <button className="w-full rounded-[4px] bg-[#1BA400] py-2 text-white">
            Approved
          </button>
          <button className="w-full rounded-[4px] bg-[#FF8C00] py-2 text-black">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsView;
