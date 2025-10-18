import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminApprove } from '../../../../features/admin/management/usreFetch';

export const JoinWaitlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { success, loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(adminApprove(formData)).unwrap();
      console.log('✅ Request submitted successfully!');
    } catch (err) {
      console.error('❌ Request submission failed:', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full flex flex-col justify-start items-start gap-6 mt-8'
    >
      <input
        type='text'
        name='name'
        placeholder='Name'
        value={formData.name}
        onChange={handleChange}
        className='w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
      />

      <input
        type='email'
        name='email'
        placeholder='E-mail'
        value={formData.email}
        onChange={handleChange}
        className='w-full h-11 p-2.5 bg-white text-neutral-700 text-base font-semibold rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
      />

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <div className='w-full'>
        <button
          type='submit'
          disabled={loading}
          className='w-full p-2.5 bg-orange-500 rounded-lg text-white text-base font-semibold hover:bg-orange-600 transition disabled:opacity-50'
        >
          {loading ? 'Submitting...' : 'Join the waitlist'}
        </button>
      </div>
    </form>
  );
};
