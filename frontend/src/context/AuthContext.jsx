import { createContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => JSON.parse(localStorage.getItem("auth") || "null"));

  useEffect(() => {
    if (auth) localStorage.setItem("auth", JSON.stringify(auth));
    else localStorage.removeItem("auth");
  }, [auth]);

  const setSession = (data) => {
    setAuth({ user: data.user, token: data.token, redirectUrl: data.redirectUrl });
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return setSession(data);
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    return setSession(data);
  };

  const updateUser = (user) => setAuth((prev) => (prev ? { ...prev, user } : prev));

  const logout = () => setAuth(null);

  const value = useMemo(
    () => ({ auth, login, verifyOtp, updateUser, logout, isAuthenticated: Boolean(auth?.token) }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
