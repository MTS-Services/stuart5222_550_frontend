import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RequestUserTable } from './components/RequestUserTable';
import { adminUserDraftProfile } from '../../../features/admin/management/usreFetch';
import Overviews from '../common/Overviews';

const UserManageView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(adminUserDraftProfile({ page: 1, limit: 50, status: 'DRAFT' }));
  }, [dispatch]);

  return (
    <div className='bg-[#F9FAFB] md:p-8'>
      <Overviews />
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
