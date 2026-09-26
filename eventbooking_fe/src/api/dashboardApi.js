import axiosClient from './axiosClient';

const dashboardApi = {
  // Lấy tổng quan thống kê: tổng user, tổng vé bán ra, tổng doanh thu...
  getSummary: () => {
    return axiosClient.get('/api/dashboard/summary');
  },
  
  // Lấy doanh thu theo thời gian (ví dụ 6 tháng gần nhất)
  getRevenue: () => {
    return axiosClient.get('/api/dashboard/revenue');
  },
  
  // Lấy top sự kiện nổi bật (nhiều vé nhất)
  getTopEvents: () => {
    return axiosClient.get('/api/dashboard/top-events');
  }
};

export default dashboardApi;
