import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const notification = [
  {
    id: 1,
    image: "/img/page/admin/img1.png",
    title: "Brian Griffin wants to collaborate",
    description:
      "Hey Peter, we’ve got a new side project opportunity for you. Herbert from Children’s Program is looking for people like you.",
    date: "5 days ago",
  },
  {
    id: 2,
    image: "/img/page/admin/img2.png",
    title: "Brian Griffin wants to collaborate",
    description:
      "Hey Peter, we’ve got a new side project opportunity for you. Herbert from Children’s Program is looking for people like you.",
    date: "3 days ago",
  },
  {
    id: 3,
    image: "/img/page/admin/img3.png",
    title: "Brian Griffin wants to collaborate",
    description:
      "Hey Peter, we’ve got a new side project opportunity for you. Herbert from Children’s Program is looking for people like you.",
    date: "9 days ago",
  },
];

export const Notification = () => {
  return (
    <div className="text-black p-8">
      <div className="flex justify-between mb-8">
        <h2 className="text-2xl text-[#002244] font-semibold font-poppins">
          Notifications
        </h2>
        <div className="flex items-center gap-3 font-inter font-normal text-lg">
          Mark All Read
          <IoCheckmarkDoneOutline className="w-6 h-6" />
        </div>
      </div>
      <div className="rounded-sm">
        {notification.map((notification) => (
          <Link to={`/admin/notification-user-details`}>
            <div
              key={notification.id}
              className="bg-white border-b border-gray-200 last:border-b-0 py-4 px-6"
            >
              <div className="font-inter flex items-center gap-2">
                <img
                  className="w-[40px] h-[40px] rounded-full"
                  src={notification.image}
                  alt=""
                />
                <div className="">
                  <h2 className="text-base font-semibold text-[#535369]">
                    {notification.title}
                  </h2>
                  <p className="text-[#666C7E] font-normal text-[15px]">
                    {notification.description}
                  </p>

                  <p className="text-xs font-normal text-[#666C7E]">
                    {notification.date}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
