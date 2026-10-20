import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import bookingApi from '../../../api/bookingApi';
import Button from '../../../components/common/Button';
import useAuth from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/formatCurrency';
import { ROUTES } from '../../../constants/routes';

const MockVNPayPage = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const transactionParams = Object.fromEntries(searchParams.entries());
  const bookingCode = transactionParams.vnp_TxnRef;
  const amount = Number(transactionParams.vnp_Amount) / 100;
  const hasTransaction = Boolean(bookingCode && Number.isFinite(amount) && amount > 0);

  const qrValue = JSON.stringify({
    provider: 'MOCK_VNPAY',
    bookingCode,
    amount,
    currency: transactionParams.vnp_CurrCode || 'VND',
    customer: {
      id: user?.id,
      name: user?.fullName || user?.username,
      email: user?.email
    }
  });

  const returnMutation = useMutation({
    mutationFn: async (responseCode) => {
      const response = await bookingApi.generateMockPaymentReturnUrl({
        ...transactionParams,
        vnp_ResponseCode: responseCode
      });
      return response.data.returnUrl;
    },
    onSuccess: (returnUrl) => {
      window.location.assign(returnUrl);
    }
  });

  if (isAuthLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Đang tải thông tin tài khoản...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Cần đăng nhập để tiếp tục</h1>
        <p className="mt-3 text-gray-600">Giao dịch này cần được xác nhận bằng tài khoản đã đặt vé.</p>
        <Link to={ROUTES.CLIENT_LOGIN} className="inline-block mt-6 text-blue-600 hover:text-blue-700">Đăng nhập</Link>
      </div>
    );
  }

  if (!hasTransaction) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Thông tin giao dịch không hợp lệ</h1>
        <p className="mt-3 text-gray-600">Không tìm thấy mã vé hoặc số tiền thanh toán trong yêu cầu.</p>
        <Link to={ROUTES.MY_TICKETS} className="inline-block mt-6 text-blue-600 hover:text-blue-700">Về vé của tôi</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 px-6 py-5 text-white">
          <p className="text-sm font-semibold uppercase tracking-wider">VNPay Demo</p>
          <h1 className="mt-1 text-2xl font-bold">Thanh toán mô phỏng</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500">Mã vé / mã giao dịch</p>
              <p className="mt-1 font-bold text-gray-900 break-all">{bookingCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số tiền</p>
              <p className="mt-1 text-3xl font-extrabold text-blue-700">{formatCurrency(amount)}</p>
            </div>
            <div className="border-t pt-5">
              <h2 className="font-semibold text-gray-900">Thông tin người thanh toán</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Họ tên</dt><dd className="text-right font-medium text-gray-900">{user.fullName || user.username}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Email</dt><dd className="text-right font-medium text-gray-900 break-all">{user.email}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500">Tài khoản</dt><dd className="text-right font-medium text-gray-900">{user.username}</dd></div>
              </dl>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {/* Đây là giao dịch mô phỏng. QR chỉ chứa thông tin demo, không chuyển tiền thật. */}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-6 text-center">
            <QRCodeSVG value={qrValue} size={240} level="H" includeMargin />
            <p className="mt-4 font-semibold text-gray-900">QR giao dịch mô phỏng</p>
            <p className="mt-1 text-sm text-gray-500">Thông tin được tạo từ vé và tài khoản đang đăng nhập.</p>
          </div>
        </div>

        {returnMutation.isError && (
          <div className="mx-6 mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 md:mx-8">
            {returnMutation.error?.response?.data?.message || 'Không thể tạo kết quả giao dịch giả lập. Vui lòng thử lại.'}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t bg-gray-50 px-6 py-5 sm:flex-row sm:justify-end md:px-8">
          <Button variant="secondary" onClick={() => returnMutation.mutate('24')} isLoading={returnMutation.isPending}>
            Hủy giao dịch
          </Button>
          <Button variant="success" onClick={() => returnMutation.mutate('00')} isLoading={returnMutation.isPending}>
            Mô phỏng thanh toán thành công
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockVNPayPage;
