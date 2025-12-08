/**
 * Image Utility Functions for client-side image processing
 */

/**
 * Compresses an image file using Canvas API.
 * Automatically converts HEIC/HEIF to JPEG on iOS Safari.
 *
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width of the output image (default: 1920)
 * @param {number} maxHeight - Maximum height of the output image (default: 1920)
 * @param {number} quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns {Promise<File>} - The compressed file
 */
export const compressImage = (
  file,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.8,
) => {
  return new Promise((resolve, reject) => {
    // If it's not an image, return original
    if (
      !file.type.startsWith("image/") &&
      !file.type.includes("heic") &&
      !file.type.includes("heif")
    ) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas and draw image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Optional: Improve image quality with smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty - compression failed"));
              return;
            }

            // Create a new File object with compressed image
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, "") + ".jpg",
              {
                type: "image/jpeg",
                lastModified: Date.now(),
              },
            );

            resolve(compressedFile);
          },
          "image/jpeg",
          quality,
        );
      };

      img.onerror = (error) => {
        reject(new Error("Failed to load image: " + error.message));
      };
    };

    reader.onerror = (error) => {
      reject(new Error("Failed to read file: " + error.message));
    };
  });
};

/**
 * Validates if a file is a valid image
 * @param {File} file - The file to validate
 * @returns {boolean} - True if valid image
 */
export const isValidImageFile = (file) => {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  const validExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".heic",
    ".heif",
  ];

  return (
    validTypes.includes(file.type) ||
    validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)) ||
    (!file.type &&
      validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)))
  );
};

/**
 * Gets human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
