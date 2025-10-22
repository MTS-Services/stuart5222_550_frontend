import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitProfile } from '../../../features/public/profile/profileFetch';

const SetupProfileView = () => {
  // const [submitProfile, { isLoading, isError, isSuccess }] =
  //   useSubmitProfileMutation();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    app: '',
    height: '',
    bio: '',
    location: '',
    facePhoto: null,
    fullbodyPhoto: null,
    thirdPhoto: null,
    additionalPhotos: [],
    bodyType: '',
    area: '',
    dashtreakers: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === 'additionalPhotos') {
      setFormData((prev) => ({
        ...prev,
        additionalPhotos: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    // Append text fields
    submitData.append('email', formData.email);
    submitData.append('app', formData.app);
    submitData.append('height', formData.height);
    submitData.append('bio', formData.bio);
    submitData.append('location', formData.location);
    submitData.append('bodyType', formData.bodyType);
    submitData.append('area', formData.area);
    submitData.append('dashtreakers', formData.dashtreakers);

    // Append required files
    if (formData.facePhoto) submitData.append('facePhoto', formData.facePhoto);
    if (formData.fullbodyPhoto)
      submitData.append('fullBodyPhoto', formData.fullbodyPhoto);
    if (formData.thirdPhoto)
      submitData.append('thirdPhoto', formData.thirdPhoto);

    // Append additional photos
    formData.additionalPhotos.forEach((photo) => {
      submitData.append('additionalPhotos', photo);
    });

    try {
      await dispatch(submitProfile(submitData)).unwrap();
      console.log('Success:', 'Profile submitted successfully');
      // Reset form on success
      setFormData({
        email: '',
        app: '',
        height: '',
        bio: '',
        location: '',
        facePhoto: null,
        fullbodyPhoto: null,
        thirdPhoto: null,
        additionalPhotos: [],
        bodyType: '',
        area: '',
        dashtreakers: '',
      });
    } catch (error) {
      console.error('Failed to submit profile:', error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Profile Information
      </h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Text Inputs */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email *
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              App
            </label>
            <input
              type='text'
              name='app'
              value={formData.app}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Height
            </label>
            <input
              type='text'
              name='height'
              value={formData.height}
              onChange={handleInputChange}
              placeholder="5'8''"
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Body Type
            </label>
            <input
              type='text'
              name='bodyType'
              value={formData.bodyType}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Bio
          </label>
          <textarea
            name='bio'
            value={formData.bio}
            onChange={handleInputChange}
            rows='3'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Looking for meaningful connections through OR cards!'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Location
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleInputChange}
              placeholder='New York, NY'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Area
            </label>
            <input
              type='text'
              name='area'
              value={formData.area}
              onChange={handleInputChange}
              placeholder='dhaka'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Dashtreakers
          </label>
          <input
            type='text'
            name='dashtreakers'
            value={formData.dashtreakers}
            onChange={handleInputChange}
            placeholder='Snorkers'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Required File Uploads */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold text-gray-700'>
            Required Photos
          </h3>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Face Photo *
            </label>
            <input
              type='file'
              name='facePhoto'
              onChange={handleFileChange}
              required
              accept='image/*'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Upload a clear face photo
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Body Photo *
            </label>
            <input
              type='file'
              name='fullbodyPhoto'
              onChange={handleFileChange}
              required
              accept='image/*'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Upload a full body photo
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Third Photo *
            </label>
            <input
              type='file'
              name='thirdPhoto'
              onChange={handleFileChange}
              required
              accept='image/*'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <p className='text-xs text-gray-500 mt-1'>Upload a third photo</p>
          </div>
        </div>

        {/* Optional File Uploads */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Additional Photos (Optional)
          </label>
          <input
            type='file'
            name='additionalPhotos'
            onChange={handleFileChange}
            multiple
            accept='image/*'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <p className='text-xs text-gray-500 mt-1'>
            Optional: Up to 10 additional photos
          </p>
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          isLoading
        </button>
      </form>
    </div>
  );
};

export default SetupProfileView;
