export const TravelMode = () => {
  return (
    <div className='bg-[#434343] md:px-5 px-2 py-8 rounded-lg'>
      <h2 className='font-bold text-2xl'>Travel Mode</h2>
      <div className='w-full flex items-center md:gap-5 gap-3 my-6'>
        <div className='self-stretch flex flex-col gap-2 w-[48%]'>
          <label className='text-white text-base font-semibold'>
            Start Date{' '}
          </label>
          <input
            type='text'
            placeholder='Enter your Date'
            className='h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
          />
        </div>
        <div className='self-stretch flex flex-col gap-2 w-[48%]'>
          <label className='text-white text-base font-semibold'>
            End Date{' '}
          </label>
          <input
            type='text'
            placeholder='Enter your date'
            className='h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
          />
        </div>
      </div>
      <div className='self-stretch flex flex-col gap-2 w-full'>
        <label className='text-white text-base font-semibold'>Location</label>
        <input
          type='text'
          placeholder='Enter your location'
          className='h-11 px-3 bg-white text-[#3B3B3D] text-sm font-medium rounded-lg outline outline-1 outline-gray-300 focus:outline-orange-500 focus:ring-2 focus:ring-orange-400'
        />
      </div>
    </div>
  );
};
