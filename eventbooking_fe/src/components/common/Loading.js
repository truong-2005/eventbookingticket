import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`inline-block rounded-full border-current border-t-transparent animate-spin text-primary-600 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Đang tải..."
    />
  );
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-gray-500 text-sm animate-pulse">Đang tải dữ liệu...</p>
    </div>
  </div>
);

export default Spinner;
