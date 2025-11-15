import { calculateAge } from './ageUtils';

export const validateForm = (formData, files = []) => {
  const newErrors = {};

  if (!formData.displayName?.trim()) newErrors.displayName = 'Name is required';
  
  // Age validation - check birth month and year
  if (!formData.birthMonth || !formData.birthYear) {
    if (!formData.birthMonth) newErrors.birthMonth = 'Birth month is required';
    if (!formData.birthYear) newErrors.birthYear = 'Birth year is required';
  } else {
    // Calculate age and validate minimum age requirement
    const age = calculateAge(parseInt(formData.birthMonth), parseInt(formData.birthYear));
    if (age < 18) {
      newErrors.age = 'You must be at least 18 years old';
    }
  }
  
  // Height validation - check if height was properly formatted from feet/inches
  if (!formData.height?.trim()) {
    newErrors.height = 'Height is required (both feet and inches)';
  } else {
    // Validate height format (e.g., "5'10")
    const heightPattern = /^\d+'(\d{1,2})"?$/;
    if (!heightPattern.test(formData.height)) {
      newErrors.height = 'Please enter valid feet and inches';
    }
  }
  
  if (!formData.bodyType?.trim()) newErrors.bodyType = 'Body type is required';
  if (!formData.county?.trim()) newErrors.county = 'County is required';
  if (!formData.bio?.trim()) newErrors.bio = 'Tell us about yourself';

  if (!formData.email?.trim() && !formData.phone?.trim()) {
    newErrors.contact = 'Please provide either email or phone number';
  }

  if (
    formData.email?.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    newErrors.email = 'Invalid email format';
  }

  if (files.length < 3) newErrors.images = 'Minimum 3 images required';

  return newErrors;
};
