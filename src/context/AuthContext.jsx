// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "../src/api/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔁 App load হলে server থেকে logged-in user fetch
//   const fetchUser = async () => {
//     try {
//       const res = await axios.get("/users/me");
//       setUser(res.data.user);
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   // 🔐 LOGIN (FIXED)
//   const login = async (username, password) => {
//     // 1️⃣ Login (JWT cookie set হয়)
//     await axios.post("/users/login", {
//       username,
//       password,
//     });

//     // 2️⃣ Immediately full user fetch (image, balance, role সহ)
//     const res = await axios.get("/users/me");

//     setUser(res.data.user);
//     return res.data.user;
//   };

//   // 🚪 LOGOUT
//   const logout = async () => {
//     await axios.post("/users/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthenticated: !!user,
//         login,
//         logout,
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import axios from "../src/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    }
  };

  // 🔁 Fetch feature flags
  const fetchFeatures = async () => {
    try {
      const res = await axios.get("/features");
      setFeatures({
        NORMAL_SLIP: res.data.normalSlip,
        NIGHT_SLIP: res.data.nightSlip,
        SPECIAL_SLIP: res.data.specialSlip,
        SLIP_PAYMENT: res.data.slipPayment,
        NOTICE: res.data.noticeEnabled,
        MARQUEE: res.data.marqueeEnabled,

      });
    } catch (error) {
      setFeatures(null);
    }
  };

  // 🔁 App load
  useEffect(() => {
    const init = async () => {
      const user = await fetchUser();

      await fetchFeatures();
      setLoading(false);
    };
    init();
  }, []);

  // 🔐 LOGIN
  const login = async (username, password) => {
    await axios.post("/users/login", { username, password });

    const res = await axios.get("/users/me");
    setUser(res.data.user);

    // 🔄 reload features after login (important)
    await fetchFeatures();

    return res.data.user;
  };

  // 🚪 LOGOUT
  const logout = async () => {
    if (user?._id) {
      // 🔥 notice count reset (IMPORTANT)
      sessionStorage.removeItem(`notice_count_${user._id}`);
    }
    await axios.post("/users/logout");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        features,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
        refreshFeatures: fetchFeatures, // 🔥 admin toggle পরে এটা call করবে
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
