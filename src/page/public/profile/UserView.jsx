import { GrLocation } from 'react-icons/gr';
import { FaRegCalendar } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../../features/public/profile/profileFetch';

const UserView = () => {
  const dispatch = useDispatch();

  // Get QR code data (contains profile email)
  const { data: qrData } = useSelector((state) => state.qrcode);

  // Get actual profile data
  const { userProfile, fetchLoading, error } = useSelector(
    (state) => state.profile
  );

  const userEmail = qrData?.profile?.contactEmail;
  const images = userProfile?.images || [];

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchUserProfile({ userMail: userEmail }));
    }
  }, [dispatch, userEmail]);

  // Show loading state
  if (fetchLoading) {
    return (
      <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen flex items-center justify-center'>
        <div className='text-white text-center'>
          <div className='text-2xl mb-4'>⏳</div>
          <p className='text-xl'>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen flex items-center justify-center'>
        <div className='text-white text-center'>
          <div className='text-2xl mb-4'>❌</div>
          <p className='text-xl text-red-400'>Error loading profile</p>
          <p className='text-sm mt-2'>{error}</p>
        </div>
      </div>
    );
  }

  // Show message if no profile data
  if (!userProfile || !userProfile.email) {
    return (
      <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen flex items-center justify-center'>
        <div className='text-white text-center'>
          <div className='text-2xl mb-4'>👤</div>
          <p className='text-xl'>No profile found</p>
          <p className='text-sm mt-2'>Please scan a valid QR code first</p>
        </div>
      </div>
    );
  }

  return (
    <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D]'>
      <div className='font-raleway text-white px-2 py-6'>
        <div className='flex items-center justify-center'>
          {/* Image */}
          <img
            src='/img/page/home/remove_preview.png'
            alt='preview'
            className='w-24 bg-cover object-cover'
          />
        </div>
        <h1 className='font-bold text-2xl text-center py-6'>
          {userProfile.displayName || 'Anonymous User'}
        </h1>

        <div className='flex justify-center items-center text-center w-full'>
          <div className='relative w-[600px] my-6 rounded-2xl p-8 shadow-lg bg-gradient-to-b from-orange-200 via-amber-50 to-yellow-50 overflow-hidden'>
            {/* Gradient border overlay */}
            <div
              className='absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none border-t-4 border-l-4 border-r-4 border-transparent'
              style={{
                borderImage:
                  'linear-gradient(to bottom, #FED7AA, #FEF9C7, #FEF9C3) 1',
              }}
            ></div>

            {/* Content */}
            <h2 className='md:text-[32px] text-xl font-bold text-start text-gray-900 mb-[21px]'>
              I am traveling and will be in:
            </h2>

            <div className='space-y-4'>
              <div className=''>
                <div className='flex items-center gap-3'>
                  <span className='text-orange-600 mt-0.5'>
                    <FaRegCalendar />
                  </span>
                  <div className='flex gap-2 font-medium md:text-2xl text-xl text-black'>
                    Start-Date: October 1, 2025
                  </div>
                </div>
                <div className='flex gap-2 font-medium md:text-2xl text-xl text-black ml-8'>
                  End-Date: October 20, 2025
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <span className='text-orange-600 text-xl mt-0.5'>
                  <GrLocation />
                </span>
                <div className='flex gap-2 font-medium md:text-2xl text-xl text-black'>
                  Location: Anywhere, USA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className=''>
          <div className='flex justify-center items-center text-center'>
            <div className='flex flex-col gap-5'>
              {/* Main photo */}
              <div className='flex items-center justify-center'>
                <img
                  src={images[0]?.url || '/img/page/home/remove_preview.png'}
                  alt='Profile photo'
                  className='w-full h-full bg-cover object-cover rounded-xl'
                />
              </div>

              {/* Secondary photos */}
              <div className='grid grid-cols-2 gap-4'>
                <img
                  src={images[1]?.url || '/img/page/home/remove_preview.png'}
                  alt='Full body photo'
                  className='w-full h-full bg-cover object-cover rounded-xl'
                />
                <img
                  src={images[2]?.url || '/img/page/home/remove_preview.png'}
                  alt='Additional photo'
                  className='w-full h-full bg-cover object-cover rounded-xl'
                />
              </div>
            </div>
          </div>

          <div className='max-w-[600px] mx-auto my-2'>
            <Link to={`/user-profile/gallery`}>
              <p className='flex items-center underline hover:text-orange-500 justify-end font-raleway text-base font-semibold'>
                See more photos
              </p>
            </Link>

            <div className=''>
              <h2 className='text-[32px] font-raleway font-semibold text-[#F07400]'>
                Profile Details
              </h2>
              <div className='bg-[#505050] p-6 rounded-lg my-4'>
                <p className='font-raleway font-normal md:text-2xl text-xl'>
                  Name : {userProfile.displayName || 'Not provided'}
                </p>
                <p className='font-raleway font-normal md:text-2xl text-xl my-5'>
                  Age : {userProfile.age || 'Not provided'}
                </p>
                <p className='font-raleway font-normal md:text-2xl text-xl'>
                  Height : {userProfile.height || 'Not provided'}
                </p>
                <p className='font-raleway font-normal md:text-2xl text-xl my-5'>
                  Body type : {userProfile.bodyType || 'Not provided'}
                </p>
                <p className='font-raleway font-normal md:text-2xl text-xl'>
                  Area :{' '}
                  {userProfile.area || userProfile.location || 'Not provided'}
                </p>
                <p className='font-raleway font-normal md:text-2xl text-xl my-5'>
                  Dealbreakers : {userProfile.dealbreakers || 'None specified'}
                </p>
              </div>
            </div>

            <h2 className='font-raleway font-medium text-xl mt-10'>Bio</h2>
            <div className='bg-[#FFFFFF14] rounded-lg my-4'>
              <p className='font-medium font-raleway md:text-base text-xs p-4'>
                {userProfile.bio || 'No bio available'}
              </p>
            </div>

            <p className='font-medium md:text-2xl text-xl font-raleway text-center md:px-4 my-14'>
              If you’ve read this far and you’re intrigued, don’t overthink it.
              Let’s see what a good conversation might bring.
            </p>

            <h2 className='font-bold font-raleway md:text-4xl text-2xl text-center mb-3'>
              It's not a scam, it's a Scan.
            </h2>

            <Link to={`/user-profile/connect`}>
              <button
                type='submit'
                className='w-full md:my-4 my-2 p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition'
              >
                Let’s Connect
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserView;
