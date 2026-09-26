import axiosClient from './axiosClient';

const roleApi = {
  // Lấy danh sách role
  getAllRoles: () => {
    return axiosClient.get('/api/roles');
  },

  getRoleById: (id) => {
    return axiosClient.get(`/api/roles/${id}`);
  },

  createRole: (data) => {
    return axiosClient.post('/api/roles', data);
  },

  updateRole: (id, data) => {
    return axiosClient.put(`/api/roles/${id}`, data);
  },

  deleteRole: (id) => {
    return axiosClient.delete(`/api/roles/${id}`);
  }
};

export default roleApi;
