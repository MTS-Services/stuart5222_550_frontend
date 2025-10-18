// AllTableResponsiveStyle.jsx
export const AllTableResponsiveStyle = () => {
  return (
    <style>{`
      .overflow-x-auto {
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
      }
      
      .overflow-x-auto::-webkit-scrollbar {
        height: 8px;
      }
      
      .overflow-x-auto::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      
      .overflow-x-auto::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      
      .overflow-x-auto::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `}</style>
  );
};

// Notification.jsx
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { Loading } from '../../../components/ui/loading';

const NotificationView = () => {
  const [waitListTable, setWaitListTable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      // const data = await getData(`notifications`);
      setWaitListTable(data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='text-black p-4 md:p-8'>
      {/* Loading */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='flex flex-wrap justify-between items-center mb-8 gap-4'>
            <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
              Notifications
            </h2>
            <div className='flex items-center gap-3 font-inter font-normal text-lg'>
              Mark All Read
              <IoCheckmarkDoneOutline className='w-6 h-6' />
            </div>
          </div>
          <div className='rounded-sm relative overflow-x-auto md:overflow-x-visible'>
            {waitListTable.length > 0 ? (
              waitListTable.map((notification, index) => (
                <div
                  key={index}
                  className='bg-white border-b border-gray-200 last:border-b-0 py-4 px-4 md:px-6'
                >
                  <div className='font-inter flex items-center gap-2'>
                    <img
                      className='w-[40px] h-[40px] rounded-full flex-shrink-0'
                      src={notification.image || '/img/page/admin/img1.png'}
                      alt=''
                    />
                    <div className='min-w-0'>
                      <h2 className='text-base font-semibold text-[#535369]'>
                        {notification.title}
                      </h2>
                      <p className='text-[#666C7E] font-normal text-[15px] break-words'>
                        {notification.description}
                      </p>
                      <p className='text-xs font-normal text-[#666C7E]'>
                        {notification.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500 py-4'>
                No notifications found.
              </p>
            )}
          </div>
          <AllTableResponsiveStyle />
        </>
      )}
    </div>
  );
};

export default NotificationView;
