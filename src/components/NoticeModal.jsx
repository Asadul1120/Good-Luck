import { useEffect, useState } from "react";
import axios from "../src/api/axios";

const NoticeModal = ({ open, onClose }) => {
  const [notice, setNotice] = useState(null);

  // 🔁 load notice from backend
  useEffect(() => {
    if (!open) return;

    const fetchNotice = async () => {
      try {
        const res = await axios.get("/notice");

        // admin OFF করলে modal দেখাবে না
        if (!res.data || res.data.active === false) {
          onClose();
          return;
        }

        setNotice(res.data);
      } catch (err) {
        console.error("Failed to load notice");
        onClose();
      }
    };

    fetchNotice();
  }, [open, onClose]);

  // ⏱️ auto close
  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      onClose();
    }, 90000); // 90s

    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-red-500 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-white text-base sm:text-lg font-semibold">
            {notice.title || "Important Notice"}
          </h2>
        </div>

        {/* Body (HTML from admin) */}
        <div
          className="px-4 py-4 sm:px-6 sm:py-5 text-gray-800 space-y-3 text-sm sm:text-base leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: notice.messageHtml || "<p>No notice</p>",
          }}
        />

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
