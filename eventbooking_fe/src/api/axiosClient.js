import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
const getRolePrefix = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return 'admin_';
  if (path.startsWith('/staff')) return 'staff_';
  return 'client_';
};

axiosClient.interceptors.request.use(
  (config) => {
    const prefix = getRolePrefix();
    const token = localStorage.getItem(prefix + 'accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (Token Refresh) ────────────────────────────────────
let refreshPromise = null;  // dùng 1 promise duy nhất cho tất cả request bị 401 đồng thời

const getLoginPath = () => {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return '/admin/login';
  if (path.startsWith('/staff')) return '/staff/login';
  return '/login';
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const prefix = getRolePrefix();
      const storedRefreshToken = localStorage.getItem(prefix + 'refreshToken');

      if (!storedRefreshToken) {
        localStorage.removeItem(prefix + 'accessToken');
        localStorage.removeItem(prefix + 'refreshToken');
        localStorage.removeItem(prefix + 'user');
        window.dispatchEvent(new Event('auth_expired'));
        return Promise.reject(error);
      }

      // Nếu chưa có promise refresh đang chạy, tạo mới
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken: storedRefreshToken })
          .then((res) => {
            const { accessToken, refreshToken: newRefreshToken } = res.data;
            localStorage.setItem(prefix + 'accessToken', accessToken);
            if (newRefreshToken) localStorage.setItem(prefix + 'refreshToken', newRefreshToken);
            axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
            return accessToken;
          })
          .catch((refreshError) => {
            localStorage.removeItem(prefix + 'accessToken');
            localStorage.removeItem(prefix + 'refreshToken');
            localStorage.removeItem(prefix + 'user');
            window.dispatchEvent(new Event('auth_expired'));
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshPromise = null;  // reset để lần sau dùng được
          });
      }

      try {
        const newAccessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
