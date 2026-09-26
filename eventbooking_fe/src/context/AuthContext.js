import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import authApi from '../api/authApi';
import userApi from '../api/userApi';

export const AuthContext = createContext(null);

const getRolePrefix = (pathname) => {
  if (pathname.startsWith('/admin')) return 'admin_';
  if (pathname.startsWith('/staff')) return 'staff_';
  return 'client_';
};

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const rolePrefix = getRolePrefix(location.pathname);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo từ localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(rolePrefix + 'accessToken');
      const savedUser = localStorage.getItem(rolePrefix + 'user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          // Fetch fresh user info
          const res = await userApi.getMyInfo();
          const freshUser = res.data;
          setUser(freshUser);
          localStorage.setItem(rolePrefix + 'user', JSON.stringify(freshUser));
        } catch {
          localStorage.removeItem(rolePrefix + 'accessToken');
          localStorage.removeItem(rolePrefix + 'refreshToken');
          localStorage.removeItem(rolePrefix + 'user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initAuth();

    const handleAuthExpired = () => {
      localStorage.removeItem(rolePrefix + 'accessToken');
      localStorage.removeItem(rolePrefix + 'refreshToken');
      localStorage.removeItem(rolePrefix + 'user');
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth_expired', handleAuthExpired);
    return () => window.removeEventListener('auth_expired', handleAuthExpired);
  }, [rolePrefix]);

  const saveAuthData = useCallback((data) => {
    const { accessToken, refreshToken, user: userData } = data;
    localStorage.setItem(rolePrefix + 'accessToken', accessToken);
    if (refreshToken) localStorage.setItem(rolePrefix + 'refreshToken', refreshToken);
    localStorage.setItem(rolePrefix + 'user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, [rolePrefix]);

  // ─── Login Methods ──────────────────────────────────────────────────────────
  const loginAsCustomer = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    saveAuthData(res.data);
    return res.data;
  }, [saveAuthData]);

  const loginAsAdmin = useCallback(async (credentials) => {
    const res = await authApi.adminLogin(credentials);
    saveAuthData(res.data);
    return res.data;
  }, [saveAuthData]);

  const loginAsStaff = useCallback(async (credentials) => {
    const res = await authApi.staffLogin(credentials);
    saveAuthData(res.data);
    return res.data;
  }, [saveAuthData]);

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(rolePrefix + 'refreshToken');
    if (refreshToken) {
      try {
        await authApi.logout({ refreshToken });
      } catch {
        // Bỏ qua lỗi khi logout
      }
    }
    localStorage.removeItem(rolePrefix + 'accessToken');
    localStorage.removeItem(rolePrefix + 'refreshToken');
    localStorage.removeItem(rolePrefix + 'user');
    setUser(null);
    setIsAuthenticated(false);
  }, [rolePrefix]);

  // ─── Update user info ────────────────────────────────────────────────────────
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(rolePrefix + 'user', JSON.stringify(updatedUser));
  }, [rolePrefix]);

  // ─── Role checks ────────────────────────────────────────────────────────────
  const hasRole = useCallback(
    (role) => user?.roles?.includes(role) ?? false,
    [user]
  );

  const isAdmin = hasRole('ADMIN');
  const isStaff = hasRole('STAFF');
  const isCustomer = hasRole('CUSTOMER');

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    isStaff,
    isCustomer,
    hasRole,
    loginAsCustomer,
    loginAsAdmin,
    loginAsStaff,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
