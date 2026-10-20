import axiosClient from './axiosClient';

const bookingApi = {
  // Đặt vé sự kiện
  createBooking: (data) => {
    return axiosClient.post('/api/bookings', data);
  },

  // Vé của tôi (Customer)
  getMyBookings: (params) => {
    return axiosClient.get('/api/bookings/my', { params });
  },

  cancelMyBooking: (id) => {
    return axiosClient.patch(`/api/bookings/${id}/cancel`);
  },

  // Xác minh thanh toán VNPay
  verifyPayment: (queryString) => {
    return axiosClient.get(`/api/payments/vnpay-return${queryString}`);
  },

  generateMockPaymentReturnUrl: (params) => {
    return axiosClient.post('/api/mock-vnpay/generate-return-url', params);
  },

  // Tra cứu vé theo mã
  getBookingByCode: (code) => {
    return axiosClient.get(`/api/bookings/code/${code}`);
  },

  // Chi tiết vé
  getBookingById: (id) => {
    return axiosClient.get(`/api/bookings/${id}`);
  },

  // ─── Dành cho Admin / Staff ──────────────────────────────────────────────────
  // Tất cả vé
  getAllBookings: (params) => {
    return axiosClient.get('/api/bookings', { params });
  },

  // Vé của một sự kiện
  getBookingsByEvent: (eventId, params) => {
    return axiosClient.get(`/api/bookings/event/${eventId}`, { params });
  },

  // Đổi trạng thái vé
  updateBookingStatus: (id, status) => {
    return axiosClient.patch(`/api/bookings/${id}/status`, null, { params: { status } });
  },

  // Xóa vé (Chỉ Admin)
  deleteBooking: (id) => {
    return axiosClient.delete(`/api/bookings/${id}`);
  }
};

export default bookingApi;
