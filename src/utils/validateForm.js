export const validateForm = (formData, files = []) => {
  const newErrors = {};

  if (!formData.firstName.trim()) newErrors.firstName = 'Name is required';
  // if (!formData.age.trim()) newErrors.age = 'Age is required';

  if (!formData.height.trim()) newErrors.height = 'Height is required';
  if (!formData.bodyType.trim()) newErrors.bodyType = 'Body type is required';
  if (!formData.area.trim()) newErrors.area = 'Area is required';
  if (!formData.textArea.trim()) newErrors.textArea = 'Tell us about yourself';

  if (!formData.email.trim() && !formData.number.trim()) {
    newErrors.contact = 'Please provide either email or phone number';
  }

  if (
    formData.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    newErrors.email = 'Invalid email format';
  }

  // 🧩 Now files is passed in safely
  if (files.length < 3) newErrors.images = 'Minimum 3 images required';
  return newErrors;
};
