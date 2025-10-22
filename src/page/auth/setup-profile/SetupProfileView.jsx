import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCheckMark } from 'react-icons/gi';
import { BiErrorCircle } from 'react-icons/bi';
import { Upload } from 'lucide-react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { submitProfile } from '../../../features/public/profile/profileFetch';
import { validateForm } from '../../../utils/validateForm';

const SetupProfileView = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();

  // ============================================
  // 📸 Image Upload Handler with Preview
  // ============================================
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 13) {
      alert('⚠️ Maximum 13 images allowed (3 required + 10 optional)');
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (validFiles.length !== selectedFiles.length) {
      alert('⚠️ Please upload only image files');
      return;
    }

    setFiles(validFiles);
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // ============================================
  // 📤 Form Submit Handler
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

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

    // ✅ Pass files to validation
    const validationErrors = validateForm(formData, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('⚠️ Please fix all errors before submitting');
      return;
    }

    // ✅ Check minimum 3 image requirement (extra safety)
    if (files.length < 3) {
      setErrors((prev) => ({
        ...prev,
        images: 'Minimum 3 images required',
      }));
      alert('⚠️ Please upload at least 3 images before submitting');
      return;
    }

    setErrors({});
    setSubmitLoading(true);

    try {
      // 🖼️ Convert images to Base64
      const filePaths = files.map((file) => file.name); // or file.path if available

      // 🧩 Separate images into backend-friendly fields
      const facePhoto = filePaths[0] || null;
      const fullBodyPhoto = filePaths[1] || null;
      const thirdPhoto = filePaths[2] || null;
      const additionalPhotos = filePaths.slice(3);

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const payload = {
        id: Date.now(),
        date: formattedDate,
        ...formData,
        facePhoto,
        fullBodyPhoto,
        thirdPhoto,
        additionalPhotos,
        submittedAt: new Date().toISOString(),
        status: 'pending_review',
        totalImages: filePaths.length,
      };

      console.log('✅ Payload ready:', payload);
      await dispatch(submitProfile(payload)).unwrap();

      alert('✅ Profile submitted successfully for review!');
      form.reset();
      setSuccess(true);
      setFiles([]);
      setImagePreviews([]);
    } catch (err) {
      console.error('Submission error:', err);
      alert(err || '❌ Failed to submit profile. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (success) {
    return (
      <div className='px-[10px] py-10 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen text-white font-sans flex flex-col items-center justify-center'>
        <h2 className='font-bold md:text-[32px] text-xl mb-4'>
          Profile Setup Successful!
        </h2>
        <p className='text-gray-400'>
          Your profile has been submitted for review.
        </p>
        <button
          onClick={() => window.location.replace('/')}
          className='mt-6 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600'
        >
          Go to Home
        </button>
      </div>
    );
  }

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
                type='number'
                name='age'
                placeholder='Enter your age'
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
          {/* 🖼️ File Upload - FINALIZED SECTION */}
          <div className='flex items-center justify-center'>
            <div className='w-full space-y-4'>
              <div className='bg-white rounded-xl p-12 flex flex-col items-center justify-center shadow-md relative'>
                {/* Upload Button */}
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

                {/* Hidden File Input */}
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

                          {/* 🔖 Image Type Label */}
                          <div className='absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-[10px] px-2 py-[2px] rounded'>
                            {idx === 0
                              ? 'Face'
                              : idx === 1
                              ? 'Full Body'
                              : idx === 2
                              ? 'Third'
                              : `Extra ${idx - 2}`}
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

                {/* Error Display */}
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
          </div>

          <button
            type='submit'
            disabled={submitLoading}
            className='w-full mt-10 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-lg font-semibold transition'
          >
            {submitLoading ? 'Submitting...' : 'Submit Profile for Review'}
          </button>
          <div className='max-w-[600px] mx-auto mt-10 mb-6'>
            <p className='text-center text-gray-400 text-sm'>
              By submitting your profile, you agree to our{' '}
              <a href='/terms' className='text-orange-500 hover:underline'>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href='/privacy' className='text-orange-500 hover:underline'>
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SetupProfileView;
