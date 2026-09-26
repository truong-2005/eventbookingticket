import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-white tracking-wider">EventBooking</span>
            <p className="mt-4 text-gray-400 text-sm">
              Hệ thống đặt vé sự kiện chuyên nghiệp, nhanh chóng và bảo mật. Trải nghiệm ngay những sự kiện hàng đầu.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Khám phá</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to={ROUTES.HOME} className="text-base text-gray-400 hover:text-white">Trang chủ</Link>
              </li>
              <li>
                <Link to={ROUTES.EVENTS} className="text-base text-gray-400 hover:text-white">Sự kiện sắp tới</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Dành cho đối tác</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to={ROUTES.STAFF_LOGIN} className="text-base text-gray-400 hover:text-white">Đăng nhập nhân viên</Link>
              </li>
              <li>
                <Link to={ROUTES.ADMIN_LOGIN} className="text-base text-gray-400 hover:text-white">Quản trị viên</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} EventBooking. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
