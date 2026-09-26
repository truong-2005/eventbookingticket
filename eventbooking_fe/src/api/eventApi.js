import axiosClient from './axiosClient';

const eventApi = {
  // Lấy danh sách sự kiện có phân trang & filter
  getAllEvents: (params) => {
    // params có thể gồm: page, size, title, categoryId, status
    return axiosClient.get('/api/events', { params });
  },
  
  // Lấy sự kiện theo trạng thái (chủ yếu dùng cho trang chủ: UPCOMING)
  getEventsByStatus: (status, params) => {
    return axiosClient.get(`/api/events/status/${status}`, { params });
  },

  // Xem chi tiết sự kiện
  getEventById: (id) => {
    return axiosClient.get(`/api/events/${id}`);
  },

  // ─── Dành cho Admin / Staff ──────────────────────────────────────────────────
  createEvent: (data) => {
    return axiosClient.post('/api/events', data);
  },

  updateEvent: (id, data) => {
    return axiosClient.put(`/api/events/${id}`, data);
  },

  deleteEvent: (id) => {
    return axiosClient.delete(`/api/events/${id}`);
  }
};

export default eventApi;
