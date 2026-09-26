import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to={ROUTES.HOME} className="text-2xl font-bold text-blue-600">EventBooking</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to={ROUTES.HOME} className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 font-medium">Trang chủ</Link>
              <Link to={ROUTES.EVENTS} className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 font-medium">Sự kiện</Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
                  <span className="text-gray-700 font-medium mr-2">Chào, {user?.fullName || user?.username}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block">
                  <div className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
                    <Link to={ROUTES.PROFILE} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ cá nhân</Link>
                    <Link to={ROUTES.MY_TICKETS} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Vé của tôi</Link>
                    {user?.roles?.includes('ADMIN') && (
                      <Link to={ROUTES.ADMIN_DASHBOARD} className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">Quản trị Admin</Link>
                    )}
                    {user?.roles?.includes('STAFF') && (
                      <Link to={ROUTES.STAFF_DASHBOARD} className="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100">Quản lý Staff</Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Đăng xuất</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to={ROUTES.CLIENT_LOGIN} className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Đăng nhập</Link>
                <Link to={ROUTES.CLIENT_REGISTER} className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">Đăng ký</Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link to={ROUTES.HOME} className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50">Trang chủ</Link>
            <Link to={ROUTES.EVENTS} className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50">Sự kiện</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                      {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.fullName}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link to={ROUTES.PROFILE} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Hồ sơ cá nhân</Link>
                  <Link to={ROUTES.MY_TICKETS} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Vé của tôi</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-gray-100">Đăng xuất</button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1">
                <Link to={ROUTES.CLIENT_LOGIN} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Đăng nhập</Link>
                <Link to={ROUTES.CLIENT_REGISTER} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
