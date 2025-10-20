import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfileById, approveProfile, rejectProfile } from '../../../services/profilesService';
import { Loading } from '../../../components/ui/loading';

const UserDetails = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (profileId) {
      fetchProfileDetails();
    }
  }, [profileId]);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getProfileById(profileId);
      setProfile(response);
      
      toast.success('Profile details loaded successfully');
    } catch (err) {
      setError('Failed to load profile details');
      toast.error('Failed to load profile details');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/user-edit');
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveProfile(profileId, feedback);
      toast.success('Profile approved successfully');
      // Clear feedback and refresh profile data
      setFeedback('');
      await fetchProfileDetails();
    } catch (error) {
      toast.error('Failed to approve profile');
      console.error('Approve error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectProfile(profileId, feedback);
      toast.success('Profile rejected successfully');
      // Clear feedback and refresh profile data
      setFeedback('');
      await fetchProfileDetails();
    } catch (error) {
      toast.error('Failed to reject profile');
      console.error('Reject error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status?.toUpperCase()) {
      case 'DRAFT':
        return `${baseStyle} bg-gray-100 text-gray-800`;
      case 'PENDING':
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case 'APPROVED':
        return `${baseStyle} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseStyle} bg-red-100 text-red-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) return <Loading />;
  
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
            <p className="text-gray-500 mb-4">{error || 'The profile you are looking for could not be found.'}</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#F07400] hover:bg-[#e56b00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F07400]"
            >
              Back to Profiles
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user } = profile;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 mb-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Before
          </button>
        </div>

        {/* Profile Card - Before Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                {profile.facePhoto ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={profile.facePhoto}
                    alt={user?.name || 'Profile'}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center"
                  style={{ display: profile.facePhoto ? 'none' : 'flex' }}
                >
                  <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{user?.name || 'Angel Luna'}</h2>
                    <p className="text-sm text-gray-500">{user?.email || 'angel@example.com'}</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm text-gray-900 font-medium">{profile.age || '25'}</span>
                    <span className="text-sm text-gray-500">{profile.height || `5'8"`}</span>
                    <span className="text-xs text-gray-400">{profile.location || 'Washington County'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio || "Hi, I'm Angel and I really enjoy cooking and stuff. I like to think I'm pretty humorous too but that's something up for debate. I'm looking for somebody that's laid back and wants to go on cute little adventures together. I also would love someone to attend a jazz concert with me, because I've been wanting to go since. My interests lie heavily in music theory and jazz. I love music in general but jazz has always held a special place..."}
              </p>
            </div>
          </div>
        </div>

        {/* After Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">After</h2>
            
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 relative">
                {profile.facePhoto ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={profile.facePhoto}
                    alt={user?.name || 'Profile'}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1">
                  <span className={getStatusBadgeStyle(profile.status)}>
                    {profile.status || 'DRAFT'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{user?.name || 'Angel Luna'}</h3>
                    <p className="text-sm text-gray-500">{user?.email || 'angel@example.com'}</p>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-sm text-gray-900 font-medium">{profile.age || '25'}</span>
                    <span className="text-sm text-gray-500">{profile.height || `5'8"`}</span>
                    <span className="text-xs text-gray-400">{profile.location || 'Washington County'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Bio</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {profile.bio || "Hi, I'm Angel and I really enjoy cooking and stuff. I like to think I'm pretty humorous too but that's something up for debate. I'm looking for somebody that's laid back and wants to go on cute little adventures together. I also would love someone to attend a jazz concert with me, because I've been wanting to go since. My interests lie heavily in music theory and jazz. I love music in general but jazz has always held a special place in my heart since I was young. I want to travel the world one day but for now I'm content to see what's around me."}
              </p>
            </div>
          </div>
        </div>

        {/* What I'm looking for and will do */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">I am looking and will do...</h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Location: {profile.location || 'Worldwide'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Other activities
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
            <div className="grid grid-cols-5 gap-2">
              {/* Create a grid of sample photos */}
              {Array.from({ length: 25 }, (_, i) => (
                <div key={i} className="aspect-square">
                  {profile.facePhoto && i === 0 ? (
                    <img
                      src={profile.facePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  ) : profile.fullBodyPhoto && i === 1 ? (
                    <img
                      src={profile.fullBodyPhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  ) : profile.thirdPhoto && i === 2 ? (
                    <img
                      src={profile.thirdPhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  ) : profile.additionalPhotos && profile.additionalPhotos[i - 3] ? (
                    <img
                      src={profile.additionalPhotos[i - 3]}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Feedback</h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <textarea
                className="w-full bg-transparent border-none resize-none focus:outline-none text-sm text-gray-700 placeholder-gray-500"
                rows="3"
                placeholder="Write feedback for this profile..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="flex-1 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {actionLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Reject'
            )}
          </button>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="flex-1 px-4 py-3 bg-[#F07400] text-white text-sm font-medium rounded-lg hover:bg-[#e56b00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F07400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {actionLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Approve'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;