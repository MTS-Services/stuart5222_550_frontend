import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlinePrivacyTip, MdArrowBack } from "react-icons/md";

// Components
import AgeInput from "../../../../components/common/AgeInput";
import HeightInput from "../../../../components/common/HeightInput";
import LocationInput from "../../../../components/common/LocationInput";
import CustomModal from "../../../../components/common/CustomModal";

// Utils & Features
import { calculateAge } from "../../../../utils/ageUtils";
import { validateForm } from "../../../../utils/validateForm";
import { GET } from "../../../../config/api/httpMethods";
import { endpoints } from "../../../../config/api/httpEndpoint";
import { submitProfile } from "../../../../features/public/profile/profileFetch";
import { updateUser } from "../../../../features/auth/authSlice";

const SetupProfileView = () => {
  const dispatch = useDispatch();
  const { email } = useParams();
  const { user } = useSelector((state) => state.auth);

  // State Management
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Data State
  const [birthMonth, setBirthMonth] = useState(null);
  const [birthYear, setBirthYear] = useState(null);
  const [county, setCounty] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");

  // Image Management State
  const [imageSlots, setImageSlots] = useState([]);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  // Modal Handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // ============================================
  // 📸 Image Upload Handler
  // ============================================
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filledSlots = imageSlots.filter((slot) => !slot.isEmpty).length;
    const maxNewFiles = 13 - filledSlots;

    // Filter valid image files
    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type === "image/heif" ||
        file.type === "image/heic" ||
        file.name.toLowerCase().endsWith(".heif") ||
        file.name.toLowerCase().endsWith(".heic"),
    );

    // Handle invalid files
    if (validFiles.length !== selectedFiles.length) {
      const invalidCount = selectedFiles.length - validFiles.length;
      toast.error(
        `${invalidCount} invalid file${invalidCount > 1 ? "s" : ""} skipped. Only image files are allowed.`,
      );
    }

    // Check file sizes (max 100MB per file)
    const maxSize = 100 * 1024 * 1024;
    const oversizedFiles = validFiles.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles
        .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`)
        .join(", ");
      toast.error(
        `Files too large: ${oversizedNames}. Maximum 100MB per file allowed.`,
      );
      e.target.value = "";
      return;
    }

    const finalFiles = validFiles.filter((file) => file.size <= maxSize);
    if (finalFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // Limit files to maximum allowed
    let filesToAdd = finalFiles;
    if (finalFiles.length > maxNewFiles) {
      filesToAdd = finalFiles.slice(0, maxNewFiles);
      if (maxNewFiles === 0) {
        toast.warn("You have already reached the maximum of 13 images");
      } else {
        toast.warn(
          `Only ${maxNewFiles} of ${finalFiles.length} image${finalFiles.length > 1 ? "s" : ""} added.`,
        );
      }
    }

    const updatedSlots = [...imageSlots];
    filesToAdd.forEach((file) => {
      const emptySlotIndex = updatedSlots.findIndex((slot) => slot.isEmpty);
      let imageType, extraKey;

      if (emptySlotIndex !== -1) {
        // Determine image type based on position
        if (emptySlotIndex === 0) imageType = "face";
        else if (emptySlotIndex === 1) imageType = "fullbody";
        else if (emptySlotIndex === 2) imageType = "toothyGrin";
        else {
          imageType = "extra";
          extraKey = `${emptySlotIndex - 2}`;
        }
      } else {
        imageType = "extra";
        extraKey = `${updatedSlots.length - 2}`;
      }

      const newSlot = {
        file: file,
        preview: URL.createObjectURL(file),
        id: Date.now() + Math.random(),
        isEmpty: false,
        imageType: imageType,
        extraKey: extraKey,
      };

      if (emptySlotIndex !== -1) {
        if (updatedSlots[emptySlotIndex].preview) {
          URL.revokeObjectURL(updatedSlots[emptySlotIndex].preview);
        }
        updatedSlots[emptySlotIndex] = newSlot;
      } else {
        updatedSlots.push(newSlot);
      }
    });

    setImageSlots(updatedSlots);
    updateLegacyArrays(updatedSlots);
    checkImageRequirements(updatedSlots);
    e.target.value = "";
  };

  const removeImage = (index) => {
    if (index < 0 || index >= imageSlots.length) {
      console.error("Invalid index for image removal:", index);
      return;
    }

    const updatedSlots = [...imageSlots];
    if (updatedSlots[index].preview) {
      URL.revokeObjectURL(updatedSlots[index].preview);
    }

    if (index < 3) {
      // Keep slot but mark as empty for required images
      const imageType =
        index === 0 ? "face" : index === 1 ? "fullbody" : "toothyGrin";
      updatedSlots[index] = {
        file: null,
        preview: null,
        id: null,
        isEmpty: true,
        imageType: imageType,
      };
    } else {
      // Remove extra slots completely
      updatedSlots.splice(index, 1);
    }

    setImageSlots(updatedSlots);
    updateLegacyArrays(updatedSlots);
    checkImageRequirements(updatedSlots);
  };

  const updateLegacyArrays = (slots) => {
    const activeSlots = slots.filter((slot) => !slot.isEmpty);
    setFiles(activeSlots.map((slot) => slot.file));
    setImagePreviews(activeSlots.map((slot) => slot.preview));
  };

  const checkImageRequirements = (slots) => {
    const activeSlots = slots.filter((slot) => !slot.isEmpty);
    const hasface = activeSlots.some((slot) => slot.imageType === "face");
    const hasFullBody = activeSlots.some(
      (slot) => slot.imageType === "fullbody",
    );
    const hasToothyGrin = activeSlots.some(
      (slot) => slot.imageType === "toothyGrin",
    );

    const missing = [];
    if (!hasface) missing.push("Face");
    if (!hasFullBody) missing.push("Full Body");
    if (!hasToothyGrin) missing.push("Toothy Grin");

    if (missing.length > 0) {
      toast.info(
        `Still need: ${missing.join(", ")} image${missing.length > 1 ? "s" : ""}`,
      );
    } else {
      toast.success(
        "All required images uploaded (Face, Full Body, Toothy Grin)",
      );
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
    console.log("form:", form);
    const heightString =
      heightFeet && heightInches ? `${heightFeet}'${heightInches}"` : "";
    const calculatedAge = calculateAge(
      parseInt(birthMonth),
      parseInt(birthYear),
    );

    const formData = {
      email: email,
      displayName: user.name || form.displayName.value,
      birthMonth: birthMonth,
      birthYear: birthYear,
      age: calculatedAge,
      height: heightString,
      bodyType: form.bodyType.value,
      county: county,
      bio: form.bio.value,
      dealbreakers: form.dealBreaks.value,
      startDate: form.startDate.value || null,
      endDate: form.endDate.value || null,
      location: form.location.value,
      username: form.username.value || null,
      phone: form.number.value || null,
    };

    // Validate form
    const validationErrors = validateForm(formData, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      handleValidationErrors(validationErrors);
      return;
    }

    // Check image requirements
    const activeSlots = imageSlots.filter((slot) => !slot.isEmpty);
    const hasface = activeSlots.some((slot) => slot.imageType === "face");
    const hasFullBody = activeSlots.some(
      (slot) => slot.imageType === "fullbody",
    );
    const hasToothyGrin = activeSlots.some(
      (slot) => slot.imageType === "toothyGrin",
    );

    if (!hasface || !hasFullBody || !hasToothyGrin || activeSlots.length < 3) {
      const missing = [];
      if (!hasface) missing.push("Face");
      if (!hasFullBody) missing.push("Full Body");
      if (!hasToothyGrin) missing.push("Toothy Grin");

      setErrors({ images: `Required images missing: ${missing.join(", ")}` });
      toast.warn(`Please upload all required images: ${missing.join(", ")}`);
      return;
    }

    setErrors({});
    setSubmitLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });

      // Append image files
      activeSlots.forEach((slot, index) => {
        if (slot.file) {
          if (index === 0) submitData.append("face", slot.file);
          else if (index === 1) submitData.append("fullbody", slot.file);
          else if (index === 2) submitData.append("toothyGrin", slot.file);
          else submitData.append("extras", slot.file);
        }
      });

      const result = await dispatch(submitProfile(submitData)).unwrap();
      console.log("result after submitProfile:", result);
      // Fetch updated user data
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
      setImageSlots([]);
    } catch (err) {
      toast.error(err || "Failed to submit profile. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleValidationErrors = (validationErrors) => {
    const errorPriority = [
      "birthMonth",
      "birthYear",
      "height",
      "bodyType",
      "county",
      "bio",
      "images",
    ];

    const firstKey =
      errorPriority.find((key) => validationErrors[key]) ||
      Object.keys(validationErrors)[0];
    const message = validationErrors[firstKey];

    if (firstKey === "images") {
      toast.warn(message);
    } else {
      toast.error(message);
    }
  };

  // Initialize empty slots
  useEffect(() => {
    if (imageSlots.length === 0) {
      const initialSlots = Array(3)
        .fill(null)
        .map((_, index) => ({
          file: null,
          preview: null,
          id: null,
          isEmpty: true,
          imageType:
            index === 0 ? "face" : index === 1 ? "fullbody" : "toothyGrin",
        }));
      setImageSlots(initialSlots);
    }
  }, []);

  // Clean up preview URLs
  useEffect(() => {
    return () => {
      imageSlots.forEach((slot) => {
        if (slot.preview) {
          URL.revokeObjectURL(slot.preview);
        }
      });
    };
  }, [imageSlots]);

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
            {/* Name Field */}
            <div className="my-5 flex flex-col gap-2 self-stretch">
              <label className="mb-4 font-raleway text-xl font-medium text-white">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="displayName"
                disabled={user.name}
                placeholder={`${user.name || "Enter your name"}`}
                className="h-11 rounded-lg border bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-gray-400 focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
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

            {/* Body Type Field */}
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

            {/* Dealbreakers Field */}
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

            {/* Bio Field */}
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

          {/* Travel Mode Section */}
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
                  className="h-11 rounded-lg bg-transparent px-3 text-sm font-medium text-gray-200 outline outline-1 outline-gray-500 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex w-[48%] flex-col gap-2 self-stretch">
                <label className="font-raleway text-base font-semibold text-white">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="h-11 rounded-lg bg-transparent px-3 text-sm font-medium text-gray-200 outline outline-1 outline-gray-500 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
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
                className="h-11 rounded-lg bg-transparent px-3 text-sm font-medium text-gray-200 outline outline-1 outline-gray-500 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="my-8">
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

          {/* Image Upload Component */}
          <ImageUploadSection
            imageSlots={imageSlots}
            files={files}
            errors={errors}
            handleClick={handleClick}
            handleFileChange={handleFileChange}
            removeImage={removeImage}
            fileInputRef={fileInputRef}
          />

          {/* Safety Notice */}
          <div className="my-8 rounded-lg bg-[#FFFFFF33] p-5">
            <div className="relative mx-auto mb-4 flex h-10 w-10 justify-center overflow-hidden rounded bg-orange-500 p-1 text-center">
              <MdOutlinePrivacyTip className="h-full w-full text-white" />
            </div>
            <p className="text-center font-raleway text-base font-normal leading-6">
              Your safety is what inspired us. You don't know anything about the
              person you or your friend have given the card to. Please be smart
              about what information you share.
            </p>
          </div>

          {/* Approval Notice */}
          <div className="my-8 rounded-lg bg-[#FFFFFF33] p-5">
            <div className="relative mx-auto mb-4 flex h-10 w-10 justify-center overflow-hidden rounded bg-orange-500 p-1 text-center">
              <RiDeleteBinLine className="h-full w-full text-white" />
            </div>
            <p className="text-center font-raleway text-base font-normal leading-6">
              Your cards will be sent to you after your profile has been
              approved for not violating decency standards.
            </p>
          </div>

          {/* Contact Information */}
          <ContactInformationSection errors={errors} />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitLoading}
            className="mt-10 w-full rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-orange-600"
          >
            {submitLoading ? "Submitting..." : "Submit Profile for Review"}
          </button>
        </div>
      </form>

      {/* Terms Footer */}
      <div className="mx-auto max-w-[600px] py-10">
        <p className="text-center font-raleway text-sm text-gray-400">
          By submitting your profile, you agree to our{" "}
          <button
            onClick={openModal}
            className="font-raleway text-orange-500 hover:underline"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            onClick={openModal}
            className="font-raleway text-orange-500 hover:underline"
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>

      {/* Terms Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Terms & Conditions"
        size="xl"
      >
        <TermsModalContent />
      </CustomModal>
    </div>
  );
};

// ============================================
// 🖼️ Image Upload Component
// ============================================
const ImageUploadSection = ({
  imageSlots,
  files,
  errors,
  handleClick,
  handleFileChange,
  removeImage,
  fileInputRef,
}) => (
  <div className="flex items-center justify-center">
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center justify-center bg-white p-8 shadow-md md:rounded-xl">
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

        {/* Upload Progress */}
        <UploadProgress files={files} />

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
        {imageSlots.length > 0 && (
          <ImagePreviews
            imageSlots={imageSlots}
            files={files}
            removeImage={removeImage}
            errors={errors}
          />
        )}

        {/* Upload Instructions */}
        <UploadInstructions />

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
);

