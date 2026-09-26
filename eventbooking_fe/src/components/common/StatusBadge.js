import React from 'react';

const STATUS_CONFIG = {
  // Booking status
  CONFIRMED: { label: 'Đã xác nhận', class: 'badge-green' },
  CANCELLED: { label: 'Đã hủy', class: 'badge-red' },

  // Event status
  UPCOMING: { label: 'Sắp diễn ra', class: 'badge-blue' },
  ONGOING: { label: 'Đang diễn ra', class: 'badge-green' },
  COMPLETED: { label: 'Đã kết thúc', class: 'badge-gray' },

  // User status
  ACTIVE: { label: 'Hoạt động', class: 'badge-green' },
  INACTIVE: { label: 'Khóa', class: 'badge-red' },
};

const StatusBadge = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || { label: status, class: 'badge-gray' };

  return (
    <span className={`${config.class} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
