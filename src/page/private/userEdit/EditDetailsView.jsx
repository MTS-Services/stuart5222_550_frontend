import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const images = [
  { id: 1, image: '/img/page/admin/img1.png' },
  { id: 2, image: '/img/page/admin/img2.png' },
  { id: 3, image: '/img/page/admin/img3.png' },
  { id: 4, image: '/img/page/admin/img4.png' },
  { id: 5, image: '/img/page/admin/img5.png' },
];

const EditDetailsView = () => {
  const { id } = useParams();

  const { approved_list, isLoading, error } = useSelector(
    (state) => state.adminUsers
  );

  const user = approved_list.find((u) => u.id === Number(id));

  if (isLoading)
    return <div className='mx-auto justify-center'>Loading...</div>;

  if (error)
    return <div className='mx-auto justify-center'>Error: {error}</div>;

  if (!user)
    return <div className='mx-auto justify-center'>User not found</div>;
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
    <div className='text-black'>
      {/* User Info Section */}
      <div className='rounded-sm p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-[80px] h-[80px]'>
              <img
                className='rounded-full object-cover w-full h-full'
                src={'/img/page/admin/img1.png'}
                alt={userInfo.name || 'User'}
              />
            </div>

            <div className='flex flex-col'>
              <h3 className='text-base text-[#252525] font-poppins font-medium'>
                {userInfo.name}
              </h3>
              <p className='text-[#242424] font-lato text-sm my-1.5'>
                {userInfo.email}
              </p>
              <p className='text-[#464646] text-xs'>{userInfo.phone}</p>
              <p>
                Status:{' '}
                <span className=' bg-green-300 p-1 rounded-full text-white text-xs'>
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className='flex flex-col text-[#404040] text-xs font-lato font-medium'>
            <p>Id: {user.id}</p>
            <p>Age: {age}</p>
            <p className='my-1.5'>Height: {height}</p>
            <p>Body type: {bodyType}</p>
            <p className='my-1.5'>Dealbreakers: {dealbreakers}</p>
          </div>
        </div>

        <div className='mt-4'>
          <h2 className='text-black font-raleway text-2xl font-semibold my-4'>
            Bio
          </h2>
          {bio ? (
            Array.isArray(bio) ? (
              bio.map((paragraph, idx) => (
                <p key={idx} className='text-base font-raleway my-2'>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className='text-base font-raleway'>{bio}</p>
            )
          ) : (
            <p>No bio available</p>
          )}
        </div>
      </div>

      {/* Traveling Component */}
      <div className='bg-gradient-to-b border from-orange-500/10 to-white p-6 rounded-lg flex flex-col gap-6'>
        <div className='text-xl font-bold text-neutral-800'>
          <span className='uppercase'>I </span>
          <span className='lowercase'>am traveling and will be in:</span>
        </div>

        <div className='flex flex-col gap-4'>
          {/* Location */}
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📍</span>
            <span className='text-xl font-medium text-neutral-800'>
              Location: Anywhere, USA
            </span>
          </div>

          {/* Start Date */}
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📅</span>
            <span className='text-xl font-medium text-neutral-800'>
              Start-Date: October 1, 2025
            </span>
          </div>

          {/* End Date */}
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📅</span>
            <span className='text-xl font-medium text-neutral-800'>
              End-Date: October 20, 2025
            </span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className='pt-8'>
        <h3 className='text-2xl font-semibold mb-5'>Images</h3>
        <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4'>
          {[
            facePhoto,
            fullBodyPhoto,
            thirdPhoto,
            ...images.map((i) => i.image),
          ].map((img, index) => (
            <div key={index} className='overflow-hidden rounded-lg'>
              <img
                src={img}
                alt={`Image ${index + 1}`}
                className='w-full h-full object-cover bg-yellow-200'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div className='p-4 border border-gray-100 bg-white rounded-lg my-6'>
        <h3 className='text-xl font-medium mb-4'>Cancel With Feedback.</h3>
        <textarea
          className='w-full max-h-[195px] min-h-[195px] p-2 border border-gray-300 bg-[#E6EEF6] rounded-[6px] mb-4 focus:outline-none focus:ring-1 focus:ring-orange-300'
          placeholder='Write a review message here...'
        />
        <button className='bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mb-6'>
          Send
        </button>
        <div className='md:flex items-center gap-4 space-y-6 sm:space-y-0 md:w-[50%]'>
          <button className='bg-[#1BA400] text-white w-full py-2 rounded-[4px]'>
            Approved
          </button>
          <button className='bg-[#FF8C00] text-black w-full py-2 rounded-[4px]'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDetailsView;
