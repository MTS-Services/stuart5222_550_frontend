import { useEffect, useState } from 'react';
import { AllTableResponsiveStyle } from '../../../../../../components/AllTableResponsiveStyle/AllTableResponsiveStyle';
import { getData } from '../../../../../../utils/axiosInstance';
import { Loading } from '../../../../../../components/ui/loading';

export const WaitListTable = () => {
  const [waitListTable, setWaitListTable] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getData(`subscriptions`);
      setWaitListTable(data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  // pagination calculation
  const totalPages = Math.ceil(waitListTable.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = waitListTable.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className='font-inter'>
      {/* Loading */}
      {loading ? (
       <Loading/>
      ) : (
        <>
          <div className='relative overflow-x-auto md:overflow-x-visible'>
            <table className='min-w-full table-fixed text-left text-xs sm:text-sm md:text-base'>
              <thead className='bg-white text-black text-lg font-normal'>
                <tr>
                  <th className='px-5 py-3 w-1/3 whitespace-nowrap'>Date</th>
                  <th className='px-5 py-3 w-1/3 whitespace-nowrap'>Name</th>
                  <th className='px-5 py-3 w-1/3 whitespace-nowrap'>Email</th>
                </tr>
              </thead>
              <tbody className='text-black text-base font-normal'>
                {currentData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-yellow-50' : 'bg-white'}
                  >
                    <td className='px-7 py-3 w-1/3 whitespace-nowrap'>
                      {row.date}
                    </td>
                    <td className='px-7 py-3 w-1/3 whitespace-nowrap'>
                      {row.name}
                    </td>
                    <td className='px-7 py-3 w-1/3 whitespace-nowrap'>
                      {row.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AllTableResponsiveStyle />

          {/* Pagination */}
          <div className='flex items-center text-gray-600 justify-between mt-8 text-base font-poppins font-normal md:gap-0 gap-2'>
            <p className='font-inter'>
              Showing {startIndex + 1} to {startIndex + currentData.length} of{' '}
              {waitListTable.length} results
            </p>
            <div className='flex gap-4 sm:gap-5 md:gap-6 lg:gap-7'>
              <button
                className={`border rounded-xl  md:px-5 px-4 md:py-2 py-1.5 ${
                  currentPage === 1 || waitListTable.length <= itemsPerPage
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-600'
                }`}
                onClick={handlePrevious}
                disabled={
                  currentPage === 1 || waitListTable.length <= itemsPerPage
                }
              >
                Previous
              </button>
              <button
                className={`border rounded-xl  md:px-5 px-4 md:py-2 py-1.5 ${
                  currentPage === totalPages ||
                  waitListTable.length <= itemsPerPage ||
                  totalPages === 0
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-600'
                }`}
                onClick={handleNext}
                disabled={
                  currentPage === totalPages ||
                  waitListTable.length <= itemsPerPage ||
                  totalPages === 0
                }
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
