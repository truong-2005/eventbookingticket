import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import bookingApi from '../../../api/bookingApi';
import { ROUTES } from '../../../constants/routes';

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const { data, isLoading, error } = useQuery({
    queryKey: ['paymentReturn', queryString],
    queryFn: async () => {
      const response = await bookingApi.verifyPayment(`?${queryString}`);
      return response.data;
    },
    enabled: Boolean(queryString),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  const message = error?.response?.data?.message || error?.message;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
        {isLoading ? (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <h1 className="mt-5 text-2xl font-bold text-gray-900">Đang xác nhận thanh toán</h1>
            <p className="mt-2 text-gray-600">Vui lòng đợi trong giây lát.</p>
          </>
        ) : error || !queryString ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-700">!</div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900">Thanh toán chưa thành công</h1>
            <p className="mt-2 text-gray-600">{message || 'Không có dữ liệu trả về từ giao dịch.'}</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">✓</div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900">Thanh toán thành công</h1>
            <p className="mt-2 text-gray-600">{data?.message || 'Giao dịch đã được xác nhận.'}</p>
          </>
        )}

        <Link to={ROUTES.MY_TICKETS} className="mt-7 inline-flex rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700">
          Xem vé của tôi
        </Link>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
