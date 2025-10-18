// components/Skeleton.jsx
import React from 'react';

const Skeleton = ({
  width = '100%',
  height = '1rem',
  className = 'rounded',
  style,
}) => {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ width, height, ...style }}
    >
      {/* shimmer */}
      <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-[shimmer_1.5s_infinite]'></div>
    </div>
  );
};

export default Skeleton;
