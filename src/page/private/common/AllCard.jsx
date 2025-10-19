import { FaUsers, FaCheckCircle, FaIdCard, FaClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Skeleton from '../../../components/ui/Skeleton';

export const AllCard = () => {
  const { dashboardData, loading } = useSelector((state) => state.dashboard);

  const cardData = [
    {
      id: 1,
      title: 'Total Users',
      value: dashboardData?.totalUsers ?? '--',
      icon: <FaUsers className='w-5 h-5 text-gray-800' />,
      color: 'bg-blue-50',
    },
    {
      id: 2,
      title: 'Wait List',
      value: dashboardData?.waitlistUsers ?? '--',
      icon: <FaClock className='w-5 h-5 text-gray-800' />,
      color: 'bg-yellow-50',
    },
    {
      id: 3,
      title: 'Active Users',
      value: dashboardData?.userStatus?.active ?? '--',
      icon: <FaClock className='w-5 h-5 text-gray-800' />,
      color: 'bg-yellow-50',
    },
    {
      id: 4,
      title: 'Verified Profiles',
      value: dashboardData?.verifiedProfiles ?? '--',
      icon: <FaCheckCircle className='w-5 h-5 text-gray-800' />,
      color: 'bg-green-50',
    },
    {
      id: 5,
      title: 'Active Cards',
      value: dashboardData?.activeCards ?? '--',
      icon: <FaIdCard className='w-5 h-5 text-gray-800' />,
      color: 'bg-purple-50',
    },
    {
      id: 6,
      title: 'Total Scans',
      value: dashboardData?.totalScans ?? '--',
      icon: <FaIdCard className='w-5 h-5 text-gray-800' />,
      color: 'bg-purple-50',
    },
    {
      id: 7,
      title: 'Total Revenue',
      value: dashboardData?.overview?.totalRevenue ?? '--',
      icon: <FaIdCard className='w-5 h-5 text-gray-800' />,
      color: 'bg-purple-50',
    },
    {
      id: 8,
      title: 'Active Subscriptions',
      value: dashboardData?.overview?.activeSubscriptions ?? '--',
      icon: <FaIdCard className='w-5 h-5 text-gray-800' />,
      color: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='rounded-xl border p-5 bg-white'>
            <Skeleton width='60%' height='1rem' className='mb-3' />
            <div className='flex items-center justify-between mb-3'>
              <Skeleton width='35%' height='2rem' />
              <Skeleton
                width='2.5rem'
                height='2.5rem'
                className='rounded-full'
              />
            </div>
            <Skeleton width='50%' height='0.75rem' />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mt-2'>
      {cardData.map((item) => (
        <div
          key={item.id}
          className='rounded-xl border p-5 bg-white col-span-1 shadow-sm hover:shadow-md transition-all duration-200'
        >
          <p className='text-gray-700 font-semibold mb-2'>{item.title}</p>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-gray-900 text-2xl font-semibold'>
              {item.value}
            </span>
            <div className={`${item.color} p-3 rounded-lg`}>{item.icon}</div>
          </div>
          <p className='text-gray-500 text-xs font-light'>vs last month</p>
        </div>
      ))}
    </div>
  );
};
