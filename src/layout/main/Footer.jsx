import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className='flex items-center justify-center bg-[#505050] px-4 py-6'>
      <div className='w-full md:w-[640px] md:my-10 mt-[10px] md:mt-0 mb-[40px] md:mb-0'>
        {/* Feature header */}
        <div className='self-stretch flex flex-col justify-start items-start gap-4'>
          <img
            className='w-15 h-15'
            src='/img/page/home/remove_preview.png'
            alt='Feature illustration'
          />

          <p className='text-white text-2xl font-raleway font-semibold'>
            Person to person dating, but with a safer approach.
          </p>
        </div>

        {/* Copyright & Legal */}
        <div className='space-y-4'>
          <p className='text-neutral-200 text-md font-normal  leading-3 py-4'>
            © 2025 <span className='text-orange-400'>SCAN ME MAYBE</span>
          </p>

          <p className='text-neutral-200 text-xs font-normal font-raleway leading-3'>
            Scan Me Maybe™ is a trademark of Scan Me Maybe, LLC. All Rights
            Reserved.
          </p>

          {/* Links */}
          <p className='text-stone-300 text-xs  underline'>
            Terms & Conditions
          </p>
          <p className='text-stone-300 text-xs  underline '>Privacy Policy</p>

          <p>
            <Link
              to='/auth/login'
              className='text-stone-300 text-xs  underline cursor-pointer'
            >
              Access Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
