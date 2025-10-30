import React from "react";
import { FaTimes } from "react-icons/fa";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  full: "w-full max-w-full",
};

const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`w-full rounded-2xl bg-white shadow-xl ${sizeClasses[size]} relative p-6`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>

        {/* Modal Title */}
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

        {/* Modal Content */}
        <div className="mb-4">{children}</div>

        {/* Modal Footer */}
        {footer && <div className="flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

export default CustomModal;
