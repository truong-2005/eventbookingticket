import React from 'react';
import useAuth from '../../hooks/useAuth';

const StaffHeader = () => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 border-b border-gray-200">
      <div className="flex-1"></div>
      <div className="flex items-center">
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user?.fullName || user?.username || 'Staff'}</div>
            <div className="text-xs text-gray-500">Nhân viên</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'S'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
