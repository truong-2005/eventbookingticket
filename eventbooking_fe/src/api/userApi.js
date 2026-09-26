import axiosClient from './axiosClient';

const userApi = {
  // Lấy tất cả user
  getAllUsers: (params) => {
    return axiosClient.get('/api/users', { params });
  },

  // Lấy chi tiết user
  getUserById: (id) => {
    return axiosClient.get(`/api/users/${id}`);
  },

  // Lấy thông tin cá nhân
  getMyInfo: () => {
    return axiosClient.get('/api/users/me');
  },

  // Tạo user (Admin)
  createUser: (data) => {
    return axiosClient.post('/api/users', data);
  },

  // Cập nhật user (bởi Admin)
  updateUser: (id, data) => {
    return axiosClient.put(`/api/users/${id}`, data);
  },

  // Cập nhật user (chính mình)
  updateMe: (id, data) => {
    return axiosClient.put(`/api/users/${id}`, data);
  },

  // Admin đổi mật khẩu cho user
  adminResetPassword: (id, newPassword) => {
    return axiosClient.put(`/api/users/${id}/reset-password`, { newPassword });
  },

  // Khóa / Mở khóa user (Admin)
  changeStatus: (id, status) => {
    return axiosClient.patch(`/api/users/${id}/status`, null, { params: { status } });
  },

  // Xóa user
  deleteUser: (id) => {
    return axiosClient.delete(`/api/users/${id}`);
  },
};

export default userApi;
