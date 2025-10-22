export const validateForm = (formData, files = []) => {
  const newErrors = {};

  if (!formData.displayName?.trim()) newErrors.displayName = 'Name is required';
  if (!formData.height?.trim()) newErrors.height = 'Height is required';
  if (!formData.bodyType?.trim()) newErrors.bodyType = 'Body type is required';
  if (!formData.area?.trim()) newErrors.area = 'Area is required';
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
