import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authApi from '../../../api/authApi';
import ResetPasswordForm from '../../../components/auth/ResetPasswordForm';
import { ROUTES } from '../../../constants/routes';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: (data) => authApi.resetPassword({ token, newPassword: data.password }),
    onSuccess: () => {
      setSuccess(true);
    }
  });

  const handleSubmit = (formData) => {
    resetPasswordMutation.mutate(formData);
  };

  const errorMsg = resetPasswordMutation.isError 
    ? (resetPasswordMutation.error?.response?.data?.message || 'Không thể đổi mật khẩu. Token có thể đã hết hạn.') 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đặt lại mật khẩu
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!token ? (
            <div className="text-center text-red-500 py-4">
              <p>Link khôi phục không hợp lệ hoặc đã thiếu token.</p>
              <Link to={ROUTES.CLIENT_LOGIN} className="mt-4 block font-medium text-blue-600 hover:text-blue-500">
                Về Đăng nhập
              </Link>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Mật khẩu đã được thay đổi!</h3>
              <p className="mt-2 text-gray-500 mb-6">Bạn có thể sử dụng mật khẩu mới để đăng nhập.</p>
              <Link to={ROUTES.CLIENT_LOGIN} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <ResetPasswordForm 
              onSubmit={handleSubmit}
              isLoading={resetPasswordMutation.isPending}
              error={errorMsg}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
