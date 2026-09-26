import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import bookingApi from '../../../api/bookingApi';
import Button from '../../../components/common/Button';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await bookingApi.getBookingById(id);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center p-10">Đang tải chi tiết đơn đặt vé...</div>;
  if (error || !booking) return <div className="text-center p-10 text-red-500">Đơn đặt vé không tồn tại hoặc có lỗi xảy ra!</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Chi tiết Booking #{booking.bookingCode}</h1>
        <Button onClick={() => navigate(-1)} variant="secondary">Quay lại</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin Khách hàng</h3>
          <ul className="space-y-3">
            <li><span className="font-medium text-gray-600">Họ và tên:</span> {booking.customerName}</li>
            <li><span className="font-medium text-gray-600">Email:</span> {booking.customerEmail}</li>
            <li><span className="font-medium text-gray-600">SĐT:</span> {booking.customerPhone || 'N/A'}</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Thông tin Sự kiện</h3>
          <ul className="space-y-3">
            <li><span className="font-medium text-gray-600">Sự kiện:</span> {booking.eventTitle}</li>
            <li><span className="font-medium text-gray-600">Thời gian diễn ra:</span> {formatDate(booking.eventStartTime)}</li>
            <li><span className="font-medium text-gray-600">Địa điểm:</span> {booking.eventLocation}</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-100 flex flex-col md:flex-row justify-between items-center">
        <div className="space-y-2 mb-4 md:mb-0">
          <p><span className="font-medium text-gray-600">Số lượng vé:</span> {booking.quantity}</p>
          <p><span className="font-medium text-gray-600">Tổng tiền:</span> <span className="font-bold text-xl text-indigo-600">{formatCurrency(booking.totalPrice || booking.totalAmount)}</span></p>
          <p><span className="font-medium text-gray-600">Ngày đặt:</span> {formatDate(booking.bookingDate || booking.createdAt)}</p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-600 mb-2">Trạng thái hiện tại</p>
          <span className={`px-4 py-2 inline-flex text-sm leading-5 font-bold rounded-full ${
            booking.status === 'CONFIRMED' || booking.status === 'PAID' ? 'bg-green-100 text-green-800' : 
            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {booking.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
