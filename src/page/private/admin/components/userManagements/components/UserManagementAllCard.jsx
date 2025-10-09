import { FaUsers } from "react-icons/fa";

const cardData = [
  {
    id: 1,
    title: "Total User",
    price: "4,000",
    parcent: "12%",
  },
  {
    id: 2,
    title: "Revenue",
    price: "$2,847",
    parcent: "12%",
  },
  {
    id: 3,
    title: "Edit Requested",
    price: "5,000",
    parcent: "12%",
  },
  {
    id: 4,
    title: "Need approval",
    price: "8,000",
    parcent: "12%",
  },
];

export const UserManagementAllCard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mt-2 font-raleway">
      {cardData.map((data) => (
        <div
          key={data.id}
          className="rounded-lg border border-white/100 bg-white p-2 sm:p-4 md:p-5 col-span-1"
        >
          <div className="flex-col justify-center items-start gap-2">
            <div className="justify-start text-White-800 text-xs font-normal leading-none">
              {data.title}
            </div>
            <div className="flex items-center justify-between my-1">
              <div className="justify-start text-White-800 text-lg sm:text-xl md:text-2xl font-semibold leading-9">
                {data.price}
              </div>
              <div className="bg-green-50 p-2 sm:p-2.5 md:p-3 rounded-lg">
                <FaUsers className="w-5 h-5 text-gray-800" />
              </div>
            </div>
            <div className="justify-start">
              <span className="text-green-600 text-xs font-normal leading-none">
                {data.parcent}
              </span>
              <span className="text-White-600 text-xs font-normal leading-none ml-2">
                vs last month
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
