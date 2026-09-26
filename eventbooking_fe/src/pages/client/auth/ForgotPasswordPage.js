import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authApi from '../../../api/authApi';
import ForgotPasswordForm from '../../../components/auth/ForgotPasswordForm';
import { ROUTES } from '../../../constants/routes';

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);

  const forgotPasswordMutation = useMutation({
    mutationFn: (data) => authApi.forgotPassword(data),
    onSuccess: () => {
      setSuccess(true);
    }
  });

  const handleSubmit = (formData) => {
    forgotPasswordMutation.mutate(formData);
  };

  const errorMsg = forgotPasswordMutation.isError 
    ? (forgotPasswordMutation.error?.response?.data?.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.') 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Quên mật khẩu?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập email của bạn và chúng tôi sẽ gửi link khôi phục.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Kiểm tra email của bạn</h3>
              <p className="mt-2 text-gray-500 mb-6">Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu vào hòm thư của bạn.</p>
              <Link to={ROUTES.CLIENT_LOGIN} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Quay lại Đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <ForgotPasswordForm 
                onSubmit={handleSubmit} 
                isLoading={forgotPasswordMutation.isPending} 
                error={errorMsg} 
              />
              <div className="mt-6 text-center text-sm">
                <Link to={ROUTES.CLIENT_LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
