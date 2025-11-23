import { Link } from "react-router-dom";
import { formatDate } from "../../../../utils/formatDate";

export const UserEditTable = ({ list, isLoading, error }) => {
  return (
    <div className="font-raleway">
      <div className="relative overflow-x-auto md:overflow-x-visible">
        {/* 🌀 Loading / Error / Empty states */}
        {isLoading ? (
          <div>
            <p colSpan="5" className="p-4 text-center">
              Loading...
            </p>
          </div>
        ) : error ? (
          <p className="py-10 text-center text-red-500">{error}</p>
        ) : list.length === 0 ? (
          <p className="py-10 text-center text-gray-500">No data found.</p>
        ) : (
          <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
            <thead className="bg-white text-lg font-normal text-black">
              <tr>
                <th className="w-1/5 whitespace-nowrap px-7 py-3 font-raleway">
                  Date
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                  Name
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Age
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Height
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Body Type
                </th>
                <th className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="text-base font-normal text-black">
              {list.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
                >
                  <td className="w-1/5 whitespace-nowrap px-7 py-3 font-raleway">
                    {formatDate(row.createdAt) || "—"}
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 font-raleway">
                    {row.user.name || "—"}
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                    {row.age || "—"} <span>years</span>
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                    {row.height || "—"}
                  </td>
                  <td className="w-1/5 whitespace-nowrap px-5 py-3 text-center font-raleway">
                    {row.bodyType || "—"}
                  </td>
                  <td className="flex items-center justify-center gap-3 whitespace-nowrap px-7 py-2.5">
                    <Link to={`/admin/user-edit/${row.id}`}>
                      <button className="whitespace-nowrap rounded-xl bg-[#F07400] px-4 py-2.5 font-raleway text-xs text-white transition hover:bg-[#d16200]">
                        See Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
