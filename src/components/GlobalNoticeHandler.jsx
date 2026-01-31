import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NoticeModal from "../components/NoticeModal";

const GlobalNoticeHandler = () => {
  const { user, isAuthenticated, features } = useAuth();
  const [showNotice, setShowNotice] = useState(false);

  const timerRef = useRef(null);
  const countRef = useRef(0);

  const MAX_SHOW = 2; // 👈 মোট ২ বার
  const INTERVAL = 5000; // 👈 5 seconds

  useEffect(() => {
    // ❌ notice দেখাবে না যদি:
    // - login না থাকে
    // - admin user
    // - admin panel থেকে notice OFF
    if (
      !isAuthenticated ||
      !user?._id ||
      user.role === "admin" ||
      features?.NOTICE === false
    ) {
      return;
    }

    // fresh login হলে reset
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

    // 🔁 first notice (login এর 5s পর)
    startTimer();

    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      countRef.current = 0;
    };
  }, [isAuthenticated, user, features]); // 👈 features dependency জরুরি

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
