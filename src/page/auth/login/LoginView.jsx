import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../features/auth/authFetch";
import { resetAuthError } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const LoginView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = useState(false);

  // ✅ Reset error on mount/unmount
  useEffect(() => {
    return () => dispatch(resetAuthError());
  }, [dispatch]);

  // ✅ Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin"); // change this route as needed
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      console.log("✅ Login successful");
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="overflow-hidden rounded-2xl bg-white shadow">
          {/* Header */}
          <div className="p-8 text-center text-white">
            <img
              src="/img/page/home/remove_preview.png"
              alt="Logo"
              className="mx-auto"
            />
          </div>
          <div>
            <h1 className="text-center font-raleway text-xl font-bold text-black">
              Welcome Back
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-raleway text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#000044]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-raleway text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-12 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#000044]"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#000044] focus:ring-[#000044]"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block font-raleway text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              {/* <a
                href='#'
                className='text-sm font-medium text-[#000044] hover:text-[#000066] transition-colors'
              >
                Forgot password?
              </a> */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full transform rounded-xl bg-[#FF8C00] px-4 py-3 font-raleway font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#000066] focus:outline-none focus:ring-2 focus:ring-[#000044] focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Loading...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
