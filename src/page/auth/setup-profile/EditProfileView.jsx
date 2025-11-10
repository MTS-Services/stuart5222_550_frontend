import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { BiErrorCircle } from "react-icons/bi";
import { GiCheckMark } from "react-icons/gi";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { validateForm } from "../../../utils/validateForm";
import {
  profileStatusChange,
  submitEditProfile,
  fetchUserProfile,
} from "../../../features/public/profile/profileFetch";
import { useParams } from "react-router-dom";

const EditProfileView = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const { user_email } = useParams();

  const dispatch = useDispatch();
  // ============================================
  // 📸 Image Upload Handler with Preview
  // ============================================
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const existingImageCount = profileData?.images?.length || 0;
    const maxNewFiles = 13 - existingImageCount;
    
    if (selectedFiles.length > maxNewFiles) {
      toast.warn(`You can only upload ${maxNewFiles} more image${maxNewFiles > 1 ? 's' : ''} (you already have ${existingImageCount})`);
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.warn("Please upload only image files");
      return;
    }

    setFiles(validFiles);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    
    // Combine existing image URLs with new file previews
    const existingImageUrls = profileData?.images?.map(img => img.url) || [];
    setImagePreviews([...existingImageUrls, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const existingImageCount = profileData?.images?.length || 0;
    
    // Only allow removing newly uploaded files, not existing images
    if (index < existingImageCount) {
      toast.warn("Cannot remove existing images. You can only remove newly uploaded files.");
      return;
    }
    
    const newFileIndex = index - existingImageCount;
    const newFiles = files.filter((_, i) => i !== newFileIndex);
    setFiles(newFiles);
    
    // Update imagePreviews by removing only the new file preview
    const existingPreviews = imagePreviews.slice(0, existingImageCount);
    const newPreviews = imagePreviews.slice(existingImageCount).filter((_, i) => i !== newFileIndex);
    setImagePreviews([...existingPreviews, ...newPreviews]);
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
      displayName: form.firstName.value,
      age: form.age.value,
      height: form.height.value,
      bodyType: form.bodyType.value,
      area: form.area.value,
      bio: form.textArea.value,
      dealbreakers: form.dealBreaks.value,
      startDate: form.startDate.value || null,
      endDate: form.endDate.value || null,
      location: form.location.value,
      email: user_email,
      phone: form.number.value || null,
      gmail: form.gmail.value || null,
    };

    // ✅ Validate form data (excluding images since we handle that separately)
    const validationErrors = validateForm(formData, []); // Pass empty array for files to skip image validation
    
    // Remove image validation from the form errors since we handle it separately
    delete validationErrors.images;
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warn("Please fix all errors before submitting");
      return;
    }

    // Calculate total image count (existing + new)
    const existingImageCount = profileData?.images?.length || 0;
    const totalImageCount = existingImageCount + files.length;

    if (totalImageCount < 3) {
      const needed = 3 - totalImageCount;
      setErrors({ images: `Minimum 3 images required. You need ${needed} more image${needed > 1 ? 's' : ''}` });
      toast.warn(`Please upload ${needed} more image${needed > 1 ? 's' : ''} before submitting`);
      return;
    }

    setErrors({});
    setSubmitLoading(true);

    try {
      // 📤 Build FormData with image array
      const submitData = new FormData();
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });

      files.forEach((file) => {
        submitData.append("image", file);
      });

      await dispatch(submitEditProfile(submitData)).unwrap();
      // Note: For profile editing, we don't need to change status again
      // The backend will handle the status change if needed
      toast.success("Profile updated successfully!");
      form.reset();
      setSuccess(true);
      setFiles([]);
      setImagePreviews([]);
    } catch (err) {
      console.error("Submission error:", err);
      toast.warn(err?.message || "Failed to submit profile. Please try again.");
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

  // 🔄 Fetch profile data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!user_email) {
        toast.error("No email provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching profile for email:", user_email);
        const result = await dispatch(fetchUserProfile({ userMail: user_email }));
        console.log("Fetch result:", result);
        
        if (result.type === "user/fetchProfile/fulfilled") {
          console.log("Fetched profile data:", result.payload);
          setProfileData(result.payload);
          
          // Pre-populate images if they exist
          if (result.payload?.images?.length > 0) {
            const imageUrls = result.payload.images.map(img => img.url);
            setImagePreviews(imageUrls);
            // Note: We can't set the actual files since they're URLs, not File objects
            // The backend should handle existing images separately
          } else {
            setImagePreviews([]);
          }
        } else {
          console.error("Fetch failed:", result);
          toast.error(result.payload || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_email, dispatch]);

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#3B3B3D] px-[10px] py-10 font-raleway text-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mx-auto"></div>
          <h2 className="mb-4 font-raleway text-xl font-bold">
            Loading your profile...
          </h2>
          <p className="font-raleway text-gray-400">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#3B3B3D] px-[10px] py-10 font-raleway text-white sm:py-4 md:py-6 lg:py-8">
        <h2 className="mb-4 font-raleway text-xl font-bold md:text-[32px]">
          Your Profile Updated Successfully!
        </h2>
        <p className="font-raleway text-gray-400">
          Your profile changes have been saved and submitted for review.
        </p>
        <button
          onClick={() => window.location.replace("/")}
          className="mt-6 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3B3B3D] px-[10px] font-raleway text-white sm:py-4 md:py-6 lg:py-8">
      <form onSubmit={handleSubmit} key={profileData ? 'loaded' : 'loading'}>
        <div className="mx-auto max-w-[600px]">
          {/* Header */}
          <div className="flex justify-center py-[40px]">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-24 w-36 object-cover"
            />
          </div>
          <div className="mb-6 text-center">
            <h2 className="font-raleway text-xl font-bold md:text-[32px]">
              Update Your Profile
            </h2>
            {profileData && (
              <p className="mt-2 text-sm text-gray-400">
                Profile loaded: {profileData.email}
              </p>
            )}
          </div>

          {/* Form Fields */}
          <div className="my-10 md:my-20">
            <div className="my-5 flex flex-col gap-2 self-stretch">
              <label className="mb-4 font-raleway text-xl font-medium text-white">
                Name <span className="font-raleway text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter Display Name"
                defaultValue={profileData?.displayName || ""}
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.firstName ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.firstName && (
                <p className="font-raleway text-sm text-red-500">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="my-5 flex flex-col gap-2 self-stretch">
              <label className="mb-4 font-raleway text-xl font-medium text-white">
                Age <span className="font-raleway text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                defaultValue={profileData?.age || ""}
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.age ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.age && (
                <p className="font-raleway text-sm text-red-500">
                  {errors.age}
                </p>
              )}
              <p className="my-2 font-raleway text-xs font-normal text-gray-400">
                (We only store your month and year of birth which will calculate
                your age as of the 28th of your birth month.)
              </p>
              <p className="mb-1 flex items-center gap-2 font-raleway text-xs font-normal text-gray-400 md:mb-2">
                <BiErrorCircle className="h-5 w-5 text-orange-500" />
                Must be 18 or older
              </p>
            </div>

            <div className="flex w-full flex-col gap-2">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Height <span className="font-raleway text-red-500">*</span>
              </label>
              <input
                type="text"
                name="height"
                placeholder="Enter your Height"
                defaultValue={profileData?.height || ""}
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.height ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.height && (
                <p className="font-raleway text-sm text-red-500">
                  {errors.height}
                </p>
              )}
            </div>

            <div className="my-5 flex w-full flex-col gap-2">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Body Type <span className="font-raleway text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bodyType"
                placeholder="Describe your body type"
                defaultValue={profileData?.bodyType || ""}
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.bodyType ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />

              {errors.bodyType && (
                <p className="font-raleway text-sm text-red-500">
                  {errors.bodyType}
                </p>
              )}
            </div>

            <div className="my-5 flex w-full flex-col gap-2 self-stretch">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Area <span className="font-raleway text-red-500">*</span>
              </label>
              <input
                type="text"
                name="area"
                placeholder="Enter your country and state"
                defaultValue={profileData?.area || ""}
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.area ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.area && (
                <p className="font-raleway text-sm text-red-500">
                  {errors.area}
                </p>
              )}
            </div>

            <div className="my-5 flex w-full flex-col gap-2 self-stretch">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Dealbreakers
              </label>
              <input
                type="text"
                name="dealBreaks"
                placeholder="Enter your no go's"
                defaultValue={profileData?.dealbreakers || ""}
                className="h-11 rounded-lg border border-gray-500 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-gray-400 focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>

            <div className="my-5 flex w-full flex-col gap-2 self-stretch">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Tell Me About You{" "}
                <span className="font-raleway text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                name="textArea"
                placeholder="Write your message here..."
                defaultValue={profileData?.bio || ""}
                className={`max-h-[265px] min-h-[265px] w-full border bg-transparent px-3 pt-1 text-white placeholder:text-gray-400 ${
                  errors.textArea ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.textArea && (
                <p className="font-raleway text-sm text-red-500">
                  {errors.textArea}
                </p>
              )}
            </div>
          </div>

          {/* Travel Mode */}
          <div className="rounded-lg bg-[#434343] px-3 py-8">
            <h2 className="text-center font-raleway text-2xl font-bold">
              Travel Mode
            </h2>
            <div className="my-6 flex w-full items-center gap-3 md:gap-5">
              <div className="flex w-[48%] flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={profileData?.startDate || ""}
                  className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-800 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex w-[48%] flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={profileData?.endDate || ""}
                  className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-800 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 self-stretch">
              <label className="font-raleway text-base font-semibold text-white">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter your location"
                defaultValue={profileData?.location || ""}
                className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-800 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Add Images */}
          <div className="my-10">
            <h2 className="font-raleway text-xl font-medium">
              Add Images{" "}
              <span className="font-raleway text-red-500">* (Min 3)</span>
            </h2>
            <div className="my-6 flex items-center gap-4 rounded-lg bg-[#FFFFFF33] px-3 py-8">
              <BiErrorCircle className="h-10 w-10 text-orange-500" />
              <p className="font-raleway text-base font-normal">
                One showing eyes, one showing a toothy grin and one showing full
                body. Be classy, not trashy. No nudes. G or PG rated photos
                only.
              </p>
            </div>
          </div>
          {/* 🖼️ File Upload - FINALIZED SECTION */}
          <div className="flex items-center justify-center">
            <div className="w-full space-y-4">
              <div className="flex flex-col items-center justify-center rounded-xl bg-white p-8 shadow-md">
                {/* Upload Button */}
                <div
                  className="mb-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl bg-orange-500 transition hover:bg-orange-600"
                  onClick={handleClick}
                >
                  <Upload className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>

                <h2 className="mb-2 font-raleway text-lg font-semibold text-gray-800">
                  Upload Photos
                </h2>
                <p className="mx-auto mb-4 max-w-[288px] text-center font-raleway text-[10px] text-gray-500">
                  Minimum 3 photos required • Maximum 13 photos allowed
                </p>

                {/* Upload Progress Indicator */}
                <div className="mb-4 w-full max-w-xs">
                  <div className="mb-1 flex justify-between text-xs text-gray-600">
                    <span>Upload Progress</span>
                    <span>{(profileData?.images?.length || 0) + files.length}/13 images</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${(((profileData?.images?.length || 0) + files.length) / 13) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Min: 3</span>
                    <span
                      className={
                        ((profileData?.images?.length || 0) + files.length) < 3
                          ? "font-semibold text-red-500"
                          : "font-semibold text-green-500"
                      }
                    >
                      {((profileData?.images?.length || 0) + files.length) >= 3
                        ? "✓ Requirement met"
                        : `Need ${3 - ((profileData?.images?.length || 0) + files.length)} more image${(3 - ((profileData?.images?.length || 0) + files.length)) > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 w-full">
                    <div className="mb-2 text-center text-sm text-gray-400">
                      {profileData?.images?.length > 0 && (
                        <span>Existing: {profileData.images.length} | </span>
                      )}
                      New uploads: {files.length} | Total: {(profileData?.images?.length || 0) + files.length}
                    </div>
                    <div className="mb-4 grid grid-cols-3 gap-3">
                      {imagePreviews.map((preview, idx) => {
                        const isExistingImage = idx < (profileData?.images?.length || 0);
                        return (
                          <div key={idx} className="group relative">
                            <img
                              src={preview}
                              alt={`Preview ${idx + 1}`}
                              className="h-24 w-full rounded-lg border-2 border-gray-200 object-cover"
                            />
                            {!isExistingImage && (
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                              >
                                <RiDeleteBinLine className="h-4 w-4" />
                              </button>
                            )}

                            {/* 🔖 Image Type Label */}
                            <div className={`absolute bottom-1 left-1 rounded px-2 py-[2px] text-[10px] text-white ${isExistingImage ? 'bg-blue-600 bg-opacity-80' : 'bg-black bg-opacity-60'}`}>
                              {isExistingImage ? 'Existing' : 'New'} - {idx === 0
                                ? "Face"
                                : idx === 1
                                  ? "Full Body"
                                  : idx === 2
                                    ? "Third"
                                    : `Extra ${idx - 2}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Upload Status */}
                    <div
                      className={`rounded-lg p-2 text-center ${
                        ((profileData?.images?.length || 0) + files.length) >= 3
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {((profileData?.images?.length || 0) + files.length) >= 3 ? (
                        <div className="flex items-center justify-center gap-2">
                          <GiCheckMark className="h-4 w-4" />
                          Ready to submit! ({(profileData?.images?.length || 0) + files.length}/13 images)
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <BiErrorCircle className="h-4 w-4" />
                          {3 - ((profileData?.images?.length || 0) + files.length)} more image
                          {3 - ((profileData?.images?.length || 0) + files.length) !== 1 ? "s" : ""} needed
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Instructions */}
                <div className="mt-4 text-center">
                  <p className="flex items-center gap-1 font-raleway text-sm font-semibold text-gray-600">
                    <span>
                      <FaCamera />
                    </span>
                    How to upload multiple images:
                  </p>
                  <p className="mt-1 font-raleway text-xs text-gray-500">
                    • Hold <kbd className="rounded bg-gray-200 px-1">Ctrl</kbd>{" "}
                    (Windows) or{" "}
                    <kbd className="rounded bg-gray-200 px-1">Cmd</kbd> (Mac)
                  </p>
                  <p className="font-raleway text-xs text-gray-500">
                    • Click and drag to select multiple files
                  </p>
                </div>

                {/* Error Display */}
                {errors.images && (
                  <div className="mt-3 rounded-lg border border-red-300 bg-red-100 p-2">
                    <p className="flex items-center gap-2 font-raleway text-sm font-semibold text-red-600">
                      <BiErrorCircle className="h-4 w-4" />
                      {errors.images}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="my-8 rounded-lg bg-[#FFFFFF33] p-5">
            <div className="relative mx-auto mb-5 flex h-10 w-10 justify-center overflow-hidden rounded bg-orange-500 p-1 text-center">
              <MdOutlinePrivacyTip className="h-full w-full font-raleway text-white" />
            </div>
            <p className="text-center font-raleway text-base font-normal leading-6">
              Your safety is what inspired us. You don't know anything about the
              person you or your friend have given the card to. Please be smart
              about what information you share.
            </p>
          </div>

          <div className="my-10 flex items-center gap-4 rounded-lg bg-[#FFFFFF33] px-3 py-8">
            <RiDeleteBinLine className="h-14 w-14 text-orange-500" />
            <p className="font-raleway text-base font-normal">
              Your cards will be sent to you after your profile has been
              approved for not violating decency standards.
            </p>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg bg-[#434343] px-4 py-8">
            <div className="mb-6">
              <h2 className="mb-6 font-raleway text-xl font-bold leading-6">
                Person to person dating, but with a safer approach.
              </h2>
              <p className="font-raleway leading-6">
                This is your "safe share" zone – just the details you choose to
                pass along.
              </p>
            </div>

            {errors.contact && (
              <p className="mb-4 text-center font-raleway text-red-500">
                {errors.contact}
              </p>
            )}

            <div className="">
              <div className="flex flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your display name"
                  defaultValue={profileData?.displayName || ""}
                  className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="mt-6 flex flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  E-mail
                </label>
                <input
                  type="gmail"
                  name="gmail"
                  placeholder="Enter your unique email"
                  defaultValue={profileData?.gmail || user_email}
                  className={`h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-700 outline outline-1 ${
                    errors.gamil ? "outline-red-500" : "outline-gray-300"
                  } focus:outline-orange-500 focus:ring-2 focus:ring-orange-400`}
                />
                {errors.gamil && (
                  <p className="font-raleway text-sm text-red-500">
                    {errors.gamil}
                  </p>
                )}
              </div>

              <div className="my-4 md:my-8">
                <h2 className="text-center font-raleway text-base font-semibold">
                  and/or
                </h2>
              </div>

              <div className="flex flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="number"
                  placeholder="Enter your dedicated phone number"
                  defaultValue={profileData?.phone || ""}
                  className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="mt-10 w-full rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-orange-600"
          >
            {submitLoading ? "Submitting..." : "Submit Profile for Review"}
          </button>
          <div className="mx-auto mb-6 mt-10 max-w-[600px]">
            <p className="text-center font-raleway text-sm text-gray-400">
              By submitting your profile, you agree to our{" "}
              <a
                href="/terms"
                className="font-raleway text-orange-500 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="font-raleway text-orange-500 hover:underline"
              >
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

export default EditProfileView;
