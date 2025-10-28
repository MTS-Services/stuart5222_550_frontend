import { useDispatch, useSelector } from 'react-redux';
import QRCard from '../../../components/common/QRCard';
import { useEffect } from 'react';
import { getUserQRcode } from '../../../features/admin/home/dashboardFetch';
import { useParams } from 'react-router-dom';
import Skeleton from '../../../components/ui/Skeleton';

const AllQRCodes = () => {
  const dispatch = useDispatch();

  const { qrCodeList, qrCodeUser, loading } = useSelector(
    (state) => state.dashboard
  );
  const { email: user_email } = useParams();

  useEffect(() => {
    if (user_email) {
      dispatch(getUserQRcode(user_email));
    }
  }, [dispatch, user_email]);

  if (loading) {
    return (
      <div className='p-4'>
        <h1 className='text-2xl font-bold'>QR-CODE LIST</h1>
        <div className='grid grid-cols-2 md:grid-cols-6 gap-4 py-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='rounded-xl border p-4 bg-white flex flex-col items-center justify-center'
              style={{ height: '360px', width: '100%' }}
            >
              {/* QR Placeholder */}
              <Skeleton
                width='180px'
                height='180px'
                className='mb-4 rounded-md'
              />

              {/* Text placeholders */}
              <Skeleton width='60%' height='0.8rem' className='mb-2' />
              <Skeleton width='40%' height='0.8rem' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>QR-CODE LIST</h1>
        <div>
          <p className='text-gray-700'>
            Email: {qrCodeUser?.email || 'Unknown Email'}
          </p>
          <p className='text-gray-700'>
            Name: {qrCodeUser?.name || 'Unknown User'}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-6 gap-4 py-6'>
        {qrCodeList.map((card) => (
          <QRCard
            key={card.id}
            qrCode={card.qrCode}
            scanCount={card.scanCount}
            maxScans={card.maxScans}
          />
        ))}
      </div>
    </div>
  );
};

export default AllQRCodes;
