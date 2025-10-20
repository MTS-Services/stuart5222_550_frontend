import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfileById } from '../../../services/profilesService';
import Loading from '../../../components/ui/loading';

const UserDetails = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleApprove = () => {
    toast.success('Profile approved successfully');
    // Add approve logic here
  };

  const handleReject = () => {
    toast.error('Profile rejected');
    // Add reject logic here  
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profiles
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Profile Details</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {profile.facePhoto ? (
                  <img
                    className="h-20 w-20 rounded-full border-4 border-white"
                    src={profile.facePhoto}
                    alt={user?.name || 'Profile'}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="h-20 w-20 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center"
                  style={{ display: profile.facePhoto ? 'none' : 'flex' }}
                >
                  <svg className="h-12 w-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">{user?.name || 'Unknown User'}</h2>
                <p className="text-orange-100">{user?.email || 'No email provided'}</p>
                <div className="mt-2">
                  <span className={getStatusBadgeStyle(profile.status)}>
                    {profile.status || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm text-gray-900">{profile.userId || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-sm text-gray-900">{profile.age || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Height</label>
                    <p className="text-sm text-gray-900">{profile.height || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-sm text-gray-900">{profile.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Profile Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={getStatusBadgeStyle(profile.status)}>
                        {profile.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created Date</label>
                    <p className="text-sm text-gray-900">
                      {profile.createdAt 
                        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {profile.updatedAt 
                        ? new Date(profile.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bio</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>
                </div>
              </div>
            )}

            {/* Photos Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.facePhoto && (
                  <div className="aspect-square">
                    <img
                      src={profile.facePhoto}
                      alt="Face Photo"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Face Photo</p>
                  </div>
                )}
                {profile.fullBodyPhoto && (
                  <div className="aspect-square">
                    <img
                      src={profile.fullBodyPhoto}
                      alt="Full Body Photo"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Full Body Photo</p>
                  </div>
                )}
                {profile.thirdPhoto && (
                  <div className="aspect-square">
                    <img
                      src={profile.thirdPhoto}
                      alt="Third Photo"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">Third Photo</p>
                  </div>
                )}
                {profile.additionalPhotos && profile.additionalPhotos.length > 0 && 
                  profile.additionalPhotos.map((photo, index) => (
                    <div key={index} className="aspect-square">
                      <img
                        src={photo}
                        alt={`Additional Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <p className="text-xs text-gray-500 mt-1 text-center">Additional Photo {index + 1}</p>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Back to List
              </button>
              <button
                onClick={() => toast.info('Edit functionality coming soon')}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;