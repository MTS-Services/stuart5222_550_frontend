import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { BiErrorCircle } from "react-icons/bi";
import { GiCheckMark } from "react-icons/gi";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdArrowBack, MdOutlinePrivacyTip } from "react-icons/md";
import { validateForm } from "../../../../utils/validateForm";
import { calculateAge, estimateBirthFromAge } from "../../../../utils/ageUtils";
import AgeInput from "../../../../components/common/AgeInput";
import LocationInput from "../../../../components/common/LocationInput";
import HeightInput from "../../../../components/common/HeightInput";
import {
  submitEditProfile,
  fetchUserProfile,
} from "../../../../features/public/profile/profileFetch";
import { Link, useParams } from "react-router-dom";
import { updateUser } from "../../../../features/auth/authSlice";
import { GET } from "../../../../config/api/httpMethods";
import { endpoints } from "../../../../config/api/httpEndpoint";
import CustomModal from "../../../../components/common/CustomModal";

const EditProfileView = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]); // New files to upload
  const [existingImages, setExistingImages] = useState([]); // Existing images from profile
  const [deletedImageUrls, setDeletedImageUrls] = useState([]); // Track deleted

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  // existing images
  const [errors, setErrors] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [birthMonth, setBirthMonth] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [county, setCounty] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const fileInputRef = useRef(null);
  const { email } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const dispatch = useDispatch();
  // ============================================
  // 📸 Improved Image Management
  // ============================================
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalCurrentImages = existingImages.length + files.length;
    const maxNewFiles = 13 - totalCurrentImages;

    if (selectedFiles.length > maxNewFiles) {
      toast.warn(
        `You can only upload ${maxNewFiles} more image${maxNewFiles > 1 ? "s" : ""} (you already have ${totalCurrentImages})`,
      );
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.warn("Please upload only image files");
      return;
    }

    // Add new files to the existing files array
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);

    // Create previews for new files
    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file: file,
    }));

    // Update all image previews (existing + new)
    updateImagePreviews(existingImages, [...files, ...validFiles]);
    e.target.value = "";
  };

  const updateImagePreviews = (existing, newFiles) => {
    const existingPreviews = existing.map((img, index) => ({
      url: img.url,
      isNew: false,
      index: index,
      originalUrl: img.url,
    }));

    const newPreviews = newFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      index: index,
      file: file,
    }));

    setImagePreviews([...existingPreviews, ...newPreviews]);
  };

  const removeExistingImage = async (imageUrl, imageIndex) => {
    try {
      // Call API to delete the image
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile/${email}/image/${imageIndex}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete image");
      }

      // Update local state
      const updatedExisting = existingImages.filter(
        (_, index) => index !== imageIndex,
      );
      setExistingImages(updatedExisting);
      updateImagePreviews(updatedExisting, files);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(error.message || "Failed to delete image");
    }
  };

  const removeNewImage = (fileIndex) => {
    const updatedFiles = files.filter((_, index) => index !== fileIndex);
    setFiles(updatedFiles);
    updateImagePreviews(existingImages, updatedFiles);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const imageUrl = existingImages[index]?.url;
      if (imageUrl) {
        removeExistingImage(imageUrl, index);
      }
    } else {
      // Calculate the index in the new files array
      const newFileIndex = index - existingImages.length;
      removeNewImage(newFileIndex);
    }
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

    // Combine feet and inches into a single height string
    const heightString =
      heightFeet && heightInches ? `${heightFeet}'${heightInches}"` : "";

    // Calculate age from birth month and year
    const calculatedAge = calculateAge(
      parseInt(birthMonth),
      parseInt(birthYear),
    );

    const formData = {
      displayName: form.firstName.value,
      birthMonth: birthMonth,
      birthYear: birthYear,
      age: calculatedAge, // Store calculated age for backward compatibility
      height: heightString,
      bodyType: form.bodyType.value,
      county: county,
      bio: form.textArea.value,
      dealbreakers: form.dealBreaks.value,
      startDate: form.startDate.value || null,
      endDate: form.endDate.value || null,
      location: form.location.value,
      email: email,
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
    const totalImageCount = existingImages.length + files.length;

    if (totalImageCount < 3) {
      const needed = 3 - totalImageCount;
      setErrors({
        images: `Minimum 3 images required. You need ${needed} more image${needed > 1 ? "s" : ""}`,
      });
      toast.warn(
        `Please upload ${needed} more image${needed > 1 ? "s" : ""} before submitting`,
      );
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

      // Fetch updated user data to refresh user status
      try {
        const response = await GET(endpoints.user.USER_PROFILE);
        if (response?.data) {
          dispatch(updateUser(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch updated user data:", error);
      }

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
      if (!email) {
        toast.error("No email provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching profile for email:", email);
        const result = await dispatch(fetchUserProfile({ userMail: email }));

        if (result.type === "user/fetchProfile/fulfilled") {
          setProfileData(result.payload);

          // Initialize birth month/year from age or existing birth data
          if (result.payload.birthMonth && result.payload.birthYear) {
            setBirthMonth(result.payload.birthMonth);
            setBirthYear(result.payload.birthYear);
          } else if (result.payload.age) {
            // Estimate from age for backward compatibility
            const { birthMonth, birthYear } = estimateBirthFromAge(
              result.payload.age,
            );
            setBirthMonth(birthMonth);
            setBirthYear(birthYear);
          }

          // Initialize county
          setCounty(result.payload.county || "");

          // Initialize height from existing data
          if (result.payload.height) {
            const heightParts = result.payload.height.split("'");
            if (heightParts.length >= 2) {
              setHeightFeet(heightParts[0] || "");
              setHeightInches(heightParts[1]?.replace('"', "") || "");
            }
          }

          // Initialize existing images
          if (result.payload?.images?.length > 0) {
            const images = result.payload.images.map((img) => ({
              url: img.url,
            }));
            setExistingImages(images);
            updateImagePreviews(images, []);
          } else {
            setExistingImages([]);
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
  }, [email, dispatch]);

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#3B3B3D] px-[10px] py-10 font-raleway text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
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
          onClick={() => window.location.replace("/user")}
          className="mt-6 rounded-md bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3B3B3D] px-[10px] font-raleway text-white sm:py-4 md:py-6 lg:py-8">
      <form onSubmit={handleSubmit} key={profileData ? "loaded" : "loading"}>
        <div className="mx-auto max-w-[600px]">
          <Link to="/user" className="mb-4 flex items-center gap-2 text-white">
            <MdArrowBack /> Back
          </Link>
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

            {/* Age Input Component */}
            <AgeInput
              birthMonth={birthMonth}
              birthYear={birthYear}
              onBirthMonthChange={setBirthMonth}
              onBirthYearChange={setBirthYear}
              errors={errors}
            />

            {/* Height Input Component */}
            <HeightInput
              heightFeet={heightFeet}
              heightInches={heightInches}
              onHeightFeetChange={setHeightFeet}
              onHeightInchesChange={setHeightInches}
              errors={errors}
              defaultFeet={
                profileData?.height ? profileData.height.split("'")[0] : ""
              }
              defaultInches={
                profileData?.height
                  ? profileData.height.split("'")[1]?.replace('"', "")
                  : ""
              }
            />

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

            {/* Location Input Component */}
            <LocationInput
              county={county}
              onCountyChange={setCounty}
              errors={errors}
              defaultCounty={profileData?.county || ""}
              className="my-5"
            />

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
                    <span>
                      {existingImages.length + files.length}/13 images
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{
                        width: `${((existingImages.length + files.length) / 13) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Min: 3</span>
                    <span
                      className={
                        existingImages.length + files.length < 3
                          ? "font-semibold text-red-500"
                          : "font-semibold text-green-500"
                      }
                    >
                      {existingImages.length + files.length >= 3
                        ? "✓ Requirement met"
                        : `Need ${3 - (existingImages.length + files.length)} more image${3 - (existingImages.length + files.length) > 1 ? "s" : ""}`}
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
                      Existing: {existingImages.length} | New uploads:{" "}
                      {files.length} | Total:{" "}
                      {existingImages.length + files.length}
                    </div>
                    <div className="mb-4 grid grid-cols-3 gap-3">
                      {imagePreviews.map((imageData, idx) => (
                        <div
                          key={`${imageData.isNew ? "new" : "existing"}-${idx}`}
                          className="group relative"
                        >
                          <img
                            src={imageData.url}
                            alt={`Preview ${idx + 1}`}
                            className="h-24 w-full rounded-lg border-2 border-gray-200 object-cover"
                          />

                          {/* Delete Button - now available for all images */}
                          <button
                            type="button"
                            onClick={() => {
                              if (imageData.isNew) {
                                // For new images, calculate the correct index in the files array
                                const newImageIndex =
                                  idx - existingImages.length;
                                removeNewImage(newImageIndex);
                              } else {
                                // For existing images, use the imageData.index
                                removeExistingImage(
                                  imageData.originalUrl,
                                  imageData.index,
                                );
                              }
                            }}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100"
                            title={`Delete ${imageData.isNew ? "new" : "existing"} image`}
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </button>

                          {/* 🔖 Image Type Label */}
                          <div
                            className={`absolute bottom-1 left-1 rounded px-2 py-[2px] text-[10px] text-white ${
                              imageData.isNew
                                ? "bg-green-600 bg-opacity-80"
                                : "bg-blue-600 bg-opacity-80"
                            }`}
                          >
                            {imageData.isNew ? "New" : "Existing"} -{" "}
                            {idx === 0
                              ? "Face"
                              : idx === 1
                                ? "Full Body"
                                : idx === 2
                                  ? "Toothy Grin"
                                  : `Extra ${idx - 2}`}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Status */}
                    <div
                      className={`rounded-lg p-2 text-center ${
                        existingImages.length + files.length >= 3
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {existingImages.length + files.length >= 3 ? (
                        <div className="flex items-center justify-center gap-2">
                          <GiCheckMark className="h-4 w-4" />
                          Ready to submit! (
                          {existingImages.length + files.length}/13 images)
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <BiErrorCircle className="h-4 w-4" />
                          {3 - (existingImages.length + files.length)} more
                          image
                          {3 - (existingImages.length + files.length) !== 1
                            ? "s"
                            : ""}{" "}
                          needed
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
                  defaultValue={profileData?.gmail || email}
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
        </div>
      </form>

      <div className="mx-auto mb-6 mt-10 max-w-[600px]">
        <p className="text-center font-raleway text-sm text-gray-400">
          By submitting your profile, you agree to our{" "}
          <button
            onClick={openModal}
            className="font-raleway text-orange-500 hover:underline"
          >
            Terms of Service{" "}
          </button>{" "}
          and{" "}
          <button
            onClick={openModal}
            className="font-raleway text-orange-500 hover:underline"
          >
            {" "}
            Privacy Policy
          </button>
          .
        </p>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Terms & Conditions"
        size="xl"
      >
        <div className="max-h-96 overflow-y-auto bg-[#3B3B3D] p-4 text-sm text-white">
          <div className="">
            <h3 className="mb-4 text-lg font-bold text-orange-400">
              Yep, this is all the legal gobbledygook.
            </h3>

            <div className="space-y-10">
              <p className="leading-relaxed text-white">
                Welcome to Scan Me Maybe! By using our service, you agree to
                these terms and conditions. Please read them carefully before
                proceeding. By accessing and using Scan Me Maybe, you accept and
                agree to be bound by the terms and provision of this agreement.
              </p>

              <p className="leading-relaxed text-white">
                Permission is granted to temporarily use Scan Me Maybe for
                personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title. Your privacy and
                safety are our top priorities. We implement various security
                measures to protect your personal information and ensure safe
                person-to-person connections.
              </p>

              {/* Easter Egg Story */}
              <div className="rounded-lg border-l-4 border-orange-400 bg-[#505050] p-4">
                <h4 className="mb-3 font-bold text-orange-400">
                  🛒 A Little Story...
                </h4>
                <p className="italic leading-relaxed text-orange-200">
                  Your eyes met across the produce section of the grocery store.
                  "Mmmm. I like what I see." Is there a wedding ring? Are they
                  here with someone? It doesn't look like it. Get brave and whip
                  out the card. What have you got to lose? They could be the
                  one, or they can chuck it in the trash on the way out. At
                  least you took your shot. So brave.
                </p>
              </div>

              <p className="leading-relaxed text-white">
                Users must conduct themselves respectfully and lawfully. Any
                harassment, inappropriate behavior, or misuse of the platform is
                strictly prohibited. The materials on Scan Me Maybe are provided
                on an 'as is' basis. Scan Me Maybe makes no warranties,
                expressed or implied, and hereby disclaims and negates all other
                warranties.
              </p>

              {/* Call to Action */}
              <div className="mt-6 rounded-lg bg-[#505050] p-4">
                <h4 className="mb-3 font-bold text-orange-400">Your Move</h4>
                <p className="leading-relaxed text-white">
                  If you've read this far and you're intrigued, don't overthink
                  it. Let's see what a good conversation might bring. Worst
                  case? We have an interesting chat. Best case? Who knows……
                </p>
              </div>
              <p className="text-center text-xs text-gray-300">
                <hr className="border-1 mb-4 border-gray-600" />
                Last updated: November 8, 2025
                <br />© 2025 Scan Me Maybe, LLC. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default EditProfileView;
