import { createContext, useContext, useEffect, useState } from "react";
import axios from "../src/api/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 App load হলে server থেকে user check
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

  // 🔐 LOGIN (username + password)
  const login = async (username, password) => {
    const res = await axios.post("/users/login", {
      username,
      password,
    });

    setUser(res.data.user);
    return res.data;
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
