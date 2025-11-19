import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../features/auth/authFetch";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { mail } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        resetPassword({ email: mail, password: formData.newPassword }),
      ).unwrap();
      toast.success("Password has been reset successfully!");
      navigate(`/auth/login`);
    } catch (error) {
      setError(error);
      console.error("Error resetting password:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. The link may be invalid or expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-orange-100 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border-2 border-gray-100 p-8 shadow-lg">
          {/* Header */}
          <div className="mb-4 flex justify-center">
            <img
              src="/img/page/home/remove_preview.png"
              alt="Logo"
              className="mx-auto"
            />
          </div>
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">Reset Password</h2>
            <p className="text-gray-700">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 outline-none transition-all focus:border-[#F07400] focus:ring-2 focus:ring-[#F07400]"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F07400]"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                At least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-12 outline-none transition-all focus:border-[#F07400] focus:ring-2 focus:ring-[#F07400]"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#F07400]"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="flex items-center gap-2 text-sm">
                {formData.newPassword === formData.confirmPassword ? (
                  <>
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-red-600">Passwords do not match</span>
                  </>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#F07400] py-3 font-semibold text-white transition-colors hover:bg-[#D66400] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 text-red-600">
              {error.message || "An error occurred. Please try again."}
            </div>
          )}

          {/* Back to Login */}
          {/* <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-sm font-semibold text-[#F07400] hover:text-[#D66400]"
            >
              ← Back to Login
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
