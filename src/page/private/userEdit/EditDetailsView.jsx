import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from '../../../features/admin/management/usreFetch';
import { useState } from 'react';

const EditDetailsView = () => {
  const { id } = useParams();

  const { approved_list, isLoading, error } = useSelector(
    (state) => state.adminUsers
  );

  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState({ approve: false, reject: false });

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
      toast.success('User approved!');
    } catch (err) {
      toast.error(err.message || 'Approval failed');
    } finally {
      setLoading({ approve: false, reject: false });
    }
  };

  // ❌ Reject
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    setLoading({ approve: false, reject: true });
    try {
      await dispatch(
        adminUserRejectedProfile({
          id: user.id,
          reason: rejectionReason.trim(),
        })
      ).unwrap();
      toast.success('User rejected!');
      setRejectionReason(''); // clear after success
    } catch (err) {
      toast.error(err.message || 'Rejection failed');
    } finally {
      setLoading({ approve: false, reject: false });
    }
  };

  const handleCencel = () => {
    navigate(-1);
  };

  return (
    <div className='text-black space-y-8'>
      {/* User Info Section */}
      <div className='rounded-sm p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='w-[80px] h-[80px]'>
              <img
                className='rounded-full object-cover w-full h-full'
                src={image[0]}
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
              Location: {location}
            </span>
          </div>

          {/* Start Date */}
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📅</span>
            <span className='text-xl font-medium text-neutral-800'>
              Start-Date: {startDate}
            </span>
          </div>

          {/* End Date */}
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📅</span>
            <span className='text-xl font-medium text-neutral-800'>
              End-Date: {endDate}
            </span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className='pt-4'>
        <h3 className='text-2xl font-bold mb-5'>Images</h3>
        <div className='grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4'>
          {image.map((img, index) => (
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
      <div className='p-4 border border-gray-200 bg-white rounded-lg'>
        <h3 className='text-xl font-medium mb-3'>Reject with Feedback</h3>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder='Write a reason for rejection...'
          className='w-full min-h-[120px] p-3 border border-gray-300 rounded bg-[#E6EEF6] focus:outline-none focus:ring-2 focus:ring-orange-300'
        />
        <div className='mt-4 space-x-4'>
          <button
            onClick={handleApprove}
            disabled={loading.approve}
            className={`flex-1 py-2.5 w-64 rounded font-medium ${
              loading.approve
                ? 'bg-green-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {loading.approve ? 'Approving...' : 'Approve'}
          </button>

          <button
            onClick={handleReject}
            disabled={loading.reject}
            className={`flex-1 py-2.5 w-64 rounded font-medium ${
              loading.reject
                ? 'bg-orange-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {loading.reject ? 'Rejecting...' : 'Reject'}
          </button>

          <button
            onClick={handleCencel}
            className={`flex-1 py-2.5 w-64 rounded font-medium bg-red-500 hover:bg-orange-600 text-white `}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDetailsView;
