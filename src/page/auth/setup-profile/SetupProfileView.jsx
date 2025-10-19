import { useEffect, useRef, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { BiErrorCircle } from 'react-icons/bi';
import { Upload } from 'lucide-react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { PaymentMethod } from '../checkout/components/PaymentMethod';
import { Link } from 'react-router-dom';

const SetupProfileView = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // ============================================
  // 📸 Image Upload Handler with Preview
  // ============================================
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log('🖼️ Files selected initially:', selectedFiles.length);
    // Validation: Max 13 images (3 required + 10 optional)
    if (selectedFiles.length > 13) {
      alert('⚠️ Maximum 13 images allowed (3 required + 10 optional)');
      console.log('❌ Too many files selected:', selectedFiles.length);
      return;
    }

    // Validation: Only images
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length !== selectedFiles.length) {
      alert('⚠️ Please upload only image files');
      console.log('❌ Non-image files filtered out');
      return;
    }

    console.log('✅ Valid image files:', validFiles.length);
    console.log(
      '📊 File details:',
      validFiles.map((f) => ({ name: f.name, type: f.type, size: f.size }))
    );

    setFiles(validFiles);

    // Create image previews
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    console.log('🎉 Final files state:', validFiles.length);
    console.log('🖼️ Image previews generated:', previews.length);

    // Clear the input to allow selecting same files again
    e.target.value = '';
  };

  // Remove specific image
  const removeImage = (index) => {
    console.log('🗑️ Removing image at index:', index);
    console.log(
      '📊 Before removal - Files:',
      files.length,
      'Previews:',
      imagePreviews.length
    );

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setImagePreviews(newPreviews);

    console.log(
      '✅ After removal - Files:',
      newFiles.length,
      'Previews:',
      newPreviews.length
    );
    console.log(
      '🖼️ Remaining images:',
      newFiles.map((f) => f.name)
    );
  };

  const handleClick = () => {
    console.log('🖱️ Upload button clicked');
    fileInputRef.current.click();
  };

  // ============================================
  // 📋 Form Validation
  // ============================================
  const validateForm = (formData) => {
    console.log('🔍 Starting form validation...');
    console.log('📝 Form data:', formData);
    console.log('🖼️ Current files count:', files.length);

    const newErrors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Name is required';
      console.log('❌ Name validation failed');
    }
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
      console.log('❌ Age validation failed');
    }
    if (!formData.height.trim()) {
      newErrors.height = 'Height is required';
      console.log('❌ Height validation failed');
    }
    if (!formData.bodyType.trim()) {
      newErrors.bodyType = 'Body type is required';
      console.log('❌ Body type validation failed');
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
      console.log('❌ Area validation failed');
    }
    if (!formData.textArea.trim()) {
      newErrors.textArea = 'Tell us about yourself';
      console.log('❌ Text area validation failed');
    }

    // Contact validation (at least one required)
    if (!formData.email.trim() && !formData.number.trim()) {
      newErrors.contact = 'Please provide either email or phone number';
      console.log('❌ Contact validation failed');
    }

    // Email validation
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = 'Invalid email format';
      console.log('❌ Email format validation failed');
    }

    // Image validation
    if (files.length < 3) {
      newErrors.images = 'Minimum 3 images required';
      console.log('❌ Image validation failed - only', files.length, 'images');
    } else {
      console.log('✅ Image validation passed -', files.length, 'images');
    }

    console.log('📋 Validation errors found:', Object.keys(newErrors).length);
    console.log('❌ Detailed errors:', newErrors);
    return newErrors;
  };

  // ============================================
  // 📤 Form Submit Handler - PROFILES array-তে save করবে
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    console.log('🚀 ========== FORM SUBMISSION STARTED ==========');
    console.log('🖱️ Submit button clicked');

    // Collect form data
    const formData = {
      firstName: form.firstName.value,
      age: form.age.value,
      height: form.height.value,
      bodyType: form.bodyType.value,
      area: form.area.value,
      textArea: form.textArea.value,
      dealBreaks: form.dealBreaks.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
      location: form.location.value,
      name: form.name.value,
      email: form.email.value,
      number: form.number.value,
    };

    console.log('📝 Form data collected:', formData);

    // Validate form
    console.log('🔍 Starting form validation...');
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('❌ ========== VALIDATION FAILED ==========');
      console.log('🚫 Errors preventing submission:', validationErrors);
      alert('⚠️ Please fix all errors before submitting');
      return;
    }

    console.log('✅ ========== VALIDATION PASSED ==========');
    setErrors({});
    setSubmitLoading(true);
    console.log('⏳ Submit loading state: true');

    try {
      console.log('🖼️ Starting image processing...');
      console.log('📸 Total files to process:', files.length);

      // ============================================
      // 🖼️ Convert images to Base64 for JSON storage
      // ============================================
      const imagePromises = files.map((file, index) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadstart = () => {
            console.log(`🔄 Converting image ${index + 1}: ${file.name}`);
          };
          reader.onloadend = () => {
            console.log(`✅ Image ${index + 1} converted to Base64`);
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result, // Base64 string
            });
          };
          reader.onerror = (error) => {
            console.error(`❌ Failed to convert image ${index + 1}:`, error);
            reject(error);
          };
          reader.readAsDataURL(file);
        });
      });

      console.log('⏳ Waiting for all images to convert...');
      const imageData = await Promise.all(imagePromises);
      console.log('🎉 All images converted successfully!');
      console.log('📊 Image data prepared:', imageData.length, 'images');

      // Prepare final payload for PROFILES array
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const payload = {
        id: Date.now(), // Unique ID for JSON Server
        date: formattedDate, // "October 7, 2025" format
        name: formData.firstName, // Display name
        age: `${formData.age} years`, // "25 years" format
        height: formData.height, // "5'7" format
        // Additional fields from your form
        bodyType: formData.bodyType,
        area: formData.area,
        textArea: formData.textArea,
        dealBreaks: formData.dealBreaks,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        contactName: formData.name,
        email: formData.email,
        number: formData.number,
        images: imageData, // Array of image objects with Base64 data
        submittedAt: new Date().toISOString(),
        status: 'pending_review',
        totalImages: imageData.length,
      };

      console.log('📦 ========== FINAL PAYLOAD READY ==========');
      console.log('📋 Payload overview:', {
        id: payload.id,
        date: payload.date,
        name: payload.name,
        age: payload.age,
        height: payload.height,
        totalImages: payload.images.length,
        status: payload.status,
      });
      console.log('📊 Total images in payload:', payload.images.length);
      console.log('🕒 Submission timestamp:', payload.submittedAt);
      console.log('🎯 Target URL: http://localhost:5000/profiles');
      console.log('💾 Data will be saved in db.json under "profiles" array');

      // Submit to JSON Server - PROFILES array-তে save করবে
      console.log('📤 ========== STARTING ACTUAL API CALL ==========');
      const response = await postData('profiles', payload);

      console.log('✅ ========== SUBMISSION SUCCESSFUL ==========');
      console.log('📨 API Response:', response);
      console.log('🎉 Profile data submitted to JSON Server successfully!');
      console.log('💾 Data saved in db.json under "profiles" array');

      alert(
        '✅ Your profile has been submitted successfully! Data saved to database.'
      );

      // Reset form and files
      console.log('🔄 Resetting form and files...');
      form.reset();
      setFiles([]);
      setImagePreviews([]);
      console.log('✅ Form reset complete');
    } catch (err) {
      console.error('❌ ========== SUBMISSION FAILED ==========');
      console.error('💥 Error details:', err);
      console.error('🚨 Error response:', err.response?.data);
      console.error('🔧 Error config:', err.config);

      if (err.response) {
        // Server responded with error status
        alert(
          `❌ Server Error: ${err.response.status} - ${
            err.response.data?.message || 'Please try again!'
          }`
        );
      } else if (err.request) {
        // Network error
        alert(
          '❌ Network Error: Please check if JSON Server is running on http://localhost:5000'
        );
      } else {
        // Other errors
        alert('❌ Failed to submit your profile. Please try again!');
      }
    } finally {
      setSubmitLoading(false);
      console.log('⏳ Submit loading state: false');
      console.log('🏁 ========== FORM SUBMISSION COMPLETED ==========');
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      console.log('🧹 Cleaned up image preview URLs');
    };
  }, [imagePreviews]);

  return (
    <div className='px-[10px] py-10 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen text-white font-sans'>
      <form onSubmit={handleSubmit}>
        <div className='max-w-[600px] mx-auto'>
          {/* Header */}
          <div className='flex justify-center mb-6'>
            <img
              src='/img/page/home/remove_preview.png'
              alt='preview'
              className='w-[146px] h-[104px] bg-cover object-cover'
            />
          </div>
          <div className='text-center mb-6'>
            <h2 className='font-bold md:text-[32px] text-xl'>
              Setup Your Profile
            </h2>
          </div>

          {/* Form Fields */}
          <div className='md:my-20 my-10'>
            <div className='self-stretch flex flex-col gap-2 my-5'>
              <label className='text-white text-xl font-medium mb-4'>
                Name <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='firstName'
                placeholder='Enter Display Name'
                className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-500'
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.firstName && (
                <p className='text-red-500 text-sm'>{errors.firstName}</p>
              )}
            </div>

            <div className='self-stretch flex flex-col gap-2 my-5'>
              <label className='text-white text-xl font-medium mb-4'>
                Age <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='age'
                placeholder='Enter your date of birth'
                className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.age ? 'border-red-500' : 'border-gray-500'
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.age && (
                <p className='text-red-500 text-sm'>{errors.age}</p>
              )}
              <p className='text-xs font-normal text-gray-400 w-[350px] my-2'>
                (We only store your month and year of birth which will calculate
                your age as of the 28th of your birth month.)
              </p>
              <p className='text-xs font-normal text-gray-400 w-[350px] md:mb-2 mb-1 flex items-center gap-2'>
                <BiErrorCircle className='text-orange-500 w-5 h-5' />
                Must be 18 or older
              </p>
            </div>

            <div className='flex items-center gap-4 w-full my-5'>
              <div className='self-stretch flex flex-col gap-2 w-full'>
                <label className='text-white text-xl font-medium mb-[8px]'>
                  Height <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='height'
                  placeholder='Enter your Height'
                  className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                    errors.height ? 'border-red-500' : 'border-gray-500'
                  } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
                />
                {errors.height && (
                  <p className='text-red-500 text-sm'>{errors.height}</p>
                )}
              </div>
              <div className='self-stretch flex flex-col gap-2 w-full'>
                <label className='text-white text-xl font-medium mb-[8px]'>
                  Body Type <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='bodyType'
                  placeholder='Describe your body type'
                  className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                    errors.bodyType ? 'border-red-500' : 'border-gray-500'
                  } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
                />
                {errors.bodyType && (
                  <p className='text-red-500 text-sm'>{errors.bodyType}</p>
                )}
              </div>
            </div>

            <div className='self-stretch flex flex-col gap-2 w-full'>
              <label className='text-white text-xl font-medium mb-[8px]'>
                Area <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='area'
                placeholder='Enter your country and state'
                className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.area ? 'border-red-500' : 'border-gray-500'
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.area && (
                <p className='text-red-500 text-sm'>{errors.area}</p>
              )}
            </div>

            <div className='self-stretch flex flex-col gap-2 w-full my-5'>
              <label className='text-white text-xl font-medium mb-[8px]'>
                Dealbreakers
              </label>
              <input
                type='text'
                name='dealBreaks'
                placeholder="Enter your no go's"
                className='h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border border-gray-500 text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300'
              />
            </div>

            <div className='self-stretch flex flex-col gap-2 w-full my-5'>
              <label className='text-white text-xl font-medium mb-[8px]'>
                Tell Me About You <span className='text-red-500'>*</span>
              </label>
              <textarea
                rows='5'
                name='textArea'
                placeholder='Write your message here...'
                className={`w-full max-h-[265px] min-h-[265px] px-3 pt-1 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.textArea ? 'border-red-500' : 'border-gray-500'
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.textArea && (
                <p className='text-red-500 text-sm'>{errors.textArea}</p>
              )}
            </div>
          </div>

          {/* Travel Mode */}
          <div className='bg-[#434343] px-3 py-8 rounded-lg'>
            <h2 className='font-bold text-2xl text-center'>Travel Mode</h2>
            <div className='w-full flex items-center md:gap-5 gap-3 my-6'>
              <div className='self-stretch flex flex-col gap-2 w-[48%]'>
                <label className='text-white text-base font-semibold'>
                  Start Date
                </label>
                <input
                  type='date'
                  name='startDate'
                  className='h-11 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
                />
              </div>
              <div className='self-stretch flex flex-col gap-2 w-[48%]'>
                <label className='text-white text-base font-semibold'>
                  End Date
                </label>
                <input
                  type='date'
                  name='endDate'
                  className='h-11 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
                />
              </div>
            </div>
            <div className='self-stretch flex flex-col gap-2 w-full'>
              <label className='text-white text-base font-semibold'>
                Location
              </label>
              <input
                type='text'
                name='location'
                placeholder='Enter your location'
                className='h-11 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
              />
            </div>
          </div>

          {/* Add Images */}
          <div className='my-10'>
            <h2 className='font-medium text-xl'>
              Add Images <span className='text-red-500'>* (Min 3)</span>
            </h2>
            <div className='px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-6'>
              <BiErrorCircle className='w-10 h-10 text-orange-500' />
              <p className='font-normal text-base'>
                One showing eyes, one showing a toothy grin and one showing full
                body. Be classy, not trashy. No nudes. G or PG rated photos
                only.
              </p>
            </div>
          </div>

          {/* File Upload - UPDATED SECTION */}
          <div className='flex items-center justify-center'>
            <div className='w-full space-y-4'>
              <div className='bg-white rounded-xl p-12 flex flex-col items-center justify-center shadow-md'>
                <div
                  className='w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-orange-600 transition'
                  onClick={handleClick}
                >
                  <Upload className='w-8 h-8 text-white' strokeWidth={2.5} />
                </div>
                <h2 className='text-gray-800 font-semibold text-lg mb-2'>
                  Upload Photos
                </h2>
                <p className='text-gray-500 text-[10px] text-center mb-4 max-w-[288px] mx-auto'>
                  Minimum 3 photos required • Maximum 13 photos allowed
                </p>

                {/* Upload Progress Indicator */}
                <div className='w-full max-w-xs mb-4'>
                  <div className='flex justify-between text-xs text-gray-600 mb-1'>
                    <span>Upload Progress</span>
                    <span>{files.length}/13 images</span>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${(files.length / 13) * 100}%` }}
                    ></div>
                  </div>
                  <div className='flex justify-between text-xs text-gray-500 mt-1'>
                    <span>Min: 3</span>
                    <span
                      className={
                        files.length < 3
                          ? 'text-red-500 font-semibold'
                          : 'text-green-500 font-semibold'
                      }
                    >
                      {files.length >= 3
                        ? '✓ Requirement met'
                        : 'Need more images'}
                    </span>
                  </div>
                </div>

                <input
                  type='file'
                  accept='image/*'
                  multiple
                  ref={fileInputRef}
                  className='hidden'
                  onChange={handleFileChange}
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className='mt-4 w-full'>
                    <div className='grid grid-cols-3 gap-3 mb-4'>
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className='relative group'>
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className='w-full h-24 object-cover rounded-lg border-2 border-gray-200'
                          />
                          <button
                            type='button'
                            onClick={() => removeImage(idx)}
                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition'
                          >
                            <RiDeleteBinLine className='w-4 h-4' />
                          </button>
                          <div className='absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded'>
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Status */}
                    <div
                      className={`text-center p-2 rounded-lg ${
                        files.length >= 3
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {files.length >= 3 ? (
                        <div className='flex items-center justify-center gap-2'>
                          <GiCheckMark className='w-4 h-4' />
                          Ready to submit! ({files.length}/13 images)
                        </div>
                      ) : (
                        <div className='flex items-center justify-center gap-2'>
                          <BiErrorCircle className='w-4 h-4' />
                          {3 - files.length} more image
                          {3 - files.length !== 1 ? 's' : ''} needed
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Instructions */}
                <div className='mt-4 text-center'>
                  <p className='text-sm text-gray-600 font-semibold'>
                    📸 How to upload multiple images:
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    • Hold <kbd className='px-1 bg-gray-200 rounded'>Ctrl</kbd>{' '}
                    (Windows) or{' '}
                    <kbd className='px-1 bg-gray-200 rounded'>Cmd</kbd> (Mac)
                  </p>
                  <p className='text-xs text-gray-500'>
                    • Click and drag to select multiple files
                  </p>
                </div>

                {errors.images && (
                  <div className='mt-3 p-2 bg-red-100 border border-red-300 rounded-lg'>
                    <p className='text-red-600 text-sm font-semibold flex items-center gap-2'>
                      <BiErrorCircle className='w-4 h-4' />
                      {errors.images}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className='bg-[#FFFFFF33] p-5 rounded-lg my-8'>
            <div className='w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1 flex justify-center text-center mx-auto mb-5'>
              <MdOutlinePrivacyTip className='w-full h-full text-white' />
            </div>
            <p className='font-normal text-lg text-center'>
              Your safety is what inspired us. You don't know anything about the
              person you or your friend have given the card to. Please be smart
              about what information you share.
            </p>
          </div>

          <div className='px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-10'>
            <RiDeleteBinLine className='w-14 h-14 text-orange-500' />
            <p className='font-normal text-base'>
              Your cards will be sent to you after your profile has been
              approved for not violating decency standards.
            </p>
          </div>

          {/* Contact Information */}
          <div className='bg-[#434343] px-4 py-6 rounded-lg '>
            <div className='max-w-[330px] mx-auto mb-6'>
              <h2 className='font-semibold text-xl mb-4'>
                Person to person dating, but with a safer approach.
              </h2>
              <p className='font-normal text-base'>
                This is your "safe share" zone – just the details you choose to
                pass along.
              </p>
            </div>

            {errors.contact && (
              <p className='text-red-500 text-center mb-4'>{errors.contact}</p>
            )}

            <div className='max-w-[340px] mx-auto'>
              <div className='self-stretch flex flex-col gap-2'>
                <label className='text-white text-base font-semibold'>
                  Name
                </label>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter your display name'
                  className='h-11 px-3 bg-white text-gray-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
                />
              </div>

              <div className='self-stretch flex flex-col gap-2 mt-6'>
                <label className='text-white text-base font-semibold'>
                  E-mail
                </label>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter your unique email'
                  className={`h-11 px-3 bg-white text-gray-700 text-sm font-medium rounded-lg outline outline-1 ${
                    errors.email ? 'outline-red-500' : 'outline-gray-300'
                  } focus:outline-orange-500 focus:ring-2 focus:ring-orange-400`}
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email}</p>
                )}
              </div>

              <div className='md:my-8 my-4'>
                <h2 className='text-base font-semibold text-center'>and/or</h2>
              </div>

              <div className='self-stretch flex flex-col gap-2'>
                <label className='text-white text-base font-semibold'>
                  Phone number
                </label>
                <input
                  type='tel'
                  name='number'
                  placeholder='Enter your dedicated phone number'
                  className='h-11 px-3 bg-white text-gray-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
                />
              </div>
            </div>

            <Link
              to='/welcome'
              className='rounded-lg text-white text-base font-semibold transition'
            >
              After
            </Link>
          </div>
          <button
            type='submit'
            disabled={submitLoading}
            className={`w-full mt-6 p-2.5 rounded-lg text-white text-base font-semibold transition ${
              submitLoading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {submitLoading ? '⏳ Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetupProfileView;
