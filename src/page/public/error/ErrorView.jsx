import React from 'react';

const ErrorView = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-[#3B3B3D] px-[10px]'>
      <h1 className='text-6xl font-bold text-white mb-4'>404</h1>
      <p className='text-xl text-white mb-8 text-center'>
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        href='/'
        className='px-6 py-3 bg-[#F07400] text-white rounded-lg hover:bg-[#d06300] transition'
      >
        Go to Home
      </a>
    </div>
  );
};

export default ErrorView;
