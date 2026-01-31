import { useEffect } from "react";

const NoticeModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 90000);

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-red-500 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-white text-base sm:text-lg font-semibold">
            Important Notice
          </h2>
        </div>

        {/* Body */}
        <div className="px-4 py-4 sm:px-6 sm:py-5 text-gray-800 space-y-3 text-sm sm:text-base leading-relaxed">
          <p>আসসালামু আলাইকুম,</p>

          <p>সম্মানিত গ্রাহকদের জানানো যাচ্ছে,</p>

          <p className="font-semibold text-base sm:text-lg">
            All Special Slip — 1600/-
          </p>

          <p>Dhaka All Normal Slip — 100/-</p>
          <p>Dhaka All Normal Night — 100/-</p>

          <p className="text-gray-600 text-xs sm:text-sm">
            All slip delivered within 5 minutes
          </p>

          <p className="font-medium">Only Link 320/-</p>

          <hr className="my-3" />

          <p>ধন্যবাদ।</p>
        </div>

        {/* Footer */}
        <div className="bg-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded text-sm font-medium transition"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scaleIn {
            from {
              transform: scale(0.96);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.25s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default NoticeModal;
