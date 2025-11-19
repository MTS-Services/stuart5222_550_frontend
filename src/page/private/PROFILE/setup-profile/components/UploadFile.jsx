import { Camera, Upload } from 'lucide-react';

export const UploadFile = ({
  handleClick,
  fileInputRef,
  handleFileChange,
  files,
}) => {
  return (
    <div className='flex items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-4'>
        {/* Upload Photos Card */}
        <div className='bg-white rounded-2xl p-12 flex flex-col items-center justify-center shadow-md'>
          {/* Upload Icon Box */}
          <div
            className='w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:bg-orange-600 transition'
            onClick={handleClick}
          >
            <Upload className='w-8 h-8 text-white' strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h2 className='text-gray-800 font-semibold text-lg mb-2'>
            Upload Photos
          </h2>

          {/* Description */}
          <p className='text-gray-500 text-sm text-center mb-4'>
            A minimum of 3 required photos and up
            <br />
            to 10 additional images
          </p>

          {/* Hidden file input */}
          <input
            type='file'
            accept='image/*'
            multiple
            ref={fileInputRef}
            className='hidden'
            onChange={handleFileChange}
          />

          {/* Preview selected files */}
          {files.length > 0 && (
            <ul className='mt-4 text-sm text-gray-600'>
              {files.map((file, idx) => (
                <li key={idx}>📷 {file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Divider */}
        <div className='flex items-center gap-4'>
          <div className='flex-1 h-px text-white'></div>
          <hr className='w-full bg-white' />
          <span className='text-white text-sm'>or</span>
          <hr className='w-full bg-white' />
        </div>

        {/* Camera Button */}
        <button className='w-full bg-white hover:bg-gray-50 rounded-xl py-4 px-6 flex items-center justify-center gap-3 transition-colors'>
          <Camera className='w-5 h-5 text-gray-700' />
          <span className='text-gray-800 font-medium'>
            Open Camera & Take Photo
          </span>
        </button>
      </div>
    </div>
  );
};
