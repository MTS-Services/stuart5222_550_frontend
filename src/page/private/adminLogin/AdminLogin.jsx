import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { toast } from "react-toastify";
import { postData } from "../../../utils/axiosInstance";

export const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const value = {
      email: form.email.value,
      password: form.password.value,
    };

    // 2. Frontend validation check
    if (!value.email || !value.password) {
      toast.error("Email and Password are required!", {
        position: "top-right",
      });
      return;
    }

    try {
      console.log("Submitting data:", value);

      // POST request to backend
      const response = await postData("adminLogin", value);
      console.log("Server Response:", response);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Optionally, navigate after success
      // setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err) {
      console.error("Failed to login:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-[#f0f2f3] h-screen flex items-center justify-center px-3">
      <div className="max-w-[446px] w-full rounded-lg shadow-sm">
        <div className="flex justify-center items-center pb-10">
          <img
            src="/img/page/home/remove_preview.png"
            alt="Logo"
            className="w-[120px] h-[85px] object-cover bg-cover"
          />
        </div>

        <div className="p-6 bg-white rounded-lg">
          <div className="p-4">
            <form onSubmit={handleAdminSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Type Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Type Your Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div
                  className="absolute top-[44px] right-3 cursor-pointer text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <LuEyeOff className="w-5 h-5" />
                  ) : (
                    <LuEye className="w-5 h-5" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#FF8C00] text-black w-full py-2 rounded-[4px] mt-14"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
