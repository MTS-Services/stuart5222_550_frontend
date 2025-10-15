import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../features/auth/authFetch';
import { resetAuthError } from '../../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Reset error on mount/unmount
  useEffect(() => {
    return () => dispatch(resetAuthError());
  }, [dispatch]);

  // ✅ Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin'); // change this route as needed
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
      console.log('✅ Login successful');
    } catch (err) {
      console.error('❌ Login failed:', err);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-2xl shadow-md w-full max-w-sm'
      >
        <h2 className='text-2xl font-semibold text-center mb-6'>
          Welcome Back 👋
        </h2>

        {/* Email Field */}
        <div className='relative mb-4'>
          <Mail className='absolute left-3 top-3 text-gray-400' size={18} />
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            required
            className='w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring focus:ring-blue-200 outline-none'
          />
        </div>

        {/* Password Field */}
        <div className='relative mb-4'>
          <Lock className='absolute left-3 top-3 text-gray-400' size={18} />
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            required
            className='w-full border border-gray-300 rounded-lg p-2 pl-10 pr-10 focus:ring focus:ring-blue-200 outline-none'
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-3 cursor-pointer text-gray-500'
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Error Display */}
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg transition duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginView;
