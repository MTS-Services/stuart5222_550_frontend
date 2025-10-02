import { AllTableResponsiveStyle } from "../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";

export const WaitListTable = () => {
  const data = [
    {
      date: "Jul 5, 2025",
      name: "Bessie Cooper",
      email: "bill.sanders@example.com",
    },
    { date: "Jul 6, 2025", name: "John Doe", email: "john.doe@example.com" },
    {
      date: "Jul 7, 2025",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
    {
      date: "Jul 8, 2025",
      name: "Michael Brown",
      email: "michael.brown@example.com",
    },
  ];

  return (
    <div className="font-inter">
      <div className="relative overflow-x-auto md:overflow-x-visible">
        <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
          <thead className="bg-white text-black text-lg font-normal">
            <tr>
              <th className="px-5 py-3 w-1/3">Date</th>
              <th className="px-5 py-3 w-1/3">Name</th>
              <th className="px-5 py-3 w-1/3">Email</th>
            </tr>
          </thead>
          <tbody className="text-black text-base font-normal">
            {data.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
              >
                <td className="px-7 py-3 w-1/3">{row.date}</td>
                <td className="px-7 py-3 w-1/3">{row.name}</td>
                <td className="px-7 py-3 w-1/3">{row.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AllTableResponsiveStyle />

      <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal">
        <p className="font-inter ">Showing 1 to 4 of 4 results</p>
        <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
          <button className="border border-gray-600 rounded-xl px-5 py-2">
            Previous
          </button>
          <button className="border border-gray-600 rounded-xl px-5 py-2">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
