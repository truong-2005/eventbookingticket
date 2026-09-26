import React from 'react';
import useAuth from '../../hooks/useAuth';

const AdminHeader = ({ toggleSidebar }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 z-10 border-b border-gray-200 shrink-0">
      <div className="flex-1 flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 mr-4 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex items-center">
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{user?.fullName || user?.username || 'Admin'}</div>
            <div className="text-xs text-gray-500">Quản trị viên</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
