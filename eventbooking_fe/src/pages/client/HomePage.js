import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import eventApi from '../../api/eventApi';
import HighlightEventCard from '../../components/client/HighlightEventCard';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

const HomePage = () => {
  const navigate = useNavigate();

  const { data: upcomingEvents = [], isLoading } = useQuery({
    queryKey: ['highlightEvents'],
    queryFn: async () => {
      const res = await eventApi.getAllEvents({ size: 8, status: 'UPCOMING' });
      return res.data.content || [];
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('searchQuery')?.toString().trim();
    if (searchQuery) {
      navigate(`${ROUTES.EVENTS}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Concert background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
            Trải Nghiệm Những Sự Kiện Tuyệt Vời Nhất
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Khám phá và đặt vé cho hàng ngàn sự kiện âm nhạc, hội thảo, thể thao và nghệ thuật đang diễn ra xung quanh bạn.
          </p>
          
          <div className="mt-10 w-full max-w-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSearch} className="flex bg-white rounded-full shadow-lg overflow-hidden p-1">
              <input
                type="text"
                name="searchQuery"
                className="flex-1 min-w-0 block w-full px-5 py-3 border-transparent rounded-l-full focus:ring-0 focus:border-transparent text-gray-900 placeholder-gray-500 bg-transparent text-lg"
                placeholder="Tìm kiếm sự kiện, địa điểm, nghệ sĩ..."
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
              >
                Tìm vé ngay
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Sự kiện sắp diễn ra</h2>
            <p className="mt-2 text-gray-600">Đừng bỏ lỡ những sự kiện hot nhất sắp tới</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(ROUTES.EVENTS)}>Xem tất cả →</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {upcomingEvents.map(event => (
              <HighlightEventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có sự kiện</h3>
            <p className="mt-1 text-sm text-gray-500">Hiện chưa có sự kiện nào sắp diễn ra.</p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Bảo mật thanh toán</h3>
            <p className="text-gray-600">Giao dịch 100% an toàn với hệ thống mã hóa chuẩn quốc tế, bảo vệ quyền lợi tối đa.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nhận vé tức thì</h3>
            <p className="text-gray-600">Mã QR Code vé điện tử được gửi tự động qua email và hiển thị ngay trên tài khoản của bạn.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp thắc mắc của bạn bất kỳ lúc nào.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
