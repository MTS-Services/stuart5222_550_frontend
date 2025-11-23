import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlinePrivacyTip, MdArrowBack } from "react-icons/md";
import { calculateAge } from "../../../../utils/ageUtils";
import AgeInput from "../../../../components/common/AgeInput";
import LocationInput from "../../../../components/common/LocationInput";
import HeightInput from "../../../../components/common/HeightInput";
import { Link, useParams } from "react-router-dom";
import { submitProfile } from "../../../../features/public/profile/profileFetch";
import { validateForm } from "../../../../utils/validateForm";
import { updateUser } from "../../../../features/auth/authSlice";
import { GET } from "../../../../config/api/httpMethods";
import { endpoints } from "../../../../config/api/httpEndpoint";
import CustomModal from "../../../../components/common/CustomModal";

const SetupProfileView = () => {
  const { email } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  console.log("user:", user);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [success, setSuccess] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [imageIds, setImageIds] = useState([]); // Track unique IDs for each image
  const [birthMonth, setBirthMonth] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [county, setCounty] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const fileInputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ============================================
  // 📸 Image Upload Handler with Preview
  // ============================================
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalCurrentImages = files.length;
    const maxNewFiles = 13 - totalCurrentImages;

    // Filter out non-image files first
    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.warn("Some files were skipped - please upload only image files");
    }

    // If no valid files, return early
    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // If selecting more files than allowed, take only the allowed number
    let filesToAdd = validFiles;
    if (validFiles.length > maxNewFiles) {
      filesToAdd = validFiles.slice(0, maxNewFiles);
      if (maxNewFiles === 0) {
        toast.warn("You have already reached the maximum of 13 images");
      } else {
        toast.warn(
          `Only ${maxNewFiles} of ${validFiles.length} image${validFiles.length > 1 ? "s" : ""} added. Maximum 13 images allowed.`,
        );
      }
    }

    // Add new files to the existing files array
    const updatedFiles = [...files, ...filesToAdd];
    setFiles(updatedFiles);

    // Create previews for new files and add to existing previews
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...imagePreviews, ...newPreviews];
    setImagePreviews(updatedPreviews);

    // Generate unique IDs for new images
    const newIds = filesToAdd.map(() => Date.now() + Math.random());
    const updatedIds = [...imageIds, ...newIds];
    setImageIds(updatedIds);

    // Ensure arrays are synchronized
    if (
      updatedFiles.length !== updatedPreviews.length ||
      updatedFiles.length !== updatedIds.length
    ) {
      console.error("Arrays out of sync:", {
        filesLength: updatedFiles.length,
        previewsLength: updatedPreviews.length,
        idsLength: updatedIds.length,
      });
    }

    // Show success message for successfully added files
    // if (filesToAdd.length > 0) {
    //   toast.success(`${filesToAdd.length} image${filesToAdd.length > 1 ? "s" : ""} uploaded successfully!`);
    // }

    e.target.value = "";
  };

  const removeImage = (index) => {
    // Validate index bounds
    if (index < 0 || index >= files.length || index >= imagePreviews.length) {
      console.error("Invalid index for image removal:", index);
      return;
    }

    // Revoke the object URL to free memory before removing
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // Create new arrays without the item at the specified index
    const newFiles = [...files];
    const newPreviews = [...imagePreviews];
    const newIds = [...imageIds];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    newIds.splice(index, 1);

    setFiles(newFiles);
    setImagePreviews(newPreviews);
    setImageIds(newIds);
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
      displayName: user.name || form.displayName.value,
      birthMonth: birthMonth,
      birthYear: birthYear,
      age: calculatedAge, // Store calculated age for backward compatibility
      height: heightString,
      bodyType: form.bodyType.value,
      county: county,
      bio: form.bio.value,
      dealbreakers: form.dealBreaks.value,
      startDate: form.startDate.value || null,
      endDate: form.endDate.value || null,
      location: form.location.value,
      email: email,
      phone: form.number.value || null,
    };

    // ✅ Validate with files
    const validationErrors = validateForm(formData, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warn("Required fields are missing!");
      return;
    }

    if (files.length < 3) {
      setErrors({ images: "Minimum 3 images required" });
      toast.warn("Please upload at least 3 images before submitting");
      return;
    }

    setErrors({});
    setSubmitLoading(true);

    try {
      // Build FormData with image array
      const submitData = new FormData();

      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });

      // Append image files
      files.forEach((file) => {
        submitData.append("image", file);
      });

      await dispatch(submitProfile(submitData)).unwrap();

      // Fetch updated user data to refresh user status
      try {
        const response = await GET(endpoints.user.USER_PROFILE);
        if (response?.data) {
          dispatch(updateUser(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch updated user data:", error);
      }

      toast.success("Profile submitted successfully for review!");
      setSuccess(true);
      setImagePreviews([]);
      setFiles([]);
      setImageIds([]);
    } catch (err) {
      toast.error(err || "❌ Failed to submit profile. Please try again.");
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

  // Ensure files and previews arrays stay synchronized
  useEffect(() => {
    if (
      files.length !== imagePreviews.length ||
      files.length !== imageIds.length
    ) {
      console.warn("⚠️ Arrays are out of sync:", {
        filesLength: files.length,
        previewsLength: imagePreviews.length,
        idsLength: imageIds.length,
        files: files.map((f) => f.name),
        previews: imagePreviews.length,
      });
    }
  }, [files, imagePreviews, imageIds]);

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#3B3B3D] px-[10px] py-10 font-raleway text-white sm:py-4 md:py-6 lg:py-8">
        <h2 className="mb-4 text-xl font-bold md:text-[32px]">
          Profile Setup Successful!
        </h2>
        <p className="text-gray-400">
          Your profile has been submitted for review.
        </p>
        <Link to={`/user`} className="border px-4 py-2 text-white">
          Go to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3B3B3D] px-[10px] font-raleway text-white sm:py-4 md:py-6">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-[600px]">
          <Link to="/user" className="flex items-center gap-2 py-4 text-white">
            <MdArrowBack /> Back
          </Link>

          {/* Header */}
          <div className="flex justify-center py-[20px]">
            <img
              src="/img/assets/logo.png"
              alt="preview"
              className="h-24 w-36 object-cover"
            />
          </div>

          <div className="mb-6 text-center">
            <h2 className="font-raleway text-xl font-bold md:text-[32px]">
              Setup Your Profile
            </h2>
          </div>

          {/* Form Fields */}
          <div className="my-10 md:my-20">
            <div className="my-5 flex flex-col gap-2 self-stretch">
              <label className="mb-4 font-raleway text-xl font-medium text-white">
                Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="displayName"
                disabled={user.name}
                placeholder={`${user.name || "Enter your name"}`}
                className={`h-11 rounded-lg border bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-gray-400 focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />

              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName}</p>
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
            />

            <div className="my-5 flex w-full flex-col gap-2">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Body Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bodyType"
                placeholder="Describe your body type"
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.bodyType ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />

              {errors.bodyType && (
                <p className="text-sm text-red-500">{errors.bodyType}</p>
              )}
            </div>

            {/* Location Input Component */}
            <LocationInput
              county={county}
              onCountyChange={setCounty}
              errors={errors}
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
                className="h-11 rounded-lg border border-gray-500 bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-gray-400 focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>

            <div className="my-5 flex w-full flex-col gap-2 self-stretch">
              <label className="mb-[8px] font-raleway text-xl font-medium text-white">
                Tell Me About You <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                name="bio"
                placeholder="Write your message here..."
                className={`max-h-[265px] min-h-[265px] w-full border bg-transparent px-3 pt-1 text-white placeholder:text-gray-400 ${
                  errors.bio ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio}</p>
              )}
            </div>
          </div>

          {/* Travel Mode */}
          <div className="rounded-lg bg-[#434343] px-3 py-8 font-raleway">
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
                    <span className="font-raleway">Upload Progress</span>
                    <span className="font-raleway">
                      {files.length}/13 images
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${(files.length / 13) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span className="font-raleway">Min: 3</span>
                    <span
                      className={
                        files.length < 3
                          ? "font-raleway font-semibold text-red-500"
                          : "font-raleway font-semibold text-green-500"
                      }
                    >
                      {files.length >= 3
                        ? "✓ Requirement met"
                        : "Need more images"}
                    </span>
                  </div>

                  {/* Dynamic Upload Message */}
                  <div className="mt-2 text-center">
                    <span className="font-raleway text-xs text-gray-600">
                      {files.length === 0
                        ? "You can upload up to 13 images"
                        : files.length === 13
                          ? "Maximum images reached"
                          : `You can upload ${13 - files.length} more image${13 - files.length > 1 ? "s" : ""}`}
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
                    <div className="mb-4 grid grid-cols-3 gap-3">
                      {imagePreviews.map((preview, idx) => (
                        <div
                          key={imageIds[idx] || idx}
                          className="group relative"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="h-24 w-full rounded-lg border-2 border-gray-200 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                          >
                            <RiDeleteBinLine className="h-4 w-4" />
                          </button>

                          {/* 🔖 Image Type Label */}
                          <div className="absolute bottom-1 left-1 rounded bg-black bg-opacity-60 px-2 py-[2px] text-[10px] text-white">
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
                        files.length >= 3
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {files.length >= 3 ? (
                        <div className="flex items-center justify-center gap-2">
                          <GiCheckMark className="h-4 w-4" />
                          <span className="font-raleway">
                            Ready to submit! ({files.length}/13 images)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 font-raleway">
                          <BiErrorCircle className="h-4 w-4" />
                          {3 - files.length} more image
                          {3 - files.length !== 1 ? "s" : ""} needed
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
                    <p className="flex items-center gap-2 text-sm font-semibold text-red-600">
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
              <MdOutlinePrivacyTip className="h-full w-full text-white" />
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
              <p className="mb-4 text-center text-red-500">{errors.contact}</p>
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
                  className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-700 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="mt-6 flex flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your unique email"
                  className={`h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-700 outline outline-1 ${
                    errors.email ? "outline-red-500" : "outline-gray-300"
                  } focus:outline-orange-500 focus:ring-2 focus:ring-orange-400`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="my-4 flex items-center justify-center">
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

      <div className="mx-auto max-w-[600px] py-10">
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

export default SetupProfileView;
