import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../../features/auth/AuthContext';

export const JoinWaitlist = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // টগল between login/register
  const navigate = useNavigate();

  // AuthContext থেকে functions নিন
  const { login, registerUser, isAuthenticated, user } =
    useContext(AuthContext);

  // যদি user already logged in থাকে, তাহলে redirect
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Error clear যখন user type করে
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      return 'Email and password are required.';
    }

    if (!isLogin) {
      // Registration validation
      if (!formData.name) {
        return 'Name is required for registration.';
      }
      if (formData.password.length < 6) {
        return 'Password must be at least 6 characters long.';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return 'Please enter a valid email address.';
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      console.log(`${isLogin ? 'Login' : 'Registration'} attempt:`, {
        email: formData.email,
        name: formData.name,
      });

      let result;

      if (isLogin) {
        // Login logic - শুধু email এবং password দিতে হবে
        result = await login(formData.email, formData.password);
      } else {
        // Registration logic - confirm password লাগবে না
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password, // সরাসরি password save হবে
          joinedAt: new Date().toISOString(),
          role: 'user',
          status: 'active',
          isSubscribed: false,
          planType: 'free',
          subscriptionEndDate: null,
        };
        result = await registerUser(userData);
      }


      if (result.success) {
        console.log(
          `${isLogin ? 'Login' : 'Registration'} successful:`,
          result.user
        );


        // Success message
        toast.success(
          isLogin
            ? `Welcome back, ${result.user.name}!`
            : `Welcome to our community, ${result.user.name}!`
        );

        // Navigate based on user role or default page
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        // Show error from auth functions
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Registration'} failed:`, err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto'>
      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col justify-start items-start gap-6 mt-8 bg-white p-8 rounded-lg shadow-lg'
      >
        <div className='w-full text-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>
            {isLogin ? 'Welcome Back' : 'Join Our Community'}
          </h2>
          <p className='text-gray-600 mt-2'>
            {isLogin
              ? 'Sign in to your account'
              : 'Create your account to get started'}
          </p>
        </div>

        {/* Name Input - শুধু registration এর জন্য */}
        {!isLogin && (
          <div className='w-full'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Full Name
            </label>
            <input
              type='text'
              name='name'
              placeholder='Enter your full name'
              value={formData.name}
              onChange={handleChange}
              className='w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
              required={!isLogin}
            />
          </div>
        )}

        {/* Email Input */}
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Email Address
          </label>
          <input
            type='email'
            name='email'
            placeholder='Enter your email'
            value={formData.email}
            onChange={handleChange}
            className='w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
            required
          />
        </div>

        {/* Password Input */}
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Password
          </label>
          <input
            type='password'
            name='password'
            placeholder='Enter your password'
            value={formData.password}
            onChange={handleChange}
            className='w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
            required
            minLength={6}
          />
          {!isLogin && (
            <p className='text-xs text-gray-500 mt-1'>
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className='w-full p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-600 text-sm text-center'>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className='w-full'>
          <button
            type='submit'
            disabled={loading}
            className='w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? (
              <span className='flex items-center justify-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </div>

        {/* Toggle between Login/Register */}
        <div className='w-full text-center mt-4'>
          <p className='text-gray-600'>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type='button'
              onClick={toggleMode}
              className='text-orange-500 hover:text-orange-600 font-semibold underline'
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Additional Links */}
        <div className='w-full text-center text-sm text-gray-500 mt-4'>
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </form>
    </div>
  );
};
