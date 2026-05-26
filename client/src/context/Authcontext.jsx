import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = import.meta.env.VITE_API_GATEWAY;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );
      setUser(res.data.user.username);
      setUserId(res.data.user.id)
      setToken(res.data.accessToken);
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data || error.message);
      setUser(null);
      setToken(null);
      setUserId(null)
      return false;
    }
  }, []);


  useEffect(() => {
    const init = async () => {
      const success = await refreshToken();
      setLoading(false);

     
      if (success) {
        intervalRef.current = setInterval(() => {
          refreshToken();
        }, 14 * 60 * 1000);
      }
    };
    init();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refreshToken]);

  const login = (userData, accessToken,id) => {
    setUser(userData);
    setToken(accessToken);
    setUserId(id)


    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      refreshToken();
    }, 14 * 60 * 1000);
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    } finally {
      setUser(null);
      setToken(null);
      setUserId(null);
      localStorage.removeItem("activeUser");
      localStorage.removeItem("activeReciveId");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token,userId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};