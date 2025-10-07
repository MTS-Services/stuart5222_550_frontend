import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { getData } from "../../../../../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { Loading } from "../../../../../../components/ui/loading";

export const Notification = () => {
  const [waitListTable, setWaitListTable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getData(`notifications`);
      setWaitListTable(data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  console.log(waitListTable);

  return (
    <div className="text-black p-8">
      {/* Loading */}
      {loading ? (
        <Loading/>
      ) : (
        <>
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
            {waitListTable.length > 0 ? (
              waitListTable.map((notification) => (
                <div className="bg-white border-b border-gray-200 last:border-b-0 py-4 px-6">
                  <div className="font-inter flex items-center gap-2">
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={notification.image || "/img/page/admin/img1.png"}
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
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No notifications found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
