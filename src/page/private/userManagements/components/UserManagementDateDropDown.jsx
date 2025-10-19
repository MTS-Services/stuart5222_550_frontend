import { useEffect, useRef, useState } from 'react';
import { FiCalendar, FiChevronDown } from 'react-icons/fi';

export const UserManagementDateDropDown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('Last 30 days');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    'Today',
    'Yesterday',
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
  ];

  return (
    <div ref={dropdownRef} className='relative inline-block my-3'>
      {/* Button */}
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center justify-between gap-2 border border-gray-300 bg-white text-gray-700 text-sm rounded-lg px-3 py-2 shadow-sm hover:bg-gray-50 focus:outline-none'
      >
        <FiCalendar className='text-gray-500' size={16} />
        <span>{selected}</span>
        <FiChevronDown
          className={`text-gray-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          size={16}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className='absolute mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
          <ul className='py-1 text-sm text-gray-700'>
            {options.map((option) => (
              <li key={option}>
                <button
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    selected === option ? 'bg-gray-100 font-medium' : ''
                  }`}
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
