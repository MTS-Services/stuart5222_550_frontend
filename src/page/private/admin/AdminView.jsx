import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AllCard } from './components/AllCard';
import { DateDropDown } from './components/DateDropDown';
import { WaitListTable } from './components/WaitListTable';
import { usersWaitlist } from '../../../features/users-management/usersFetch';

const AdminDashboard = () => {
  const { users, loading } = useSelector((state) => state.userWaitlist);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(usersWaitlist({ page: 2, limit: 10 }));
  }, [dispatch]);

  return (
    <div className="text-black md:p-8 p-6">
      <div className="">
        <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
          Dashboard Overview
        </h2>
        <p className="justify-start text-[#464646] text-base font-normal font-lato leading-normal mb-4 mt-1">
          Monitor your user performance
        </p>
        <h3 className="justify-center text-[#111827] text-base font-normal font-['Poppins'] leading-normal">
          Last 30 days overview
        </h3>
        <DateDropDown />
      </div>
      <AllCard />

      <div className="">
        <h2 className="text-[28px] font-semibold font-poppins text-black my-3 sm:my-4 md:my-5 lg:my-6 xl:my-7">
          Wait list
        </h2>
        <WaitListTable waitListData={users} loading={loading} />
      </div>
    </div>
  );
};

export default AdminDashboard;
