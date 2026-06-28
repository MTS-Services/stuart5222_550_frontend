import { calculateAge } from "./ageUtils";

export const validateForm = (formData, files = []) => {
  const newErrors = {};

  if (!formData.displayName?.trim())
    newErrors.displayName = "Display name is required";

  // Age validation - check birth month and year
  if (!formData.birthMonth || !formData.birthYear) {
    if (!formData.birthMonth) newErrors.birthMonth = "Birth month is required";
    if (!formData.birthYear) newErrors.birthYear = "Birth year is required";
  } else {
    const age = calculateAge(
      parseInt(formData.birthMonth),
      parseInt(formData.birthYear),
    );
    if (age < 18) {
      newErrors.age = "You must be at least 18 years old";
    }
  }

  if (!formData.height?.trim()) {
    newErrors.height = "Height is required (both feet and inches)";
  } else {
    const heightPattern = /^\d+'\d{1,2}"?$/;
    if (!heightPattern.test(formData.height)) {
      newErrors.height = "Please enter valid feet and inches";
    }
  }

  if (!formData.bodyType?.trim()) newErrors.bodyType = "Body type is required";
  if (!formData.county?.trim()) newErrors.county = "County is required";
  if (!formData.bio?.trim()) newErrors.bio = "Tell us about yourself";

  const hasContact =
    formData.gmail?.trim() ||
    formData.phone?.trim() ||
    formData.email?.trim();
  if (!hasContact) {
    newErrors.contact = "Please provide either email or phone number";
  }

  if (
    formData.gmail?.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.gmail)
  ) {
    newErrors.gmail = "Invalid email format";
  }

  if (files.length < 3) newErrors.images = "Minimum 3 images required";

  return newErrors;
};