// ============================================
// 📊 Upload Progress Component
// ============================================
const UploadProgress = ({ files }) => (
  <div className="mb-4 w-full max-w-xs">
    <div className="mb-1 flex justify-between text-xs text-gray-600">
      <span className="font-raleway">Upload Progress</span>
      <span className="font-raleway">{files.length}/13 images</span>
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
        className={`font-raleway font-semibold ${
          files.length < 3 ? "text-red-500" : "text-green-500"
        }`}
      >
        {files.length >= 3 ? "✓ Requirement met" : "Need more images"}
      </span>
    </div>

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
);

// ============================================
// 🖼️ Image Previews Component
// ============================================
const ImagePreviews = ({ imageSlots, files, removeImage, errors }) => (
  <div className="mt-4 w-full">
    <div className="mb-4 grid grid-cols-3 gap-3">
      {imageSlots.map((slot, idx) => (
        <div key={slot.id || `empty-${idx}`} className="group relative">
          {!slot.isEmpty ? (
            <>
              <img
                src={slot.preview}
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

              {/* Image Type Label */}
              <div className="absolute bottom-1 left-1 rounded bg-black bg-opacity-60 px-2 py-[2px] text-[10px] text-white">
                {getImageTypeLabel(slot.imageType, idx, slot.extraKey)}
              </div>
            </>
          ) : (
            <EmptySlot slot={slot} idx={idx} />
          )}
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
          {3 - files.length} more image{3 - files.length !== 1 ? "s" : ""}{" "}
          needed
        </div>
      )}
    </div>
  </div>
);

// ============================================
// 📝 Helper Functions
// ============================================
const getImageTypeLabel = (imageType, idx, extraKey) => {
  switch (imageType) {
    case "face":
      return "Face";
    case "fullbody":
      return "Full Body";
    case "toothyGrin":
      return "Toothy Grin";
    case "extra":
      return `Extra ${extraKey || idx - 2}`;
    default:
      if (idx === 0) return "Face";
      if (idx === 1) return "Full Body";
      if (idx === 2) return "Toothy Grin";
      return `Extra ${idx - 2}`;
  }
};

const EmptySlot = ({ slot, idx }) => (
  <div className="flex h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
    <FaCamera className="mb-1 h-6 w-6 text-gray-400" />
    <span className="text-xs text-gray-500">
      {getImageTypeLabel(slot.imageType, idx, slot.extraKey)}
    </span>
  </div>
);

// ============================================
// 📋 Upload Instructions Component
// ============================================
const UploadInstructions = () => (
  <div className="mt-4 text-center">
    <p className="flex items-center gap-1 font-raleway text-sm font-semibold text-gray-600">
      <FaCamera />
      How to upload multiple images:
    </p>
    <p className="mt-1 font-raleway text-xs text-gray-500">
      • Hold <kbd className="rounded bg-gray-200 px-1">Ctrl</kbd> (Windows) or{" "}
      <kbd className="rounded bg-gray-200 px-1">Cmd</kbd> (Mac)
    </p>
    <p className="font-raleway text-xs text-gray-500">
      • Click and drag to select multiple files
    </p>
  </div>
);

// ============================================
// 📞 Contact Information Component
// ============================================
const ContactInformationSection = ({ errors }) => (
  <div className="rounded-lg bg-[#434343] px-4 py-8">
    <div className="mb-6">
      <h2 className="mb-6 font-raleway text-xl font-bold leading-6">
        Person to person dating, but with a safer approach.
      </h2>
      <p className="font-raleway leading-6">
        This is your "safe share" zone – just the details you choose to pass
        along.
      </p>
    </div>

    {errors.contact && (
      <p className="mb-4 text-center text-red-500">{errors.contact}</p>
    )}

    <div className="">
      <div className="flex flex-col gap-2 self-stretch">
        <label className="font-raleway text-base font-semibold text-white">
          User Name
        </label>
        <input
          type="text"
          name="username"
          placeholder="Enter your user name"
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
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
);

// ============================================
// 📄 Terms Modal Content Component
// ============================================
const TermsModalContent = () => (
  <div className="max-h-96 overflow-y-auto bg-[#3B3B3D] p-4 text-sm text-white">
    <div className="">
      <h3 className="mb-4 text-lg font-bold text-orange-400">
        Yep, this is all the legal gobbledygook.
      </h3>

      <div className="space-y-10">
        <p className="leading-relaxed text-white">
          Welcome to Scan Me Maybe! By using our service, you agree to these
          terms and conditions. Please read them carefully before proceeding. By
          accessing and using Scan Me Maybe, you accept and agree to be bound by
          the terms and provision of this agreement.
        </p>

        <p className="leading-relaxed text-white">
          Permission is granted to temporarily use Scan Me Maybe for personal,
          non-commercial transitory viewing only. This is the grant of a
          license, not a transfer of title. Your privacy and safety are our top
          priorities. We implement various security measures to protect your
          personal information and ensure safe person-to-person connections.
        </p>

        {/* Easter Egg Story */}
        <div className="rounded-lg border-l-4 border-orange-400 bg-[#505050] p-4">
          <h4 className="mb-3 font-bold text-orange-400">
            🛒 A Little Story...
          </h4>
          <p className="italic leading-relaxed text-orange-200">
            Your eyes met across the produce section of the grocery store.
            "Mmmm. I like what I see." Is there a wedding ring? Are they here
            with someone? It doesn't look like it. Get brave and whip out the
            card. What have you got to lose? They could be the one, or they can
            chuck it in the trash on the way out. At least you took your shot.
            So brave.
          </p>
        </div>

        <p className="leading-relaxed text-white">
          Users must conduct themselves respectfully and lawfully. Any
          harassment, inappropriate behavior, or misuse of the platform is
          strictly prohibited. The materials on Scan Me Maybe are provided on an
          'as is' basis. Scan Me Maybe makes no warranties, expressed or
          implied, and hereby disclaims and negates all other warranties.
        </p>

        {/* Call to Action */}
        <div className="mt-6 rounded-lg bg-[#505050] p-4">
          <h4 className="mb-3 font-bold text-orange-400">Your Move</h4>
          <p className="leading-relaxed text-white">
            If you've read this far and you're intrigued, don't overthink it.
            Let's see what a good conversation might bring. Worst case? We have
            an interesting chat. Best case? Who knows……
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
);

export default SetupProfileView;
