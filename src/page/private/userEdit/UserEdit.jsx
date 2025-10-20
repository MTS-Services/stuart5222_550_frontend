import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserEditTable } from './components/UserEditTable';
import { getUserProfiles } from '../../../services/profilesService';

const UserEdit = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API response data
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({});

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('DRAFT');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, selectedStatus]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserProfiles(selectedStatus, currentPage, itemsPerPage);
      
      if (response) {
        setProfiles(response.profiles || []);
        setPagination(response.pagination || {});
        setStats(response.stats || {});
        setFilters(response.filters || {});
        
        toast.success(`Loaded ${response.profiles?.length || 0} profiles`, {
          position: 'top-right',
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      setError('Failed to load profiles. Please try again later.');
      toast.error('Failed to load profiles', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleInputChange = (value) => {
    setSearchInput(value);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
    toast.info(`Filtering by status: ${status}`, {
      position: 'top-right',
      autoClose: 2000,
    });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  // Filter profiles by search query (client-side)
  const filteredProfiles = profiles.filter((profile) => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    return (
      profile.user?.name?.toLowerCase().includes(searchTerm) ||
      profile.user?.email?.toLowerCase().includes(searchTerm) ||
      profile.bio?.toLowerCase().includes(searchTerm)
    );
  });

  // Pagination calculations
  const totalPages = pagination.totalPages || 1;
  const startIndex = ((pagination.currentPage || 1) - 1) * itemsPerPage;
  const currentData = filteredProfiles; // Use filtered profiles for display

  const handlePrevious = () => {
    if (pagination.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (pagination.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Highlight matched text in search results
  const highlightText = (text) => {
    if (!searchInput || !text) return text;

    const regex = new RegExp(`(${searchInput})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className='bg-yellow-200 font-semibold'>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className='text-black md:p-8 p-6'>
      <div className='flex flex-col gap-6 mb-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl text-[#002244] font-semibold font-poppins'>
            All User Profiles
          </h2>
          
          {/* Stats Display */}
          {stats && Object.keys(stats).length > 0 && (
            <div className='flex items-center gap-4 text-sm'>
              <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full'>
                Total: {stats.total || 0}
              </span>
              <span className='bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full'>
                Draft: {stats.draft || 0}
              </span>
              <span className='bg-orange-100 text-orange-800 px-3 py-1 rounded-full'>
                Pending: {stats.pending || 0}
              </span>
              <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full'>
                Approved: {stats.approved || 0}
              </span>
              <span className='bg-red-100 text-red-800 px-3 py-1 rounded-full'>
                Rejected: {stats.rejected || 0}
              </span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-4'>
          {/* Status Filter */}
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-gray-700'>Filter by Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className='border border-[#F07400] px-3 py-2 rounded-lg focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] outline-none'
            >
              {filters.availableStatuses?.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Search Field */}
          <div className='relative w-full max-w-md'>
          <input
            type='text'
            placeholder='Search user name'
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSearchQuery(searchInput);
            }}
            className='w-full border border-[#F07400] h-12 shadow p-4 rounded-full
                       dark:text-gray-800 dark:border-white dark:bg-border-200
                       focus:border-[#F07400] focus:ring-1 focus:ring-[#eb9d54] outline-none'
          />

          <button
            type='button'
            className='absolute top-3.5 right-3'
            onClick={() => {
              if (searchQuery) handleClearSearch();
              else setSearchQuery(searchInput);
            }}
          >
            {searchQuery ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-[#F07400]'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              // Search icon
              <svg
                className='text-[#F07400] h-5 w-5 fill-current dark:text-[#fa8e28]'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 56.966 56.966'
              >
                <path
                  d='M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23
                          s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,
                          2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z 
                          M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z'
                />
              </svg>
            )}
          </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <UserEditTable
        loading={loading}
        error={error}
        currentData={currentData}
        highlightText={highlightText}
        startIndex={startIndex}
        filteredData={filteredProfiles}
        handlePrevious={handlePrevious}
        currentPage={pagination.currentPage || 1}
        handleNext={handleNext}
        totalPages={totalPages}
        pagination={pagination}
        stats={stats}
      />
    </div>
  );
};

export default UserEdit;
