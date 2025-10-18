import { AllCard } from '../common/AllCard';

import { DateDropDown } from './components/DateDropDown';
import { WaitListTable } from './components/WaitListTable';

const AdminDashboard = () => {
  return (
    <div className='text-black md:p-8 p-6'>
      <div>
        <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
          Dashboard Overview
        </h2>
        <p className='text-[#464646] text-base font-normal font-lato mb-4 mt-1'>
          Monitor your user performance
        </p>
        <h3 className='text-[#111827] text-base font-normal font-poppins leading-normal'>
          Last 30 days overview
        </h3>
        <DateDropDown />
      </div>

      <AllCard />

      <div>
        <h2 className='text-[28px] font-semibold font-poppins text-black my-3'>
          Wait list
        </h2>
        <WaitListTable />
      </div>
    </div>
  );
};

export default AdminDashboard;
