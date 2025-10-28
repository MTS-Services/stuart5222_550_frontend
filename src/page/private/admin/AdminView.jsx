import { useEffect, useState } from 'react';
import { WaitListTable } from './components/WaitListTable';
import { useDispatch } from 'react-redux';
import { adminUserList } from '../../../features/admin/management/usreFetch';
import Overviews from '../common/Overviews';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    // Later you can modify this dispatch to include date filter params if API supports it
    dispatch(adminUserList({ page: page, limit: 50, status: 'WAITLIST' }));
  }, [dispatch, page]);

  return (
    <div className='text-black md:p-8'>
      {/* Header */}
      <Overviews />

      <div>
        <h2 className='md:text-[28px] font-semibold font-poppins text-black my-3'>
          Wait List
        </h2>
        {/* 🧾 Waitlist Table */}
        <WaitListTable page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default AdminDashboard;
