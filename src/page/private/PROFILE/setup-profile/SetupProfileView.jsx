import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import {
  areTravelDatesValid,
  normalizeTravelFields,
} from "../../../../utils/travelMode";
import CustomModal from "../../../../components/common/CustomModal";
import { getCurrentYear, TERMS_LAST_UPDATED } from "../../../../utils/formatDate";

// Utils & Features
import { calculateAge } from "../../../../utils/ageUtils";
import { validateForm } from "../../../../utils/validateForm";
import { compressImage } from "../../../../utils/imageUtils";
import { GET } from "../../../../config/api/httpMethods";
import { endpoints } from "../../../../config/api/httpEndpoint";
import { submitProfile } from "../../../../features/public/profile/profileFetch";
import { updateUser } from "../../../../features/auth/authSlice";
import PhotoReorderGrid from "../../../../components/common/PhotoReorderGrid";

// Configuration Constants
const MAX_IMAGES = 13;
const MIN_REQUIRED_IMAGES = 3;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const REQUIRED_IMAGE_TYPES = ["face", "fullbody", "toothyGrin"];
const IMAGE_COMPRESSION_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
};

// Custom Hooks
const useImageManagement = () => {
  const [imageSlots, setImageSlots] = useState([]);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const updateLegacyArrays = useCallback((slots) => {
    const activeSlots = slots.filter((slot) => !slot.isEmpty);
    setFiles(activeSlots.map((slot) => slot.file));
    setImagePreviews(activeSlots.map((slot) => slot.preview));
  }, []);

  const validateImageRequirements = useCallback((slots) => {
    const activeSlots = slots.filter((slot) => !slot.isEmpty);

    if (activeSlots.length < MIN_REQUIRED_IMAGES) {
      const needed = MIN_REQUIRED_IMAGES - activeSlots.length;
      toast.info(
        `Please upload ${needed} more photo${needed > 1 ? "s" : ""} (minimum ${MIN_REQUIRED_IMAGES} required)`,
      );
      return false;
    }

    toast.success(`${activeSlots.length} photo${activeSlots.length > 1 ? "s" : ""} uploaded`);
    return true;
  }, []);

  return {
    imageSlots,
    setImageSlots,
    files,
    imagePreviews,
    updateLegacyArrays,
    validateImageRequirements,
  };
};

const useFormState = () => {
  const [formData, setFormData] = useState({
    birthMonth: null,
    birthYear: null,
    county: "",
    heightFeet: "",
    heightInches: "",
  });

  const updateFormField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return { formData, updateFormField };
};

// Helper Functions

