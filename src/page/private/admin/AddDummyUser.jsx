import { useState } from "react";
import { toast } from "react-toastify";
import { endpoints } from "../../../config/api/httpEndpoint";
import { STORAGE } from "../../../config/storage/auth/authStorage";

const AddDummyUser = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    age: "",
    height: "",
    bodyType: "",
    dealbreakers: "",
    bio: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) {
      console.log("No files selected");
      return;
    }
    
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      e.target.value = ""; // Reset input
      return;
    }

    console.log(`Selected ${files.length} image(s):`, files.map(f => f.name));
    setImages(files);

    // Create previews
    const previews = files.map((file) => {
      const url = URL.createObjectURL(file);
      console.log(`Created preview URL for ${file.name}:`, url);
      return url;
    });
    setImagePreviews(previews);
    
    toast.success(`${files.length} image(s) selected`);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      const token = STORAGE.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      for (const image of images) {
        const formData = new FormData();
        formData.append("file", image);

        console.log(`Uploading image: ${image.name}`);
        
        const response = await fetch(`${API_BASE_URL}/upload/single`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await response.json();
        console.log(`Upload response for ${image.name}:`, data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to upload image");
        }

        if (data.url) {
          uploadedUrls.push(data.url);
          console.log(`✅ Uploaded: ${data.url}`);
        } else {
          console.error("No URL in response:", data);
        }
      }

      console.log(`All images uploaded. Total URLs: ${uploadedUrls.length}`, uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images: " + error.message);
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.name) {
      toast.error("Email and Name are required!");
      return;
    }

    setLoading(true);

    try {
      // Upload images first if any
      let imageUrls = [];
      if (images.length > 0) {
        toast.info(`Uploading ${images.length} image(s)...`);
        imageUrls = await uploadImages();
        
        if (imageUrls.length === 0) {
          toast.error("Failed to upload images. Cannot proceed.");
          return;
        }
        
        toast.success(`✅ ${imageUrls.length} image(s) uploaded successfully`);
        console.log("Uploaded image URLs:", imageUrls);
      } else {
        toast.error("Please select at least one image");
        return;
      }

      const token = STORAGE.getToken();
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoints.admin.CREATE_DUMMY_USER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          age: parseInt(formData.age),
          height: formData.height,
          bodyType: formData.bodyType,
          dealbreakers: formData.dealbreakers,
          bio: formData.bio,
          location: formData.location,
          images: imageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create dummy user");
      }

      toast.success("✅ Dummy user created successfully!");
      
      // Clean up preview URLs
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      
      // Reset form
      setFormData({
        email: "",
        name: "",
        phone: "",
        age: "",
        height: "",
        bodyType: "",
        dealbreakers: "",
        bio: "",
        location: "",
      });
      setImages([]);
      setImagePreviews([]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      console.log("Created user:", data);
    } catch (error) {
      console.error("Error creating dummy user:", error);
      toast.error(error.message || "Failed to create dummy user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCFA] text-black md:p-8 p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-[#F07400] text-white px-6 py-2 rounded-full mb-4 shadow-lg">
          <span className="text-sm font-semibold tracking-wide">ADMIN PANEL</span>
        </div>
        <h2 className="font-raleway font-bold text-[#000044] text-3xl md:text-4xl mb-3 flex items-center justify-center gap-3">
          <svg className="w-10 h-10 text-[#F07400]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Add Dummy User
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Create a fully verified user account with active subscription and profile - no payment required
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
          {/* Form Header */}
          <div className="bg-[#F07400] px-8 py-6">
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              User Information Form
            </h3>
            <p className="text-orange-50 text-sm mt-1">All fields marked with * are required</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-5">
              <h4 className="text-lg font-semibold text-[#000044] flex items-center gap-2 border-b-2 border-[#F07400] pb-2">
                <svg className="w-5 h-5 text-[#F07400]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </h4>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email Address <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>

                {/* Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Full Name <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Phone Number <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>

                {/* Age */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Age <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="25"
                    min="18"
                    max="100"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Physical Attributes Section */}
            <div className="space-y-5">
              <h4 className="text-lg font-semibold text-[#000044] flex items-center gap-2 border-b-2 border-[#F07400] pb-2">
                <svg className="w-5 h-5 text-[#F07400]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
                Physical Attributes
              </h4>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Height */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      Height <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="5'10&quot; / 178cm"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>

                {/* Body Type */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Body Type <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    name="bodyType"
                    value={formData.bodyType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300 appearance-none bg-white"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select body type</option>
                    <option value="Slim">Slim</option>
                    <option value="Average">Average</option>
                    <option value="Athletic">Athletic</option>
                    <option value="Muscular">Muscular</option>
                    <option value="Curvy">Curvy</option>
                    <option value="Heavyset">Heavyset</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Preferences Section */}
            <div className="space-y-5">
              <h4 className="text-lg font-semibold text-[#000044] flex items-center gap-2 border-b-2 border-[#F07400] pb-2">
                <svg className="w-5 h-5 text-[#F07400]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Location & Preferences
              </h4>

              <div className="grid md:grid-cols-1 gap-5">
                {/* Location */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Location <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="New York, NY"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>

                {/* Dealbreakers */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                      </svg>
                      Dealbreakers <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <textarea
                    name="dealbreakers"
                    value={formData.dealbreakers}
                    onChange={handleChange}
                    placeholder="e.g., Smoking, Pets, Long distance..."
                    rows="2"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300 resize-none"
                  />
                </div>

                {/* Bio */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Bio <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-5">
              <h4 className="text-lg font-semibold text-[#000044] flex items-center gap-2 border-b-2 border-[#F07400] pb-2">
                <svg className="w-5 h-5 text-[#F07400]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Profile Images
              </h4>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Upload Photos <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    required
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F07400] focus:border-[#F07400] transition-all duration-200 group-hover:border-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#F07400] hover:file:bg-orange-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Upload at least 1 image (Maximum 5 images)
                </p>
              </div>

              {/* Uploading Status */}
              {uploadingImages && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl shadow-sm">
                  <p className="text-sm text-blue-700 font-semibold flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading images to server...
                  </p>
                </div>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-[#F07400]">
                  <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#F07400]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Selected Images ({imagePreviews.length}/5)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-200">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-gradient-to-r bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110 transform"
                          title="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div className="absolute bottom-2 left-2 bg-gradient-to-r from-[#F07400] to-[#FF8C00] text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-inner">
              <h3 className="font-bold text-[#000044] mb-3 text-lg flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                What will be created:
              </h3>
              <ul className="text-sm text-green-800 space-y-2.5">
                <li className="flex items-center gap-2 font-medium">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                  User account with VERIFIED status
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                  Profile with APPROVED status
                </li>
                
                <li className="flex items-center gap-2 font-medium">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                  Active subscription (1 year)
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                  Welcome email sent automatically
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading || uploadingImages}
                className={`flex-1 px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 transform ${
                  loading || uploadingImages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#F07400] hover:bg-[#D66400] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {loading || uploadingImages ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {uploadingImages ? "Uploading Images..." : "Creating User..."}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create Dummy User
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDummyUser;
