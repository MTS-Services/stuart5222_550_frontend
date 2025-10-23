import { MdOutlineContentCopy, MdCheck } from 'react-icons/md';
import { IoMdArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/ui/Image';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const LetsConnectView = () => {
  const navigate = useNavigate();
  const { userProfile } = useSelector((state) => state.profile);

  // Track which field was copied (by key)
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, fieldKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      // Reset after 2 seconds
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const name = userProfile?.displayName || 'Cheryann Smith';
  const email = userProfile?.email || 'cheryann@gmail.com';
  const phone = userProfile?.phone || '+1 (555) 010-0001';

  return (
    <div className='px-[10px] py-2 sm:py-4 md:py-6 lg:py-8 bg-[#3B3B3D] min-h-screen'>
      <div className='max-w-[600px] mx-auto space-y-8'>
        <h3
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-white mb-3 cursor-pointer'
        >
          <IoMdArrowBack /> Back
        </h3>
        <div className='pt-6 space-y-4'>
          <Image
            src='/img/page/home/remove_preview.png'
            alt='Random pic'
            width='120px'
            height='120px'
            className='mx-auto'
          />
          <div className='flex justify-center text-center'>
            <h2 className='md:text-[40px] text-[32px] font-raleway font-semibold text-[#F07400] w-[440px]'>
              Here’s how to reach me
            </h2>
          </div>
        </div>

        <div className='text-[#FFFFFF] text-base font-medium bg-[#FFFFFF14] p-4 rounded-lg mt-3'>
          <p className='flex items-center justify-between'>
            Name : {name}
            <button
              type='button'
              onClick={() => handleCopy(name, 'name')}
              className='ml-2 text-[#ACACAC] hover:text-white transition-colors'
              aria-label='Copy name'
            >
              {copiedField === 'name' ? (
                <MdCheck className='text-green-400' />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </p>
          <p className='flex items-center justify-between my-4'>
            E-mail : {email}
            <button
              type='button'
              onClick={() => handleCopy(email, 'email')}
              className='ml-2 text-[#ACACAC] hover:text-white transition-colors'
              aria-label='Copy email'
            >
              {copiedField === 'email' ? (
                <MdCheck className='text-green-400' />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </p>
          <p className='flex items-center justify-between'>
            Phone number : {phone}
            <button
              type='button'
              onClick={() => handleCopy(phone, 'phone')}
              className='ml-2 text-[#ACACAC] hover:text-white transition-colors'
              aria-label='Copy phone number'
            >
              {copiedField === 'phone' ? (
                <MdCheck className='text-green-400' />
              ) : (
                <MdOutlineContentCopy />
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LetsConnectView;
