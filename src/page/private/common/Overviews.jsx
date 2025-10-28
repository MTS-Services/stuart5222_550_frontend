import React, { useState } from 'react';
import { AllCard } from './AllCard';
import { DateDropDown } from './DateDropDown';
import { useSelector } from 'react-redux';
import { FaRedoAlt } from 'react-icons/fa';

const Overviews = () => {
  const { dashboardData, loading } = useSelector((state) => state.dashboard);

  const [filter, setFilter] = useState('month');

  const handleReload = () => {
    window.location.reload();
  };
  return (
    <>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
            Dashboard Overview
          </h2>
          <p className='text-[#464646] text-base font-normal font-lato mb-4 mt-1'>
            Monitor your user performance
          </p>
          <h3 className='text-[#111827] text-base font-normal font-poppins leading-normal'>
            {filter === 'today'
              ? 'Today’s Overview'
              : filter === 'week'
              ? 'This Week’s Overview'
              : filter === 'year'
              ? 'Yearly Overview'
              : 'Last 30 Days Overview'}
          </h3>
          {/* 🗓 Date Filter */}
          <div className='flex gap-4 items-center mt-2 md:py-2'>
            <DateDropDown value={filter} onChange={setFilter} />
            <button
              onClick={handleReload}
              className='bg-slate-400 p-1 rounded-full'
            >
              <FaRedoAlt className=' text-white' />
            </button>
          </div>
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <AllCard
        loading={loading}
        filter={filter}
        dashboardData={dashboardData}
      />
    </>
  );
};

export default Overviews;
