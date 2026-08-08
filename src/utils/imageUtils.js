/**
 * Image Utility Functions for client-side image processing
 */
import heic2any from "heic2any";

/**
 * Returns true if the file looks like HEIC/HEIF (by mime or extension).
 * Windows often sends an empty mime type for these files.
 */
export const isHeicFile = (file) => {
  if (!file) return false;
  const mime = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  return (
    mime === "image/heic" ||
    mime === "image/heif" ||
    mime.includes("heic") ||
    mime.includes("heif") ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
};

/**
 * Converts HEIC/HEIF to a JPEG File so browsers can preview and upload reliably.
 * Returns the original file when conversion is not needed.
 */
export const convertHeicToJpeg = async (file) => {
  if (!file || !isHeicFile(file)) {
    return file;
  }

  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });

  const blob = Array.isArray(result) ? result[0] : result;
  const jpegName = (file.name || "photo").replace(/\.(heic|heif)$/i, ".jpg");

  return new File([blob], jpegName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

/**
 * Compresses an image file using Canvas API.
 * Automatically converts HEIC/HEIF to JPEG first.
 *
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width of the output image (default: 1920)
 * @param {number} maxHeight - Maximum height of the output image (default: 1920)
 * @param {number} quality - JPEG quality from 0 to 1 (default: 0.8)
 * @returns {Promise<File>} - The compressed file
 */
export const compressImage = async (
  file,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.8,
) => {
  let inputFile = file;

  try {
    inputFile = await convertHeicToJpeg(file);
  } catch (error) {
    console.error("HEIC conversion failed before compress:", error);
    throw new Error(
      `Failed to convert HEIC/HEIF image "${file.name}". Please use JPG or PNG.`,
    );
  }

  return new Promise((resolve, reject) => {
    if (
      !inputFile.type.startsWith("image/") &&
      !isHeicFile(inputFile)
    ) {
      resolve(inputFile);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(inputFile);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

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

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty - compression failed"));
              return;
            }

            const compressedFile = new File(
              [blob],
              inputFile.name.replace(/\.[^/.]+$/, "") + ".jpg",
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

      img.onerror = () => {
        reject(new Error("Failed to load image for compression"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
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
