import React from 'react';
import { FaRegCalendar } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';
import { shouldShowTravelMode, formatTravelDate } from '../../../../utils/travelMode';

const Traveling = ({ profile }) => {
  // Only show traveling component if travel mode should be displayed
  if (!shouldShowTravelMode(profile)) {
    return null;
  }

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
            Location: {profile.location}
          </span>
        </div>

        {/* Start Date */}
        <div className='flex items-center gap-3'>
          <span className='text-orange-500 text-2xl'>📅</span>
          <span className='text-xl font-medium text-neutral-800'>
            Start-Date: {formatTravelDate(profile.startDate)}
          </span>
        </div>

        {/* End Date */}
        <div className='flex items-center gap-3'>
          <span className='text-orange-500 text-2xl'>📅</span>
          <span className='text-xl font-medium text-neutral-800'>
            End-Date: {formatTravelDate(profile.endDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Traveling;
