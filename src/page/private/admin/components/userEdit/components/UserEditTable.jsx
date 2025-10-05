// import { Link } from "react-router-dom";
// import { AllTableResponsiveStyle } from "../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";

// export const UserEditTable = () => {
//   const data = [
//     {
//       id: 1,
//       date: "Jul 5, 2025",
//       name: "Bessie Cooper",
//       age: "20 years",
//       height: "5’7",
//     },
//     {
//       id: 2,
//       date: "January 19, 2025",
//       name: "Bessie Cooper",
//       age: "20 years",
//       height: "5’7",
//     },
//     {
//       id: 3,
//       date: "April 07, 2025",
//       name: "Bessie Cooper",
//       age: "20 years",
//       height: "5’7",
//     },
//     {
//       id: 4,
//       date: "September 12, 2025",
//       name: "Bessie Cooper",
//       age: "20 years",
//       height: "5’7",
//     },
//   ];

//   return (
//     <div className="font-inter">
//       <div className="relative overflow-x-auto md:overflow-x-visible">
//         <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
//           <thead className="bg-white text-black text-lg font-normal">
//             <tr>
//               <th className="px-7 py-3 w-1/5 whitespace-nowrap">Date</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Name</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Age</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Height</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Action</th>
//             </tr>
//           </thead>
//           <tbody className="text-black text-base font-normal cursor-pointer">
//             {data.map((row, index) => (
//               <tr
//                 key={index}
//                 className={
//                   index % 2 === 0 ? "bg-yellow-50" : "bg-white cursor-pointer"
//                 }
//               >
//                 <td className="px-7 py-3 w-1/5 whitespace-nowrap">
//                   {row.date}
//                 </td>
//                 <td className="px-5 py-3 w-1/5 whitespace-nowrap">
//                   {row.name}
//                 </td>
//                 <td className="px-5 py-3 w-1/5 whitespace-nowrap">{row.age}</td>
//                 <td className="px-5 py-3 w-1/5 whitespace-nowrap">
//                   {row.height}
//                 </td>
//                 <td className="px-7 py-2.5 whitespace-nowrap flex items-center gap-3">
//                   <Link to={`/admin/edit-response`}>
//                   <button className="bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap">
//                     See Details
//                   </button></Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <AllTableResponsiveStyle />

//       {/* Pagination */}
//       <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal">
//         <p className="font-inter">Showing 1 to 4 of 4 results</p>
//         <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
//           <button className="border border-gray-600 rounded-xl px-5 py-2">
//             Previous
//           </button>
//           <button className="border border-gray-600 rounded-xl px-5 py-2">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };





// import { Link } from "react-router-dom";
// import { AllTableResponsiveStyle } from "../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
// import { useState } from "react";
// import { getData } from "../../../../../../utils/axiosInstance";

// export const UserEditTable = () => {
//   const [editData, setEditData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchHistory = async (pageNumber = 1) => {
//     try {
//       setLoading(true);
//       const data = await getData(`requestuser.json`);
//       setEditData(data.checks || []);
//     } catch (err) {
//       console.error("Failed to fetch daily checks history:", err);
//       setError("Failed to load history. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="font-inter">
//       <div className="relative overflow-x-auto md:overflow-x-visible">
//         <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
//           <thead className="bg-white text-black text-lg font-normal">
//             <tr>
//               <th className="px-7 py-3 w-1/5 whitespace-nowrap">Date</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Name</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Age</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Height</th>
//               <th className="px-5 py-3 w-1/5 whitespace-nowrap">Action</th>
//             </tr>
//           </thead>
//           <tbody className="text-black text-base font-normal cursor-pointer">
//             {data.map((row, index) => (
//               <tr
//                 key={index}
//                 className={
//                   index % 2 === 0 ? "bg-yellow-50" : "bg-white cursor-pointer"
//                 }
//               >
//                 <td className="px-7 py-3 w-1/5 whitespace-nowrap">
//                   {row.date}
//                 </td>
//                 <td className="px-5 py-3 w-1/5 whitespace-nowrap">
//                   {row.name}
//                 </td>
//                 <td className="px-5 py-3 w-1/5 whitespace-nowrap">{row.age}</td>
//                 <td className="px-5 py-3 w-1/5 whitespace-nowrap">
//                   {row.height}
//                 </td>
//                 <td className="px-7 py-2.5 whitespace-nowrap flex items-center gap-3">
//                   <Link to={`/admin/edit-response`}>
//                     <button className="bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap">
//                       See Details
//                     </button>
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <AllTableResponsiveStyle />

//       {/* Pagination */}
//       <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal">
//         <p className="font-inter">Showing 1 to 4 of 4 results</p>
//         <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
//           <button className="border border-gray-600 rounded-xl px-5 py-2">
//             Previous
//           </button>
//           <button className="border border-gray-600 rounded-xl px-5 py-2">
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };































import { Link } from "react-router-dom";
import { AllTableResponsiveStyle } from "../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle";
import { useState, useEffect } from "react";
import { getData } from "../../../../../../utils/axiosInstance";

export const UserEditTable = () => {
  const [editData, setEditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchHistory();
  }, []);

const fetchHistory = async () => {
  try {
    setLoading(true);
    setError(null);
    const data = await getData(`useredit.json`);
    setEditData(data || []); // <-- use the array directly
  } catch (err) {
    console.error("Failed to fetch daily checks history:", err);
    setError("Failed to load history. Please try again later.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="font-inter">
      <div className="relative overflow-x-auto md:overflow-x-visible">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">{error}</p>
        ) : editData.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No data found.</p>
        ) : (
          <table className="min-w-full table-fixed text-left text-xs sm:text-sm md:text-base">
            <thead className="bg-white text-black text-lg font-normal">
              <tr>
                <th className="px-7 py-3 w-1/5 whitespace-nowrap">Date</th>
                <th className="px-5 py-3 w-1/5 whitespace-nowrap">Name</th>
                <th className="px-5 py-3 w-1/5 whitespace-nowrap">Age</th>
                <th className="px-5 py-3 w-1/5 whitespace-nowrap">Height</th>
                <th className="px-5 py-3 w-1/5 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-black text-base font-normal cursor-pointer">
              {editData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0 ? "bg-yellow-50" : "bg-white cursor-pointer"
                  }
                >
                  <td className="px-7 py-3 w-1/5 whitespace-nowrap">{row.date}</td>
                  <td className="px-5 py-3 w-1/5 whitespace-nowrap">{row.name}</td>
                  <td className="px-5 py-3 w-1/5 whitespace-nowrap">{row.age}</td>
                  <td className="px-5 py-3 w-1/5 whitespace-nowrap">{row.height}</td>
                  <td className="px-7 py-2.5 whitespace-nowrap flex items-center gap-3">
                    <Link to={`/admin/edit-response`}>
                      <button className="bg-[#F07400] text-white text-xs py-2.5 px-4 rounded-xl whitespace-nowrap">
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

      <AllTableResponsiveStyle />

      {/* Pagination */}
      <div className="flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal">
        <p className="font-inter">
          Showing 1 to {editData.length} of {editData.length} results
        </p>
        <div className="flex gap-4 sm:gap-5 md:gap-6 lg:gap-7">
          <button className="border border-gray-600 rounded-xl px-5 py-2">Previous</button>
          <button className="border border-gray-600 rounded-xl px-5 py-2">Next</button>
        </div>
      </div>
    </div>
  );
};
