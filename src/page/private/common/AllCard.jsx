import {
  FaUsers,
  FaCheckCircle,
  FaIdCard,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import Skeleton from "../../../components/ui/Skeleton";

export const AllCard = ({ loading, analyticsData, dashboardData, filter }) => {
  const overview = dashboardData?.overview || {};

  const cardData = [
    {
      id: 1,
      title: "Total Users",
      value: analyticsData?.users ?? overview?.totalUsers ?? "--",
      icon: <FaUsers className="h-5 w-5 text-gray-800" />,
      color: "bg-blue-50",
    },
    {
      id: 2,
      title: "Wait List",
      value: dashboardData?.userStatus?.waitlist ?? "--",
      icon: <FaClock className="h-5 w-5 text-gray-800" />,
      color: "bg-yellow-50",
    },
    {
      id: 3,
      title: "Active Users",
      value: dashboardData?.userStatus?.active ?? "--",
      icon: <FaCheckCircle className="h-5 w-5 text-gray-800" />,
      color: "bg-green-50",
    },
    {
      id: 4,
      title: "Verified Profiles",
      value:
        analyticsData?.profiles ??
        dashboardData?.profileStatus?.approved ??
        "--",
      icon: <FaCheckCircle className="h-5 w-5 text-gray-800" />,
      color: "bg-green-50",
    },
    {
      id: 5,
      title: "Active Cards",
      value:
        analyticsData?.cards ?? dashboardData?.data?.cardStatus?.active ?? "--",
      icon: <FaIdCard className="h-5 w-5 text-gray-800" />,
      color: "bg-purple-50",
    },
    {
      id: 6,
      title: "Total Scans",
      value: analyticsData?.scans ?? overview?.totalScans ?? "--",
      icon: <FaIdCard className="h-5 w-5 text-gray-800" />,
      color: "bg-purple-50",
    },
    {
      id: 7,
      title: "Total Revenue",
      value: analyticsData?.revenue?.amount ?? overview?.totalRevenue ?? "--",
      icon: <FaDollarSign className="h-5 w-5 text-gray-800" />,
      color: "bg-green-50",
    },
    {
      id: 8,
      title: "Active Subscriptions",
      value: overview?.activeSubscriptions ?? "--",
      icon: <FaIdCard className="h-5 w-5 text-gray-800" />,
      color: "bg-indigo-50",
    },
  ];

  if (loading) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5">
            <Skeleton width="60%" height="1rem" className="mb-3" />
            <div className="mb-3 flex items-center justify-between">
              <Skeleton width="35%" height="2rem" />
              <Skeleton
                width="2.5rem"
                height="2.5rem"
                className="rounded-full"
              />
            </div>
            <Skeleton width="50%" height="0.75rem" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {cardData.map((item) => (
        <div
          key={item.id}
          className="col-span-1 rounded-xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          <p className="mb-2 font-raleway text-sm font-semibold text-gray-700 md:text-lg">
            {item.title}
          </p>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-2xl font-semibold text-gray-900">
              {item.value}
            </span>
            <div className={`${item.color} rounded-lg p-3`}>{item.icon}</div>
          </div>
          <p className="font-raleway text-xs font-light text-gray-500">
            {filter}
          </p>
        </div>
      ))}
    </div>
  );
};
