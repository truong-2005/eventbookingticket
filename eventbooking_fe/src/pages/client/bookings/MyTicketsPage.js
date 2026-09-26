import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import bookingApi from '../../../api/bookingApi';
import TicketCard from '../../../components/client/TicketCard';
import Pagination from '../../../components/common/Pagination';

const MyTicketsPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['myTickets', currentPage],
    queryFn: async () => {
      const res = await bookingApi.getMyBookings({ page: currentPage, size: 10 });
      return res.data;
    },
    keepPreviousData: true
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const bookings = data?.content || [];
  const pageable = data?.pageable || { pageNumber: currentPage };
  const totalPages = data?.totalPages || 0;
  
  const successMessage = location.state?.newBooking 
    ? 'Đặt vé thành công! Mã vé của bạn là: ' + location.state.newBooking.bookingCode 
    : '';

  if (error) {
    return <div className="text-center py-20 text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại sau.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Vé của tôi</h2>
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700 font-medium">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length > 0 ? (
          <>
            <div className="space-y-6 mb-8">
              {bookings.map(booking => (
                <TicketCard key={booking.id} booking={booking} />
              ))}
            </div>
            
            <Pagination 
              pageable={pageable} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Bạn chưa có vé nào</h3>
            <p>Hãy khám phá các sự kiện và đặt vé ngay.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
