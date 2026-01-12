import { createContext, useContext, useEffect, useState } from "react";
import axios from "../src/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 App load হলে server থেকে logged-in user fetch
  const fetchUser = async () => {
    try {
      const res = await axios.get("/users/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔐 LOGIN (FIXED)
  const login = async (username, password) => {
    // 1️⃣ Login (JWT cookie set হয়)
    await axios.post("/users/login", {
      username,
      password,
    });

    // 2️⃣ Immediately full user fetch (image, balance, role সহ)
    const res = await axios.get("/users/me");

    setUser(res.data.user);
    return res.data.user;
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await axios.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
