import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NoticeModal from "../components/NoticeModal";

const GlobalNoticeHandler = () => {
  const { user, isAuthenticated } = useAuth();
  const [showNotice, setShowNotice] = useState(false);

  const timerRef = useRef(null);
  const countRef = useRef(0);

  const MAX_SHOW = 2;      // 👈 মোট ২ বার
  const INTERVAL = 5000;  // 👈 5 seconds

  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    // reset on fresh login
    countRef.current = 0;

    const startTimer = () => {
      if (timerRef.current) return;

      timerRef.current = setTimeout(() => {
        if (countRef.current >= MAX_SHOW) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          return;
        }

        countRef.current += 1;
        setShowNotice(true);
        timerRef.current = null;
      }, INTERVAL);
    };

    // 🔁 start first timer after login
    startTimer();

    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      countRef.current = 0;
    };
  }, [isAuthenticated, user?._id]);

  const handleClose = () => {
    setShowNotice(false);

    // 🔁 close করার 5s পরে আবার দেখাবে (limit থাকলে)
    if (countRef.current < MAX_SHOW) {
      timerRef.current = setTimeout(() => {
        countRef.current += 1;
        setShowNotice(true);
        timerRef.current = null;
      }, INTERVAL);
    }
  };

  return <NoticeModal open={showNotice} onClose={handleClose} />;
};

export default GlobalNoticeHandler;
