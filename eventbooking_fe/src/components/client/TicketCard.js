import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const TicketCard = ({ booking, onCancel, cancelling = false }) => {
  const isCancelled = booking.status === 'CANCELLED';
  const isPaymentFailed = booking.paymentStatus === 'FAILED';
  const isPaid = !isCancelled && !isPaymentFailed && (booking.paymentStatus === 'PAID' || booking.paymentMethod === 'CASH');
  const isPending = !isCancelled && !isPaymentFailed && booking.paymentStatus === 'PENDING' && booking.paymentMethod !== 'CASH';
  const isRefunded = booking.paymentStatus === 'REFUNDED';
  const eventStartTime = booking.eventDate || booking.eventStartTime;
  const canCancel = booking.status === 'CONFIRMED' && !isPaymentFailed
    && (!eventStartTime || new Date(eventStartTime) > new Date());

  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex flex-col md:flex-row">
      {/* Event Info */}
      <div className="md:w-2/3 p-5 md:border-r border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm font-medium text-gray-500">Mã vé: <span className="text-gray-900 font-bold">{booking.bookingCode}</span></span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isPaid ? 'bg-green-100 text-green-800' :
            isPending ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {isCancelled ? 'ĐÃ HỦY' : isPaymentFailed ? 'THANH TOÁN THẤT BẠI' : isPaid ? 'ĐÃ THANH TOÁN' : isPending ? 'CHỜ THANH TOÁN' : 'CHƯA THANH TOÁN'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {booking.eventTitle}
        </h3>
        
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(booking.eventDate || booking.eventStartTime)}
          </div>
          <div className="flex items-start">
            <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{booking.eventLocation}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Info */}
      <div className="md:w-1/3 bg-gray-50 p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Số lượng:</span>
            <span className="font-semibold text-gray-900">{booking.quantity} vé</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Tổng tiền:</span>
            <span className="text-lg font-bold text-blue-600">{formatCurrency(booking.totalAmount ?? booking.totalPrice)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Ngày đặt:</span>
            <span className="text-sm font-medium text-gray-900">{formatDate(booking.createdAt || booking.bookingDate)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <Link to={`/events/${booking.eventId}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Xem lại sự kiện &rarr;
          </Link>
          {canCancel && onCancel && (
            <button
              type="button"
              onClick={() => onCancel(booking)}
              disabled={cancelling}
              className="mt-3 block w-full rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelling ? 'Đang hủy...' : 'Hủy vé'}
            </button>
          )}
          {isCancelled && isRefunded && (
            <p className="mt-2 text-xs text-blue-700">Hoàn tiền đã được ghi nhận (mô phỏng).</p>
          )}
        </div>
      </div>
      {/* QR Code */}
      {booking.bookingCode && !isCancelled && !isPaymentFailed && (
        <div className="hidden md:flex flex-col justify-center items-center p-5 border-l border-gray-100 bg-white min-w-[150px]">
          <QRCodeSVG value={booking.bookingCode} size={100} />
          <span className="text-xs text-gray-400 mt-2 text-center">Quét mã<br/>để check-in</span>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