// Upload Progress Component
const UploadProgress = ({ files }) => {
  const progress = (files.length / MAX_IMAGES) * 100;

  return (
    <div className="mb-4 w-full max-w-xs">
      <div className="mb-1 flex justify-between text-xs text-gray-600">
        <span className="font-raleway">Upload Progress</span>
        <span className="font-raleway">
          {files.length}/{MAX_IMAGES} images
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span className="font-raleway">Min: {MIN_REQUIRED_IMAGES}</span>
        <span
          className={`font-raleway font-semibold ${
            files.length < MIN_REQUIRED_IMAGES
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {files.length >= MIN_REQUIRED_IMAGES
            ? "✓ Requirement met"
            : "Need more images"}
        </span>
      </div>
      <div className="mt-2 text-center">
        <span className="font-raleway text-xs text-gray-600">
          {files.length === 0
            ? `You can upload up to ${MAX_IMAGES} images`
            : files.length === MAX_IMAGES
              ? "Maximum images reached"
              : `You can upload ${MAX_IMAGES - files.length} more image${MAX_IMAGES - files.length > 1 ? "s" : ""}`}
        </span>
      </div>
    </div>
  );
};

// Image Previews Component
const ImagePreviews = ({
  imageSlots,
  files,
  onImageRemove,
  onSlotsChange,
  draggedSlotIndex,
  onDragIndexChange,
}) => (
  <div className="mt-4 w-full">
    <PhotoReorderGrid
      imageSlots={imageSlots}
      onSlotsChange={onSlotsChange}
      onRemove={onImageRemove}
      draggedSlotIndex={draggedSlotIndex}
      onDragIndexChange={onDragIndexChange}
    />

    {/* Upload Status */}
    <div
      className={`rounded-lg p-2 text-center ${
        files.length >= MIN_REQUIRED_IMAGES
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {files.length >= MIN_REQUIRED_IMAGES ? (
        <div className="flex items-center justify-center gap-2">
          <GiCheckMark className="h-4 w-4" />
          <span className="font-raleway">
            Ready to submit! ({files.length}/{MAX_IMAGES} images)
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 font-raleway">
          <BiErrorCircle className="h-4 w-4" />
          {MIN_REQUIRED_IMAGES - files.length} more image
          {MIN_REQUIRED_IMAGES - files.length !== 1 ? "s" : ""} needed
        </div>
      )}
    </div>
  </div>
);

// Upload Instructions Component
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
    <p className="font-raleway text-xs text-gray-500">
      • Drag photos in the grid to reorder them
    </p>
  </div>
);

// Image Upload Component
const ImageUploadSection = ({
  imageSlots,
  files,
  errors,
  onFileInputClick,
  onFileChange,
  onImageRemove,
  onSlotsChange,
  fileInputRef,
  isIOS,
  draggedSlotIndex,
  onDragIndexChange,
}) => (
  <div className="flex items-center justify-center">
    <div className="w-full space-y-4">
      <div className="flex flex-col items-center justify-center bg-white p-8 shadow-md md:rounded-xl">
        {/* Upload Button */}
        <div
          className="mb-4 flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl bg-orange-500 transition hover:bg-orange-600"
          onClick={onFileInputClick}
        >
          <Upload className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>

        <h2 className="mb-2 font-raleway text-lg font-semibold text-gray-800">
          Upload Photos
        </h2>
        <p className="mx-auto mb-4 max-w-[288px] text-center font-raleway text-[10px] text-gray-500">
          Minimum {MIN_REQUIRED_IMAGES} photos required • Maximum {MAX_IMAGES}{" "}
          photos allowed
        </p>

        {/* Upload Progress */}
        <UploadProgress files={files} />

        {/* Hidden File Input */}
        <input
          type="file"
          accept={isIOS ? "image/*,image/heic,image/heif" : "image/*"}
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={onFileChange}
          onClick={(e) => {
            e.target.value = null;
          }}
        />

        {/* Image Previews */}
        {imageSlots.length > 0 && (
          <ImagePreviews
            imageSlots={imageSlots}
            files={files}
            onImageRemove={onImageRemove}
            onSlotsChange={onSlotsChange}
            draggedSlotIndex={draggedSlotIndex}
            onDragIndexChange={onDragIndexChange}
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

// Contact Information Component
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

// Terms Modal Content Component
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
          Last updated: {TERMS_LAST_UPDATED}
          <br />© {getCurrentYear()} Scan Me Maybe, LLC. All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
);

// Main Component
const SetupProfileView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useParams();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.status === "PROFILE_PENDING") {
      toast.info("Your profile is pending approval.");
      navigate("/user", { replace: true });
    }
  }, [user?.status, navigate]);

  // Detect iOS for specific handling
  const isIOS = useMemo(
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    [],
  );

  // State Management
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [draggedSlotIndex, setDraggedSlotIndex] = useState(null);

  // Custom hooks
  const { formData, updateFormField } = useFormState();
  const {
    imageSlots,
    setImageSlots,
    files,
    updateLegacyArrays,
    validateImageRequirements,
  } = useImageManagement();

  const fileInputRef = useRef(null);

  // Handlers
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), []);
  const handleFileInputClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // File validation
  const isValidImageFile = useCallback((file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    const validExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".heic",
      ".heif",
    ];

    return (
      file.type.startsWith("image/") ||
      validTypes.includes(file.type) ||
      validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)) ||
      (!file.type &&
        validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)))
    );
  }, []);

  const validateFiles = useCallback(
    (selectedFiles, currentSlots) => {
      const filledSlots = currentSlots.filter((slot) => !slot.isEmpty).length;
      const maxNewFiles = MAX_IMAGES - filledSlots;

      const validFiles = selectedFiles.filter(isValidImageFile);
      const oversizedFiles = validFiles.filter(
        (file) => file.size > MAX_FILE_SIZE,
      );

      if (validFiles.length !== selectedFiles.length) {
        const invalidCount = selectedFiles.length - validFiles.length;
        toast.error(
          `${invalidCount} invalid file${invalidCount > 1 ? "s" : ""} skipped. Only image files are allowed.`,
        );
      }

      if (oversizedFiles.length > 0) {
        const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
        const oversizedNames = oversizedFiles
          .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`)
          .join(", ");
        toast.error(
          `Files too large: ${oversizedNames}. Maximum ${maxSizeMB}MB per file allowed.`,
        );
        return null;
      }

      const validSizedFiles = validFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE,
      );
      if (validSizedFiles.length === 0) return null;

      const filesToAdd = validSizedFiles.slice(0, maxNewFiles);
      if (validSizedFiles.length > maxNewFiles) {
        if (maxNewFiles === 0) {
          toast.warn(
            `You have already reached the maximum of ${MAX_IMAGES} images`,
          );
        } else {
          toast.warn(
            `Only ${maxNewFiles} of ${validSizedFiles.length} image${validSizedFiles.length > 1 ? "s" : ""} added.`,
          );
        }
      }

      return filesToAdd;
    },
    [isValidImageFile],
  );

  const handleFileChange = useCallback(
    (e) => {
      const selectedFiles = Array.from(e.target.files);
      const filesToAdd = validateFiles(selectedFiles, imageSlots);

      if (!filesToAdd) {
        e.target.value = "";
        return;
      }

      const getImageTypeByIndex = (index) => {
        if (index === 0) return { type: "face", extraKey: null };
        if (index === 1) return { type: "fullbody", extraKey: null };
        if (index === 2) return { type: "toothyGrin", extraKey: null };
        return { type: "extra", extraKey: `${index - 2}` };
      };

      const updatedSlots = [...imageSlots];
      filesToAdd.forEach((file) => {
        const emptySlotIndex = updatedSlots.findIndex((slot) => slot.isEmpty);
        const { type: imageType, extraKey } = getImageTypeByIndex(
          emptySlotIndex !== -1 ? emptySlotIndex : updatedSlots.length,
        );

        const newSlot = {
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random()}`,
          isEmpty: false,
          imageType,
          extraKey,
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
      validateImageRequirements(updatedSlots);
      e.target.value = "";
    },
    [imageSlots, validateFiles, updateLegacyArrays, validateImageRequirements],
  );

  const removeImage = useCallback(
    (index) => {
      if (index < 0 || index >= imageSlots.length) {
        console.error("Invalid index for image removal:", index);
        return;
      }

      const updatedSlots = [...imageSlots];
      const slot = updatedSlots[index];

      if (slot.preview) {
        URL.revokeObjectURL(slot.preview);
      }

      if (index < MIN_REQUIRED_IMAGES) {
        updatedSlots[index] = {
          file: null,
          preview: null,
          id: null,
          isEmpty: true,
          imageType: REQUIRED_IMAGE_TYPES[index],
        };
      } else {
        updatedSlots.splice(index, 1);
      }

      setImageSlots(updatedSlots);
      updateLegacyArrays(updatedSlots);
      validateImageRequirements(updatedSlots);
    },
    [imageSlots, updateLegacyArrays, validateImageRequirements],
  );

  const handleSlotsReorder = useCallback(
    (reordered) => {
      setImageSlots(reordered);
      updateLegacyArrays(reordered);
    },
    [updateLegacyArrays],
  );

  const buildFormData = useCallback(
    (form) => {
      const { birthMonth, birthYear, county, heightFeet, heightInches } =
        formData;
      const heightString =
        heightFeet && heightInches ? `${heightFeet}'${heightInches}"` : "";
      const calculatedAge = calculateAge(
        parseInt(birthMonth),
        parseInt(birthYear),
      );

      const travel = normalizeTravelFields(
        form.startDate.value,
        form.endDate.value,
        form.location.value,
      );

      return {
        email,
        displayName: user.name || form.displayName.value,
        birthMonth,
        birthYear,
        age: calculatedAge,
        height: heightString,
        bodyType: form.bodyType.value,
        county,
        bio: form.bio.value,
        dealbreakers: form.dealBreaks.value,
        startDate: travel.startDate,
        endDate: travel.endDate,
        location: travel.location,
        username: form.username.value || null,
        phone: form.number.value || null,
        _travelHasAny: travel.hasAnyTravel,
        _travelHasAll: travel.hasAllTravel,
      };
    },
    [formData, email, user.name],
  );

  const validateSubmission = useCallback(() => {
    const activeSlots = imageSlots.filter((slot) => !slot.isEmpty);

    if (activeSlots.length < MIN_REQUIRED_IMAGES) {
      const needed = MIN_REQUIRED_IMAGES - activeSlots.length;
      const errorMsg = `Minimum ${MIN_REQUIRED_IMAGES} photos required. You need ${needed} more.`;
      setErrors({ images: errorMsg });
      toast.warn(errorMsg);
      return false;
    }
    return true;
  }, [imageSlots]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const form = e.currentTarget;

      const profileData = buildFormData(form);

      if (profileData._travelHasAny && !profileData._travelHasAll) {
        toast.warn("Travel mode requires start date, end date, and location.");
        return;
      }

      if (
        profileData._travelHasAll &&
        !areTravelDatesValid(profileData.startDate, profileData.endDate)
      ) {
        toast.warn("Travel dates are invalid. End date must be today or later.");
        return;
      }

      const { _travelHasAny, _travelHasAll, ...cleanProfileData } = profileData;

      const validationErrors = validateForm(cleanProfileData, files);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        handleValidationErrors(validationErrors);
        return;
      }

      if (!validateSubmission()) return;

      setErrors({});
      setSubmitLoading(true);

      try {
        const submitData = new FormData();

        Object.entries(cleanProfileData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            submitData.append(key, value);
          }
        });

        const activeSlots = imageSlots.filter((slot) => !slot.isEmpty);
        if (activeSlots.length > 0) {
          toast.info("Compressing images for faster upload...");

          const processImage = async (slot) => {
            if (!slot.file) return null;

            try {
              const { maxWidth, maxHeight, quality } = IMAGE_COMPRESSION_CONFIG;
              return await compressImage(
                slot.file,
                maxWidth,
                maxHeight,
                quality,
              );
            } catch (error) {
              console.error("Image compression failed:", error);
              return slot.file;
            }
          };

          const getFieldName = (imageType) => {
            if (imageType === "face") return "face";
            if (imageType === "fullbody") return "fullbody";
            if (imageType === "toothyGrin") return "toothyGrin";
            return "extras";
          };

          for (const slot of activeSlots) {
            const processedFile = await processImage(slot);
            if (processedFile) {
              const fieldName = getFieldName(slot.imageType);
              submitData.append(fieldName, processedFile);
            }
          }
        }
        console.log("submitData entries:", Array.from(submitData.entries()));
        await dispatch(submitProfile(submitData)).unwrap();
        // Refresh user data after submission
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

        imageSlots.forEach((slot) => {
          if (slot.preview) URL.revokeObjectURL(slot.preview);
        });
        setImageSlots([]);
      } catch (err) {
        const errorMessage =
          err?.message || err || "Failed to submit profile. Please try again.";
        toast.error(errorMessage);
      } finally {
        setSubmitLoading(false);
      }
    },
    [buildFormData, validateSubmission, imageSlots, files, dispatch],
  );

  const handleValidationErrors = useCallback((validationErrors) => {
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
  }, []);

  // Initialize required image slots
  useEffect(() => {
    if (imageSlots.length === 0) {
      const initialSlots = REQUIRED_IMAGE_TYPES.map((type) => ({
        file: null,
        preview: null,
        id: null,
        isEmpty: true,
        imageType: type,
      }));
      setImageSlots(initialSlots);
    }
  }, [imageSlots.length, setImageSlots]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imageSlots.forEach((slot) => {
        if (slot.preview) URL.revokeObjectURL(slot.preview);
      });
    };
  }, []);

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#3B3B3D] px-[10px] py-10 font-raleway text-white sm:py-4 md:py-6 lg:py-8">
        <h2 className="mb-4 text-xl font-bold md:text-[32px]">
          Profile Setup Successful!
        </h2>
        <p className="text-gray-400">
          Your profile has been submitted for review.
        </p>
        <Link to="/user" replace className="border px-4 py-2 text-white">
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
                placeholder={user.name || "Enter your name"}
                className="h-11 rounded-lg border bg-transparent px-3 text-sm font-medium text-white outline-none placeholder:text-gray-400 focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
              {errors.displayName && (
                <p className="text-sm text-red-500">{errors.displayName}</p>
              )}
            </div>

            {/* Age Input Component */}
            <AgeInput
              birthMonth={formData.birthMonth}
              birthYear={formData.birthYear}
              onBirthMonthChange={(value) =>
                updateFormField("birthMonth", value)
              }
              onBirthYearChange={(value) => updateFormField("birthYear", value)}
              errors={errors}
            />

            {/* Height Input Component */}
            <HeightInput
              heightFeet={formData.heightFeet}
              heightInches={formData.heightInches}
              onHeightFeetChange={(value) =>
                updateFormField("heightFeet", value)
              }
              onHeightInchesChange={(value) =>
                updateFormField("heightInches", value)
              }
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
              county={formData.county}
              onCountyChange={(value) => updateFormField("county", value)}
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
              <span className="font-raleway text-red-500">
                * (Min {MIN_REQUIRED_IMAGES})
              </span>
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
            onFileInputClick={handleFileInputClick}
            onFileChange={handleFileChange}
            onImageRemove={removeImage}
            onSlotsChange={handleSlotsReorder}
            fileInputRef={fileInputRef}
            isIOS={isIOS}
            draggedSlotIndex={draggedSlotIndex}
            onDragIndexChange={setDraggedSlotIndex}
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
            className="mt-10 w-full rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
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
            onClick={toggleModal}
            className="font-raleway text-orange-500 hover:underline"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            onClick={toggleModal}
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
        onClose={toggleModal}
        title="Terms & Conditions"
        size="xl"
      >
        <TermsModalContent />
      </CustomModal>
    </div>
  );
};

export default SetupProfileView;
