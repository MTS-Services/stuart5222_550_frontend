import { AllCard } from '../common/AllCard';
import { RequestUserTable } from './components/RequestUserTable';
import { UserManagementDateDropDown } from './components/UserManagementDateDropDown';

const UserManageView = () => {
  return (
    <div className='bg-[#F9FAFB] md:p-8 p-6'>
      <div className=''>
        <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
          Dashboard Overview
        </h2>
        <p className='justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-4 mt-1'>
          Monitor your user performance
        </p>
        <h3 className="justify-center text-[#111827] text-base font-normal font-['Poppins'] leading-normal">
          Last 30 days overview
        </h3>
        <UserManagementDateDropDown />
      </div>
      <AllCard />
      <div className=''>
        <h2 className='text-[28px] font-semibold font-poppins text-black my-3 sm:my-4 md:my-5 lg:my-6 xl:my-7'>
          Approved User
        </h2>
        <RequestUserTable />
      </div>
    </div>
  );
};

export default UserManageView;
