// Travel Mode Utility Functions

/**
 * Check if travel mode should be displayed
 * Returns true if travel mode should be shown, false otherwise
 */
export const shouldShowTravelMode = (profile) => {
  // Check if profile exists
  if (!profile) return false;
  
  // Check if all travel mode fields are empty
  const { startDate, endDate, location } = profile;
  
  // If any required travel field is missing or empty, don't show travel mode
  if (!startDate || !endDate || !location || 
      startDate.trim() === '' || endDate.trim() === '' || location.trim() === '') {
    return false;
  }
  
  // Check if travel dates have passed
  try {
    const currentDate = new Date();
    const travelEndDate = new Date(endDate);
    
    // If end date has passed, don't show travel mode
    if (travelEndDate < currentDate) {
      return false;
    }
    
    // All checks passed - show travel mode
    return true;
  } catch (error) {
    // If date parsing fails, don't show travel mode
    console.error('Error parsing travel dates:', error);
    return false;
  }
};

/**
 * Check if travel dates are valid
 */
export const areTravelDatesValid = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    // Check if dates are valid and end date is after start date
    return start instanceof Date && end instanceof Date && 
           !isNaN(start.getTime()) && !isNaN(end.getTime()) &&
           end >= start && end >= now;
  } catch (error) {
    return false;
  }
};

/**
 * Format date for display
 */
export const formatTravelDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString; // Return original string if parsing fails
  }
};