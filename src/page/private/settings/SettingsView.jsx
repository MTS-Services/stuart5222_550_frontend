import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAdminSettingsProfile,
  updateAdminSettingsProfile,
} from '../../../features/admin/home/dashboardFetch';

const SettingsView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get profile settings from Redux store
  const { profileSettings } = useSelector((state) => state.dashboard);

  // Initialize state with Redux data or fallback to defaults
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Sync Redux data with local state when component mounts or Redux data changes
  useEffect(() => {
    if (profileSettings) {
      setPersonalDetails({
        firstName: profileSettings.firstName || '',
        lastName: profileSettings.lastName || '',
        email: profileSettings.email || '',
        phone: profileSettings.phone || '',
      });
    }
  }, [profileSettings]);

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordDetailsChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validate passwords match
    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      toast.error('New passwords do not match!', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      tel: form.tel.value,
      oldPassword: form.oldPassword.value,
      newPassword: form.newPassword.value,
      confirmPassword: form.confirmPassword.value,
    };

    try {
      // ✅ POST to scan_me route (backend ready)
      // const response = await postData('submit_user', data);
      // console.log('Server Response:', response);

      // Simulate API call success
      console.log('Data to be submitted:', data);
      await dispatch(updateAdminSettingsProfile(data)).unwrap();

      // ✅ Reset password fields only
      setPasswordDetails({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Exit edit modes
      setIsEditingPersonal(false);
      setIsEditingPassword(false);

      // ✅ Navigate after success
      // setTimeout(() => navigate("/welcome-scan"), 1500);
    } catch (err) {
      console.log(object);
    }
  };

  const togglePersonalEdit = () => {
    setIsEditingPersonal(!isEditingPersonal);
  };

  const togglePasswordEdit = () => {
    setIsEditingPassword(!isEditingPassword);
  };

  return (
    <div className='bg-[#F9FAFB] md:p-8'>
      <div>
        <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
          Settings
        </h2>
        <p className='justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-4 mt-1'>
          Manage your account settings and preferences
        </p>
      </div>

      <div className='bg-gray-50'>
        <div className=''>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8'>
              {/* Personal Details Section */}
              <div className='bg-white rounded-lg p-8 shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-2xl font-poppins font-semibold text-gray-900'>
                    Personal Details
                  </h2>
                  <button
                    type='button'
                    onClick={togglePersonalEdit}
                    className='text-gray-600 hover:text-gray-900'
                  >
                    <FiEdit className='w-5 h-5' />
                  </button>
                </div>

                <div className='space-y-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        First Name
                      </label>
                      <input
                        type='text'
                        name='firstName'
                        value={personalDetails.firstName}
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditingPersonal}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          !isEditingPersonal
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }`}
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
                        onChange={handlePersonalDetailsChange}
                        disabled={!isEditingPersonal}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          !isEditingPersonal
                            ? 'bg-gray-100 cursor-not-allowed'
                            : ''
                        }`}
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
                      onChange={handlePersonalDetailsChange}
                      disabled={!isEditingPersonal}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditingPersonal
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      name='tel'
                      value={personalDetails.phone}
                      onChange={handlePersonalDetailsChange}
                      disabled={!isEditingPersonal}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditingPersonal
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Account Password Section */}
              <div className='bg-white rounded-lg md:p-8 p-4 shadow-sm'>
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-2xl font-semibold text-gray-900'>
                    Account Password
                  </h2>
                  <button
                    type='button'
                    onClick={togglePasswordEdit}
                    className='text-gray-600 hover:text-gray-900'
                  >
                    <FiEdit className='w-5 h-5' />
                  </button>
                </div>

                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Old Password
                    </label>
                    <input
                      type='password'
                      name='oldPassword'
                      value={passwordDetails.oldPassword}
                      onChange={handlePasswordDetailsChange}
                      disabled={!isEditingPassword}
                      placeholder='******'
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditingPassword
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      }`}
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
                      onChange={handlePasswordDetailsChange}
                      disabled={!isEditingPassword}
                      placeholder='******'
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditingPassword
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      }`}
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
                      onChange={handlePasswordDetailsChange}
                      disabled={!isEditingPassword}
                      placeholder='******'
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !isEditingPassword
                          ? 'bg-gray-100 cursor-not-allowed'
                          : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='bg-[#FF8C00] text-black w-full py-3 rounded-[4px] md:mt-14 mt-4 font-medium hover:bg-[#E67E00] transition-colors duration-200'
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
