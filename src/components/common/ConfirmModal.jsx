import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

/**
 * Shared confirmation dialog for destructive admin actions.
 * Portaled to document.body so the backdrop covers the full viewport
 * (including sticky admin header / sidebar).
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Please confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  loading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const confirmClass =
    confirmVariant === "success"
      ? "bg-green-600 hover:bg-green-700"
      : confirmVariant === "warning"
        ? "bg-orange-500 hover:bg-orange-600"
        : "bg-red-600 hover:bg-red-700";

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={loading ? undefined : onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 disabled:opacity-50"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h2
          id="confirm-modal-title"
          className="mb-3 pr-8 font-raleway text-xl font-semibold text-[#002244]"
        >
          {title}
        </h2>

        {message && (
          <p className="mb-6 font-raleway text-sm leading-relaxed text-gray-600">
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-4 py-2.5 font-raleway text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 font-raleway text-sm font-semibold text-white transition disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ConfirmModal;
