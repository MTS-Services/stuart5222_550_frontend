import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  adminUserApprovedProfile,
  adminUserRejectedProfile,
} from '../../../features/admin/management/usreFetch';

const UserDetailsView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userProfiles, isLoading, error } = useSelector(
    (state) => state.adminUsers
  );

  const user = userProfiles?.find((u) => u.id === Number(id));

  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState({ approve: false, reject: false });

  if (isLoading) return <div className='p-6 text-center'>Loading...</div>;
  if (error)
    return <div className='p-6 text-center text-red-600'>Error: {error}</div>;
  if (!user) return <div className='p-6 text-center'>User not found</div>;

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
    <div className='text-black p-6 space-y-8'>
      {/* User Info */}
      <div className='rounded-sm p-4 '>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
          <div className='flex items-center gap-4'>
            <div className='w-[80px] h-[80px]'>
              <img
                src={image?.[0] || '/img/placeholder.jpg'}
                alt={userInfo.name || 'User'}
                className='rounded-full border object-cover w-full h-full'
                onError={(e) => (e.target.src = '/img/placeholder.jpg')}
              />
            </div>
            <div>
              <h3 className='text-base font-poppins font-medium text-[#252525]'>
                {userInfo.name}
              </h3>
              <p className='text-sm font-lato text-[#242424] my-1.5'>
                {userInfo.email}
              </p>
              <p className='text-xs text-[#464646]'>{userInfo.phone}</p>
              <p>
                Status:
                <span className='bg-yellow-300 px-2 py-1 rounded-full text-white text-xs'>
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className=' text-[#404040] space-y-1'>
            <p>Age: {age}</p>
            <p>Height: {height}</p>
            <p>Body type: {bodyType}</p>
            <p>Dealbreakers: {dealbreakers}</p>
          </div>
        </div>

        <div className='mt-6'>
          <h2 className='text-2xl font-semibold font-raleway my-4'>Bio</h2>
          {bio ? (
            Array.isArray(bio) ? (
              bio.map((p, i) => (
                <p key={i} className='text-base font-raleway my-2'>
                  {p}
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

      {/* Travel Info */}
      <div className='bg-gradient-to-b border from-orange-500/10 to-white p-6 rounded-lg'>
        <div className='text-xl font-bold text-neutral-800'>
          <span className='uppercase'>I </span>
          <span className='lowercase'>am traveling and will be in:</span>
        </div>
        <div className='flex flex-col gap-4 mt-4'>
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📍</span>
            <span className='text-xl font-medium'>Location: {location}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📅</span>
            <span className='text-xl font-medium'>Start Date: {startDate}</span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-orange-500 text-2xl'>📅</span>
            <span className='text-xl font-medium'>End Date: {endDate}</span>
          </div>
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className='text-2xl font-semibold mb-5'>Images</h3>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {image?.map((img, idx) => (
            <div key={idx} className=''>
              <img
                src={img}
                alt={`Img ${idx + 1}`}
                className='w-full h-full object-cover rounded-md'
                onError={(e) => (e.target.src = '/img/placeholder.jpg')}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Section – NO MODAL */}
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

export default UserDetailsView;
