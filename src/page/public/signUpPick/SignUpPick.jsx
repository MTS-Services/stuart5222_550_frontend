import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { postData } from "../../../utils/axiosInstance";
import { Upload } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";
import { GiCheckMark } from "react-icons/gi";
import { BiErrorCircle } from "react-icons/bi";
import { MdOutlinePrivacyTip } from "react-icons/md";
import PaymentApp from "./components/PaymentMethod";

export const SignUpPick = () => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 13) {
      toast.warning("⚠️ Maximum 13 images allowed (3 required + 10 optional)");
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("⚠️ Please upload only image files");
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

  const handleClick = () => fileInputRef.current.click();

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.height.trim()) newErrors.height = "Height is required";
    if (!formData.bodyType.trim()) newErrors.bodyType = "Body type is required";
    if (!formData.area.trim()) newErrors.area = "Area is required";
    if (!formData.textArea.trim())
      newErrors.textArea = "Tell us about yourself";
    if (!formData.email.trim() && !formData.number.trim())
      newErrors.contact = "Please provide either email or phone number";
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = "Invalid email format";
    if (files.length < 3) newErrors.images = "Minimum 3 images required";
    return newErrors;
  };

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

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("⚠️ Please fix all errors before submitting");
      return;
    }

    setErrors({});
    setSubmitLoading(true);

    try {
      const imagePromises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      );

      const imageData = await Promise.all(imagePromises);

      const formattedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const payload = {
        id: Date.now(),
        date: formattedDate,
        name: formData.firstName,
        age: `${formData.age} years`,
        height: formData.height,
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
        images: imageData,
        submittedAt: new Date().toISOString(),
        status: "pending_review",
        totalImages: imageData.length,
      };

      await postData("profiles", payload);
      toast.success("🎉 Your profile has been submitted successfully!");

      form.reset();
      setFiles([]);
      setImagePreviews([]);
    } catch (err) {
      if (err.response) {
        toast.error(
          `❌ Server Error: ${err.response.status} - ${
            err.response.data?.message || "Please try again!"
          }`
        );
      } else if (err.request) {
        toast.error(
          "🌐 Network Error: Please check if JSON Server is running on http://localhost:5000"
        );
      } else {
        toast.error("❌ Failed to submit your profile. Please try again!");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  return (
    <div className="px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen text-white font-sans">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-bold md:text-[32px] text-xl">
              Sign Up and Pick your Plan
            </h2>
          </div>

          {/* Price Section */}
          <div className="border-t-2 border-orange-500 rounded-xl bg-[#434343] p-8 md:mt-6 mt-4">
            <div className="bg-[#FFFFFF33] p-6 rounded-xl">
              <h2 className="text-[32px] font-semibold">
                $69/
                <span className="text-base font-semibold">
                  Initial setup fee
                </span>
              </h2>
              <hr className="my-6 text-gray-400" />
              {[
                "50 unique QR code cards",
                "Delivery of cards",
                "Profile page setup & review",
                "Secure contact sharing",
              ].map((item, index) => (
                <h3
                  key={index}
                  className="flex items-center gap-3 font-medium text-base my-3 first:mt-0"
                >
                  <span className="rounded-lg p-2 bg-orange-500 w-7 h-7 text-white flex items-center justify-center">
                    <GiCheckMark className="w-6 h-6 font-semibold" />
                  </span>
                  {item}
                </h3>
              ))}
            </div>
          </div>

          {/* PaymentMethod */}
          <PaymentApp />

          {/* Form Fields */}
          <div className="md:my-20 my-10">
            <div className="self-stretch flex flex-col gap-2 my-5">
              <label className="text-white text-xl font-medium mb-4">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter Display Name"
                className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.firstName ? "border-red-500" : "border-gray-500"
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div className="self-stretch flex flex-col gap-2 my-5">
              <label className="text-white text-xl font-medium mb-4">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="age"
                placeholder="Enter your date of birth"
                className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.age ? "border-red-500" : "border-gray-500"
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age}</p>
              )}
              <p className="text-xs font-normal text-gray-400 w-[350px] my-2">
                (We only store your month and year of birth which will calculate
                your age as of the 28th of your birth month.)
              </p>
              <p className="text-xs font-normal text-gray-400 w-[350px] md:mb-2 mb-1 flex items-center gap-2">
                <BiErrorCircle className="text-orange-500 w-5 h-5" />
                Must be 18 or older
              </p>
            </div>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="self-stretch flex flex-col gap-2 w-full">
                <label className="text-white text-xl font-medium mb-[8px]">
                  Height <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="height"
                  placeholder="Enter your Height"
                  className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                    errors.height ? "border-red-500" : "border-gray-500"
                  } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
                />
                {errors.height && (
                  <p className="text-red-500 text-sm">{errors.height}</p>
                )}
              </div>
              <div className="self-stretch flex flex-col gap-2 w-full">
                <label className="text-white text-xl font-medium mb-[8px]">
                  Body Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bodyType"
                  placeholder="Describe your body type"
                  className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                    errors.bodyType ? "border-red-500" : "border-gray-500"
                  } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
                />
                {errors.bodyType && (
                  <p className="text-red-500 text-sm">{errors.bodyType}</p>
                )}
              </div>
            </div>

            <div className="self-stretch flex flex-col gap-2 w-full">
              <label className="text-white text-xl font-medium mb-[8px]">
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="area"
                placeholder="Enter your country and state"
                className={`h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.area ? "border-red-500" : "border-gray-500"
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.area && (
                <p className="text-red-500 text-sm">{errors.area}</p>
              )}
            </div>

            <div className="self-stretch flex flex-col gap-2 w-full my-5">
              <label className="text-white text-xl font-medium mb-[8px]">
                Dealbreakers
              </label>
              <input
                type="text"
                name="dealBreaks"
                placeholder="Enter your no go's"
                className="h-11 px-3 bg-transparent text-white placeholder:text-gray-400 border border-gray-500 text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300"
              />
            </div>

            <div className="self-stretch flex flex-col gap-2 w-full my-5">
              <label className="text-white text-xl font-medium mb-[8px]">
                Tell 'em About You <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                name="textArea"
                placeholder="Write your message here..."
                className={`w-full max-h-[265px] min-h-[265px] px-3 pt-1 bg-transparent text-white placeholder:text-gray-400 border ${
                  errors.textArea ? "border-red-500" : "border-gray-500"
                } text-sm font-medium rounded-lg outline-none focus:outline focus:outline-1 focus:outline-orange-300 focus:ring-1 focus:ring-orange-300`}
              />
              {errors.textArea && (
                <p className="text-red-500 text-sm">{errors.textArea}</p>
              )}
            </div>
          </div>

          {/* Travel Mode */}
          <div className="bg-[#434343] px-3 py-8 rounded-lg">
            <h2 className="font-bold text-2xl text-center">Travel Mode</h2>
            <div className="w-full flex items-center md:gap-5 gap-3 my-6">
              <div className="self-stretch flex flex-col gap-2 w-[48%]">
                <label className="text-white text-base font-semibold">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="h-11 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="self-stretch flex flex-col gap-2 w-[48%]">
                <label className="text-white text-base font-semibold">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="h-11 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div className="self-stretch flex flex-col gap-2 w-full">
              <label className="text-white text-base font-semibold">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter your location"
                className="h-11 px-3 bg-white text-gray-800 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Add Images */}
          <div className="my-10">
            <h2 className="font-medium text-xl">
              Add Images <span className="text-red-500">* (Min 3)</span>
            </h2>
            <div className="px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-6">
              <BiErrorCircle className="w-10 h-10 text-orange-500" />
              <p className="font-normal text-base">
                One showing eyes, one showing a toothy grin and one showing full
                body. Be classy, not trashy. No nudes. G or PG rated photos
                only.
              </p>
            </div>
          </div>

          {/* File Upload - UPDATED SECTION */}
          <div className="flex items-center justify-center">
            <div className="w-full space-y-4">
              <div className="bg-white rounded-xl p-12 flex flex-col items-center justify-center shadow-md">
                <div
                  className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-orange-600 transition"
                  onClick={handleClick}
                >
                  <Upload className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-gray-800 font-semibold text-lg mb-2">
                  Upload Photos
                </h2>
                <p className="text-gray-500 text-[10px] text-center mb-4 max-w-[288px] mx-auto">
                  Minimum 3 photos required • Maximum 13 photos allowed
                </p>

                {/* Upload Progress Indicator */}
                <div className="w-full max-w-xs mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Upload Progress</span>
                    <span>{files.length}/13 images</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(files.length / 13) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Min: 3</span>
                    <span
                      className={
                        files.length < 3
                          ? "text-red-500 font-semibold"
                          : "text-green-500 font-semibold"
                      }
                    >
                      {files.length >= 3
                        ? "✓ Requirement met"
                        : "Need more images"}
                    </span>
                  </div>
                </div>

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
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <RiDeleteBinLine className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Upload Status */}
                    <div
                      className={`text-center p-2 rounded-lg ${
                        files.length >= 3
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {files.length >= 3 ? (
                        <div className="flex items-center justify-center gap-2">
                          <GiCheckMark className="w-4 h-4" />
                          Ready to submit! ({files.length}/13 images)
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <BiErrorCircle className="w-4 h-4" />
                          {3 - files.length} more image
                          {3 - files.length !== 1 ? "s" : ""} needed
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Upload Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 font-semibold">
                    📸 How to upload multiple images:
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    • Hold <kbd className="px-1 bg-gray-200 rounded">Ctrl</kbd>{" "}
                    (Windows) or{" "}
                    <kbd className="px-1 bg-gray-200 rounded">Cmd</kbd> (Mac)
                  </p>
                  <p className="text-xs text-gray-500">
                    • Click and drag to select multiple files
                  </p>
                </div>

                {errors.images && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-red-600 text-sm font-semibold flex items-center gap-2">
                      <BiErrorCircle className="w-4 h-4" />
                      {errors.images}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="bg-[#FFFFFF33] p-5 rounded-lg my-8">
            <div className="w-10 h-10 relative bg-orange-500 rounded overflow-hidden p-1 flex justify-center text-center mx-auto mb-5">
              <MdOutlinePrivacyTip className="w-full h-full text-white" />
            </div>
            <p className="font-normal text-lg text-center">
              Your safety is what inspired us. You don't know anything about the
              person you or your friend have given the card to. Please be smart
              about what information you share.
            </p>
          </div>

          <div className="px-3 py-8 flex items-center gap-4 bg-[#FFFFFF33] rounded-lg my-10">
            <RiDeleteBinLine className="w-14 h-14 text-orange-500" />
            <p className="font-normal text-base">
              Your cards will be sent to you after your profile has been
              approved for not violating decency standards.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-[#434343] px-4 py-8 rounded-lg mt-12 mb-[100px]">
            <div className="max-w-[330px] mx-auto mb-6">
              <h2 className="font-semibold text-xl mb-4">
                Person to person dating, but with a safer approach.
              </h2>
              <p className="font-normal text-base">
                This is your "safe share" zone – just the details you choose to
                pass along.
              </p>
            </div>

            {errors.contact && (
              <p className="text-red-500 text-center mb-4">{errors.contact}</p>
            )}

            <div className="max-w-[340px] mx-auto">
              <div className="self-stretch flex flex-col gap-2">
                <label className="text-white text-base font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your display name"
                  className="h-11 px-3 bg-white text-gray-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="self-stretch flex flex-col gap-2 mt-6">
                <label className="text-white text-base font-semibold">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your unique email"
                  className={`h-11 px-3 bg-white text-gray-700 text-sm font-medium rounded-lg outline outline-1 ${
                    errors.email ? "outline-red-500" : "outline-gray-300"
                  } focus:outline-orange-500 focus:ring-2 focus:ring-orange-400`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="md:my-8 my-4">
                <h2 className="text-base font-semibold text-center">and/or</h2>
              </div>

              <div className="self-stretch flex flex-col gap-2">
                <label className="text-white text-base font-semibold">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="number"
                  placeholder="Enter your dedicated phone number"
                  className="h-11 px-3 bg-white text-gray-700 text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className={`w-full mt-6 p-2.5 rounded-lg text-white text-base font-semibold transition ${
                  submitLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {submitLoading ? "⏳ Submitting..." : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
