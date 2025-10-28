import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RequestUserTable } from './components/RequestUserTable';
import { adminUserDraftProfile } from '../../../features/admin/management/usreFetch';
import Overviews from '../common/Overviews';
import { TableDropDown } from './components/TableDropDown';

const UserManageView = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('DRAFT');

  useEffect(() => {
    dispatch(adminUserDraftProfile({ page: 1, limit: 50, status: status })); // ✅
  }, [dispatch, status]); // ✅

  return (
    <div className='bg-[#F9FAFB] md:p-8'>
      <Overviews />
      <div className=''>
        <div className='flex justify-between items-center'>
          <h2 className='text-[28px] font-semibold font-poppins text-black my-3 sm:my-4 md:my-5 lg:my-6 xl:my-7'>
            Approved User
          </h2>

          <TableDropDown value={status} onChange={setStatus} />
        </div>
        <RequestUserTable />
      </div>
    </div>
  );
};

export default UserManageView;
