import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiCheckMark } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { Upload } from "lucide-react";
import { toast } from "react-toastify";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { submitProfile } from "../../../features/public/profile/profileFetch";
import { validateForm } from "../../../utils/validateForm";
import { FaCamera } from "react-icons/fa";

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
      toast.warn("Maximum 13 images allowed (3 required + 10 optional)");
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
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    e.target.value = "";
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
      displayName: form.firstName.value, // ✅ Use displayName (matches your object)
      age: form.age.value,
      height: form.height.value,
      bodyType: form.bodyType.value,
      area: form.area.value,
      bio: form.textArea.value, // ✅ bio, not textArea
      dealbreakers: form.dealBreaks.value, // ✅ corrected spelling
      startDate: form.startDate.value || null,
      endDate: form.endDate.value || null,
      location: form.location.value,
      email: form.email.value,
      phone: form.number.value || null, // ✅ phone, not number
    };

    // ✅ Validate with files
    const validationErrors = validateForm(formData, files);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.warn("Please fix all errors before submitting");
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
      // 📤 Build FormData with image array
      const submitData = new FormData();

      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });

      // ✅ Append ALL files under "image" (as array)
      files.forEach((file) => {
        submitData.append("image", file);
      });

      await dispatch(submitProfile(submitData)).unwrap();

      toast.success("Profile submitted successfully for review!");
      form.reset();
      setSuccess(true);
      setFiles([]);
      setImagePreviews([]);
    } catch (err) {
      console.error("Submission error:", err);
      alert(err?.message || "❌ Failed to submit profile. Please try again.");
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#3B3B3D] px-[10px] py-10 font-sans text-white sm:py-4 md:py-6 lg:py-8">
        <h2 className="mb-4 text-xl font-bold md:text-[32px]">
          Profile Setup Successful!
        </h2>
        <p className="text-gray-400">
          Your profile has been submitted for review.
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
    <div className="min-h-screen bg-[#3B3B3D] px-[10px] font-sans text-white sm:py-4 md:py-6 lg:py-8">
      <form onSubmit={handleSubmit}>
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
            <h2 className="text-xl font-bold md:text-[32px]">
              Setup Your Profile
            </h2>
          </div>

          {/* Form Fields */}
          <div className="my-10 md:my-20">
            <div className="my-5 flex flex-col gap-2 self-stretch">
              <label className="mb-4 text-xl font-medium text-white">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter Display Name"
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.firstName ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="my-5 flex flex-col gap-2 self-stretch">
              <label className="mb-4 text-xl font-medium text-white">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.age ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
              <p className="my-2 text-xs font-normal text-gray-400">
                (We only store your month and year of birth which will calculate
                your age as of the 28th of your birth month.)
              </p>
              <p className="mb-1 flex items-center gap-2 text-xs font-normal text-gray-400 md:mb-2">
                <BiErrorCircle className="h-5 w-5 text-orange-500" />
                Must be 18 or older
              </p>
            </div>

            <div className="flex w-full flex-col gap-2">
              <label className="mb-[8px] text-xl font-medium text-white">
                Height <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="height"
                placeholder="Enter your Height"
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.height ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height}</p>
              )}
            </div>

            <div className="my-5 flex w-full flex-col gap-2">
              <label className="mb-[8px] text-xl font-medium text-white">
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

            <div className="my-5 flex w-full flex-col gap-2 self-stretch">
              <label className="mb-[8px] text-xl font-medium text-white">
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="area"
                placeholder="Enter your country and state"
                className={`h-11 border bg-transparent px-3 text-white placeholder:text-gray-400 ${
                  errors.area ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.area && (
                <p className="text-sm text-red-500">{errors.area}</p>
              )}
            </div>

            <div className="my-5 flex w-full flex-col gap-2 self-stretch">
              <label className="mb-[8px] text-xl font-medium text-white">
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
              <label className="mb-[8px] text-xl font-medium text-white">
                Tell Me About You <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                name="textArea"
                placeholder="Write your message here..."
                className={`max-h-[265px] min-h-[265px] w-full border bg-transparent px-3 pt-1 text-white placeholder:text-gray-400 ${
                  errors.textArea ? "border-red-500" : "border-gray-500"
                } rounded-lg text-sm font-medium outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.textArea && (
                <p className="text-sm text-red-500">{errors.textArea}</p>
              )}
            </div>
          </div>

          {/* Travel Mode */}
          <div className="rounded-lg bg-[#434343] px-3 py-8">
            <h2 className="text-center text-2xl font-bold">Travel Mode</h2>
            <div className="my-6 flex w-full items-center gap-3 md:gap-5">
              <div className="flex w-[48%] flex-col gap-2 self-stretch">
                <label className="text-base font-semibold text-white">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="h-11 rounded-lg bg-white px-3 text-sm font-medium text-gray-800 outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="flex w-[48%] flex-col gap-2 self-stretch">
                <label className="text-base font-semibold text-white">
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
              <label className="text-base font-semibold text-white">
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
            <h2 className="text-xl font-medium">
              Add Images <span className="text-red-500">* (Min 3)</span>
            </h2>
            <div className="my-6 flex items-center gap-4 rounded-lg bg-[#FFFFFF33] px-3 py-8">
              <BiErrorCircle className="h-10 w-10 text-orange-500" />
              <p className="text-base font-normal">
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

                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  Upload Photos
                </h2>
                <p className="mx-auto mb-4 max-w-[288px] text-center text-[10px] text-gray-500">
                  Minimum 3 photos required • Maximum 13 photos allowed
                </p>

                {/* Upload Progress Indicator */}
                <div className="mb-4 w-full max-w-xs">
                  <div className="mb-1 flex justify-between text-xs text-gray-600">
                    <span>Upload Progress</span>
                    <span>{files.length}/13 images</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${(files.length / 13) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>Min: 3</span>
                    <span
                      className={
                        files.length < 3
                          ? "font-semibold text-red-500"
                          : "font-semibold text-green-500"
                      }
                    >
                      {files.length >= 3
                        ? "✓ Requirement met"
                        : "Need more images"}
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
                        <div key={idx} className="group relative">
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
                                  ? "Third"
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
                          Ready to submit! ({files.length}/13 images)
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
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
                  <p className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                    <span>
                      <FaCamera />
                    </span>
                    How to upload multiple images:
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    • Hold <kbd className="rounded bg-gray-200 px-1">Ctrl</kbd>{" "}
                    (Windows) or{" "}
                    <kbd className="rounded bg-gray-200 px-1">Cmd</kbd> (Mac)
                  </p>
                  <p className="text-xs text-gray-500">
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
            <p className="text-center text-base font-normal leading-6">
              Your safety is what inspired us. You don't know anything about the
              person you or your friend have given the card to. Please be smart
              about what information you share.
            </p>
          </div>

          <div className="my-10 flex items-center gap-4 rounded-lg bg-[#FFFFFF33] px-3 py-8">
            <RiDeleteBinLine className="h-14 w-14 text-orange-500" />
            <p className="text-base font-normal">
              Your cards will be sent to you after your profile has been
              approved for not violating decency standards.
            </p>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg bg-[#434343] px-4 py-8">
            <div className="mb-6">
              <h2 className="mb-6 text-xl font-bold leading-6">
                Person to person dating, but with a safer approach.
              </h2>
              <p className="leading-6">
                This is your "safe share" zone – just the details you choose to
                pass along.
              </p>
            </div>

            {errors.contact && (
              <p className="mb-4 text-center text-red-500">{errors.contact}</p>
            )}

            <div className="">
              <div className="flex flex-col gap-2 self-stretch">
                <label className="text-base font-semibold text-white">
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
                <label className="text-base font-semibold text-white">
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

              <div className="my-4 md:my-8">
                <h2 className="text-center text-base font-semibold">and/or</h2>
              </div>

              <div className="flex flex-col gap-2 self-stretch">
                <label className="text-base font-semibold text-white">
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
          <div className="mx-auto mb-6 mt-10 max-w-[600px]">
            <p className="text-center text-sm text-gray-400">
              By submitting your profile, you agree to our{" "}
              <a href="/terms" className="text-orange-500 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-orange-500 hover:underline">
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
