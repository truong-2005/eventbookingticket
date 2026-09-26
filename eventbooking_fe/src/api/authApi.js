import axiosClient from './axiosClient';

const authApi = {
  // ─── Customer ──────────────────────────────────────────────────────────────
  login: (data) => axiosClient.post('/api/login', data),
  register: (data) => axiosClient.post('/api/register', data),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  adminLogin: (data) => axiosClient.post('/api/auth/admin/login', data),
  adminRegister: (data) => axiosClient.post('/api/auth/admin/register', data),

  // ─── Staff ─────────────────────────────────────────────────────────────────
  staffLogin: (data) => axiosClient.post('/api/auth/staff/login', data),
  staffRegister: (data) => axiosClient.post('/api/auth/staff/register', data),

  // ─── Common ────────────────────────────────────────────────────────────────
  logout: (data) => axiosClient.post('/api/auth/logout', data),
  refreshToken: (data) => axiosClient.post('/api/auth/refresh-token', data),
  forgotPassword: (data) => axiosClient.post('/api/auth/forgot-password', data),
  resetPassword: (data) => axiosClient.post('/api/auth/reset-password', data),
};

export default authApi;
