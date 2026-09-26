import React from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import StatusBadge from '../common/StatusBadge';
import { buildPath, ROUTES } from '../../constants/routes';

const BookingCard = ({ booking, onCancel, cancelling }) => {
  const canCancel = booking.status === 'CONFIRMED';

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
            {booking.eventTitle}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            #{booking.bookingCode}
          </p>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Ngày sự kiện</p>
          <p className="text-gray-700 font-medium">{formatDateTime(booking.eventDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Số vé</p>
          <p className="text-gray-700 font-medium">{booking.quantity} vé</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Tổng tiền</p>
          <p className="text-primary-600 font-bold">{formatCurrency(booking.totalAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Đặt lúc</p>
          <p className="text-gray-700">{formatDateTime(booking.createdAt)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <Link
          to={buildPath(ROUTES.BOOKING_DETAIL, { id: booking.id })}
          className="btn-secondary btn-sm flex-1 text-center"
        >
          Xem chi tiết
        </Link>
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            disabled={cancelling}
            className="btn-danger btn-sm"
          >
            {cancelling ? '...' : 'Hủy vé'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
