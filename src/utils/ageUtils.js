// Utility functions for age calculation
export const generateMonths = () => {
  return [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
};

export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // Generate years from 1924 (100 years old) to current year minus 18 (minimum age)
  for (let year = currentYear - 18; year >= currentYear - 100; year--) {
    years.push({ value: year, label: year.toString() });
  }
  
  return years;
};

export const calculateAge = (birthMonth, birthYear) => {
  if (!birthMonth || !birthYear) return null;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = today.getDate();
  
  let age = currentYear - birthYear;
  
  // Check if the 28th of their birth month has passed this year
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < 28)) {
    age--;
  }
  
  return age;
};

// Extract birth month and year from existing age (for backward compatibility)
export const estimateBirthFromAge = (age) => {
  if (!age) return { birthMonth: null, birthYear: null };
  
  const currentYear = new Date().getFullYear();
  const estimatedBirthYear = currentYear - age;
  
  // Default to January as a placeholder since we can't know the exact month
  return {
    birthMonth: 1,
    birthYear: estimatedBirthYear
  };
};

// Format birth data for display
export const formatBirthData = (birthMonth, birthYear) => {
  if (!birthMonth || !birthYear) return '';
  
  const months = generateMonths();
  const monthName = months.find(m => m.value === parseInt(birthMonth))?.label || '';
  
  return `${monthName} ${birthYear}`;
};