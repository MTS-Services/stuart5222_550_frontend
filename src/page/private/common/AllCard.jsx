import {
  FaUsers,
  FaCheckCircle,
  FaIdCard,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";
import Skeleton from "../../../components/ui/Skeleton";

export const AllCard = ({ loading, dashboardData, filter }) => {
  const cardData = [
    {
      id: 1,
      title: "Total Users",
      value: dashboardData?.users || "0",
      icon: <FaUsers className="h-5 w-5 text-gray-800" />,
      color: "bg-blue-50",
    },
    {
      id: 2,
      title: "Wait List",
      value: dashboardData?.waitlist || "0",
      icon: <FaClock className="h-5 w-5 text-gray-800" />,
      color: "bg-yellow-50",
    },
    {
      id: 3,
      title: "Active Users",
      value: dashboardData?.active || "0",
      icon: <FaCheckCircle className="h-5 w-5 text-gray-800" />,
      color: "bg-green-50",
    },
    {
      id: 4,
      title: "Verified Profiles",
      value: dashboardData?.verifiedProfiles || "0",
      icon: <FaCheckCircle className="h-5 w-5 text-gray-800" />,
      color: "bg-green-50",
    },
    {
      id: 5,
      title: "Active Cards",
      value: dashboardData?.cards || "0",
      icon: <FaIdCard className="h-5 w-5 text-gray-800" />,
      color: "bg-purple-50",
    },
    {
      id: 6,
      title: "Total Scans",
      value: dashboardData?.scans || "0",
      icon: <FaIdCard className="h-5 w-5 text-gray-800" />,
      color: "bg-purple-50",
    },
    {
      id: 7,
      title: "Total Revenue",
      value: dashboardData?.totalRevenue || "0",
      icon: <FaDollarSign className="h-5 w-5 text-gray-800" />,
      color: "bg-green-50",
    },
    {
      id: 8,
      title: "Active Subscriptions",
      value: dashboardData?.activeSubscriptions || "0",
      icon: <FaIdCard className="h-5 w-5 text-gray-800" />,
      color: "bg-indigo-50",
    },
  ];

  if (loading) {
    return (
      <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5">
            <Skeleton width="60%" height="2rem" className="mb-3" />
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
          <div className="mb-3 flex items-center justify-between font-raleway">
            <span className="font-raleway text-2xl font-semibold text-gray-900">
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
