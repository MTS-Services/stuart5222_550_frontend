import React from 'react';

// ✅ Reusable Image Component
const Image = ({
  src,
  alt = 'Image',
  width = '100%',
  height = 'auto',
  className = '',
  fallback = '/fallback.png', // optional default image
  style = {},
  loading = 'lazy',
  onClick,
}) => {
  const handleError = (e) => {
    e.target.src = fallback;
  };

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={`object-cover rounded-md ${className}`}
      style={style}
      onError={handleError}
      onClick={onClick}
    />
  );
};

export default Image;
