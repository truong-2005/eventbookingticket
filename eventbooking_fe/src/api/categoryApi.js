import axiosClient from './axiosClient';

const categoryApi = {
  getAllCategories: (params) => {
    return axiosClient.get('/api/categories', { params });
  },

  getCategoryById: (id) => {
    return axiosClient.get(`/api/categories/${id}`);
  },

  createCategory: (data) => {
    return axiosClient.post('/api/categories', data);
  },

  updateCategory: (id, data) => {
    return axiosClient.put(`/api/categories/${id}`, data);
  },

  deleteCategory: (id) => {
    return axiosClient.delete(`/api/categories/${id}`);
  }
};

export default categoryApi;
