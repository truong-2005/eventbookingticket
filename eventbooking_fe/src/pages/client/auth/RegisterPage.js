import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import authApi from '../../../api/authApi';
import RegisterForm from '../../../components/auth/RegisterForm';
import { ROUTES } from '../../../constants/routes';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: (data) => authApi.register({
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      password: data.password,
      role: ['CUSTOMER'] // default role for client registration
    }),
    onSuccess: () => {
      setSuccess(true);
    }
  });

  const handleSubmit = (formData) => {
    registerMutation.mutate(formData);
  };

  const errorMsg = registerMutation.isError 
    ? (registerMutation.error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.') 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to={ROUTES.CLIENT_LOGIN} className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">Đăng ký thành công!</h3>
              <p className="mt-2 text-gray-500 mb-6">Bạn có thể đăng nhập ngay bây giờ.</p>
              <Link to={ROUTES.CLIENT_LOGIN} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Đến trang Đăng nhập
              </Link>
            </div>
          ) : (
            <RegisterForm 
              onSubmit={handleSubmit} 
              isLoading={registerMutation.isPending} 
              error={errorMsg} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
