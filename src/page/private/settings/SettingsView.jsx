import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { 
  getAdminProfile, 
  updateAdminProfile, 
  updateAdminPassword 
} from '../../../services/profileService';

const SettingsView = () => {
  const navigate = useNavigate();

  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'password'
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Track changes to show notifications
  const [fieldChangeNotified, setFieldChangeNotified] = useState({});

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setProfileLoading(true);
      const profile = await getAdminProfile();
      const profileData = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
      };
      setPersonalDetails(profileData);
      setOriginalData(profileData); // Store original data for comparison
      
      // Show success notification for data loaded
      toast.info('Profile data loaded successfully', {
        position: 'top-right',
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // Helper function to show field change notifications
  const handlePersonalDetailChange = (field, value) => {
    const newDetails = { ...personalDetails, [field]: value };
    setPersonalDetails(newDetails);

    // Check if this field has changed from original
    if (originalData[field] !== value && !fieldChangeNotified[field]) {
      const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        phoneNumber: 'Phone Number'
      };

      toast.info(`${fieldLabels[field]} has been modified`, {
        position: 'top-right',
        autoClose: 2000,
      });

      setFieldChangeNotified(prev => ({ ...prev, [field]: true }));
      setHasChanges(true);
    }

    // Reset notification flag if field is back to original
    if (originalData[field] === value && fieldChangeNotified[field]) {
      setFieldChangeNotified(prev => ({ ...prev, [field]: false }));
    }
  };

  // Helper function to show password field change notifications
  const handlePasswordChange = (field, value) => {
    const newPassword = { ...passwordDetails, [field]: value };
    setPasswordDetails(newPassword);

    if (value && value.length > 0) {
      const fieldLabels = {
        oldPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Password Confirmation'
      };

      // Only show notification once per field per session
      if (!fieldChangeNotified[`password_${field}`]) {
        toast.info(`${fieldLabels[field]} entered`, {
          position: 'top-right',
          autoClose: 1500,
        });
        setFieldChangeNotified(prev => ({ ...prev, [`password_${field}`]: true }));
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const profileData = {
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName,
        email: personalDetails.email,
        phoneNumber: personalDetails.phoneNumber,
      };

      await updateAdminProfile(profileData);
      
      // Update original data and reset change flags
      setOriginalData(profileData);
      setHasChanges(false);
      setFieldChangeNotified({});
      
      toast.success('🎉 Profile updated successfully!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Show detailed success info
      toast.info(`Updated: ${Object.keys(profileData).map(key => 
        profileData[key] !== originalData[key] ? key : null
      ).filter(Boolean).join(', ')}`, {
        position: 'top-right',
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('❌ Failed to update profile. Please check your connection and try again!', {
        position: 'top-right',
        autoClose: 4000,
      });

      // Show specific error if available
      if (error.response?.data?.message) {
        toast.warning(`Server message: ${error.response.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate password fields with enhanced notifications
    if (!passwordDetails.oldPassword || !passwordDetails.newPassword || !passwordDetails.confirmPassword) {
      toast.error('❌ Please fill in all password fields', {
        position: 'top-right',
        autoClose: 4000,
      });

      // Show specific missing fields
      const missingFields = [];
      if (!passwordDetails.oldPassword) missingFields.push('Current Password');
      if (!passwordDetails.newPassword) missingFields.push('New Password');
      if (!passwordDetails.confirmPassword) missingFields.push('Password Confirmation');
      
      toast.warning(`Missing: ${missingFields.join(', ')}`, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      toast.error('❌ New passwords do not match', {
        position: 'top-right',
        autoClose: 4000,
      });
      
      toast.info('Please ensure both password fields are identical', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (passwordDetails.newPassword.length < 6) {
      toast.error('❌ New password must be at least 6 characters long', {
        position: 'top-right',
        autoClose: 4000,
      });
      
      toast.info(`Current length: ${passwordDetails.newPassword.length} characters. Need at least 6.`, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Additional security checks
    if (passwordDetails.oldPassword === passwordDetails.newPassword) {
      toast.warning('New password should be different from your current password', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const passwordData = {
        oldPassword: passwordDetails.oldPassword,
        newPassword: passwordDetails.newPassword,
        confirmPassword: passwordDetails.confirmPassword,
      };

      await updateAdminPassword(passwordData);
      
      toast.success('🔐 Password updated successfully!', {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Show security notification
      toast.info('Your account is now more secure with the new password', {
        position: 'top-right',
        autoClose: 3000,
      });

      // Reset password form and notifications
      setPasswordDetails({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Reset password change notifications
      setFieldChangeNotified(prev => ({
        ...prev,
        password_oldPassword: false,
        password_newPassword: false,
        password_confirmPassword: false,
      }));

    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('❌ Failed to update password. Please verify your current password and try again!', {
        position: 'top-right',
        autoClose: 4000,
      });

      // Show specific error guidance
      if (error.response?.status === 401) {
        toast.warning('Current password is incorrect', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else if (error.response?.data?.message) {
        toast.warning(`Server message: ${error.response.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle tab switching with notifications
  const handleTabSwitch = (newTab) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      
      const tabLabels = {
        personal: 'Personal Details',
        password: 'Account Password'
      };

      toast.info(`Switched to ${tabLabels[newTab]} tab`, {
        position: 'top-right',
        autoClose: 1500,
      });

      // Warn about unsaved changes
      if (hasChanges && newTab === 'password') {
        toast.warning('You have unsaved changes in Personal Details', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className='bg-[#F9FAFB] md:p-8 p-3'>
      <div className='mb-6'>
        <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
          Settings
        </h2>
        <p className='justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-4 mt-1'>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className='bg-white rounded-lg shadow-sm'>
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6'>
            <button
              onClick={() => handleTabSwitch('personal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'personal'
                  ? 'border-[#FF8C00] text-[#FF8C00]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiEdit className='inline-block w-4 h-4 mr-2' />
              Personal Details
              {hasChanges && activeTab !== 'personal' && (
                <span className='ml-2 w-2 h-2 bg-orange-500 rounded-full inline-block'></span>
              )}
            </button>
            <button
              onClick={() => handleTabSwitch('password')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'password'
                  ? 'border-[#FF8C00] text-[#FF8C00]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FiEdit className='inline-block w-4 h-4 mr-2' />
              Account Password
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === 'personal' && (
            <div>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-2xl font-poppins font-semibold text-gray-900'>
                  Personal Details
                </h2>
              </div>

              {profileLoading ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate}>
                  <div className='space-y-6 max-w-2xl'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          First Name
                        </label>
                        <input
                          type='text'
                          name='firstName'
                          value={personalDetails.firstName}
                          onChange={(e) => handlePersonalDetailChange('firstName', e.target.value)}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Last Name
                        </label>
                        <input
                          type='text'
                          name='lastName'
                          value={personalDetails.lastName}
                          onChange={(e) => handlePersonalDetailChange('lastName', e.target.value)}
                          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={personalDetails.email}
                        onChange={(e) => handlePersonalDetailChange('email', e.target.value)}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        name='phoneNumber'
                        value={personalDetails.phoneNumber}
                        onChange={(e) => handlePersonalDetailChange('phoneNumber', e.target.value)}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      />
                    </div>

                    <div className='pt-4'>
                      <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200'
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <div className='flex items-center justify-between mb-8'>
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Account Password
                </h2>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <div className='space-y-6 max-w-2xl'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Old Password
                    </label>
                    <input
                      type='password'
                      name='oldPassword'
                      value={passwordDetails.oldPassword}
                      onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                      placeholder='******'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      New Password
                    </label>
                    <input
                      type='password'
                      name='newPassword'
                      value={passwordDetails.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder='******'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Confirm New Password
                    </label>
                    <input
                      type='password'
                      name='confirmPassword'
                      value={passwordDetails.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder='******'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div className='pt-4'>
                    <button
                      type='submit'
                      disabled={loading}
                      className='w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200'
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;