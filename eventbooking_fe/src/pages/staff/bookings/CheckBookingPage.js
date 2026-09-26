import React, { useState } from 'react';
import bookingApi from '../../../api/bookingApi';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { formatDate } from '../../../utils/formatDate';

const CheckBookingPage = () => {
  const [bookingCode, setBookingCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;
    
    setIsLoading(true);
    setError('');
    setBooking(null);
    
    try {
      // Giả sử có API tìm booking theo code
      // const res = await bookingApi.getBookingByCode(bookingCode);
      
      // Hoặc gọi lấy danh sách lọc theo mã code
      const res = await bookingApi.getAllBookings({ code: bookingCode, size: 1 });
      if (res.data.content && res.data.content.length > 0) {
        setBooking(res.data.content[0]);
      } else {
        setError('Không tìm thấy đơn đặt vé nào với mã này!');
      }
    } catch (err) {
      setError('Lỗi khi tra cứu mã vé.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (booking.status !== 'PAID') {
      alert('Vé này chưa được thanh toán hoặc đã hủy, không thể check-in!');
      return;
    }
    
    setIsLoading(true);
    try {
      // Gọi API cập nhật trạng thái CHECKED_IN
      await bookingApi.updateBookingStatus(booking.id, 'CHECKED_IN');
      alert('Check-in thành công!');
      // Reset form
      setBooking(null);
      setBookingCode('');
    } catch (err) {
      alert('Có lỗi khi check-in!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Check-in Khách Tham Gia</h1>
        
        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <Input 
              id="bookingCode" 
              placeholder="Nhập mã vé (Booking Code)..." 
              value={bookingCode} 
              onChange={(e) => setBookingCode(e.target.value)} 
              required
            />
          </div>
          <div className="pt-1">
            <Button type="submit" isLoading={isLoading}>Tra cứu vé</Button>
          </div>
        </form>
        
        {error && <div className="mt-4 bg-red-50 text-red-500 p-3 rounded">{error}</div>}
      </div>

      {booking && (
        <div className="bg-white p-8 rounded-lg shadow border-t-4 border-indigo-500 animate-slide-up">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chi tiết Mã Vé: {booking.bookingCode}</h2>
              <p className="text-gray-500 mt-1">Sự kiện: <span className="font-semibold text-gray-800">{booking.eventTitle}</span></p>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
              booking.status === 'PAID' ? 'bg-green-100 text-green-800' : 
              booking.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-800' :
              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-500">Người đặt:</p>
              <p className="font-semibold text-gray-900">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày đặt:</p>
              <p className="font-semibold text-gray-900">{formatDate(booking.bookingDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số lượng vé:</p>
              <p className="font-semibold text-gray-900">{booking.quantity} vé</p>
            </div>
          </div>

          <div className="flex justify-center border-t pt-6">
            <button 
              onClick={handleCheckIn}
              disabled={isLoading || booking.status === 'CHECKED_IN'}
              className={`px-8 py-3 rounded-md text-white font-bold text-lg shadow-md transition-transform transform hover:-translate-y-0.5 ${
                booking.status === 'CHECKED_IN' ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {booking.status === 'CHECKED_IN' ? 'ĐÃ CHECK-IN' : 'XÁC NHẬN CHECK-IN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckBookingPage;
