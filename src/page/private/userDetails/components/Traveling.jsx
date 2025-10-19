import React from 'react';
import { FaRegCalendar } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';

const Traveling = () => {
  return (
    <div className='bg-gradient-to-b border from-orange-500/10 to-white p-6 rounded-lg flex flex-col gap-6'>
      <div className='text-xl font-bold text-neutral-800'>
        <span className='uppercase'>I </span>
        <span className='lowercase'>am traveling and will be in:</span>
      </div>

      <div className='flex flex-col gap-4'>
        {/* Location */}
        <div className='flex items-center gap-3'>
          <span className='text-orange-500 text-2xl'>📍</span>
          <span className='text-xl font-medium text-neutral-800'>
            Location: Anywhere, USA
          </span>
        </div>

        {/* Start Date */}
        <div className='flex items-center gap-3'>
          <span className='text-orange-500 text-2xl'>📅</span>
          <span className='text-xl font-medium text-neutral-800'>
            Start-Date: October 1, 2025
          </span>
        </div>

        {/* End Date */}
        <div className='flex items-center gap-3'>
          <span className='text-orange-500 text-2xl'>📅</span>
          <span className='text-xl font-medium text-neutral-800'>
            End-Date: October 20, 2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default Traveling;
