import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import LoginForm from '../../../components/auth/LoginForm';
import { ROUTES } from '../../../constants/routes';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginAsCustomer } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials) => loginAsCustomer(credentials),
    onSuccess: () => {
      navigate(ROUTES.HOME);
    }
  });

  const handleSubmit = (formData) => {
    loginMutation.mutate(formData);
  };

  const errorMsg = loginMutation.isError 
    ? (loginMutation.error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.') 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập khách hàng
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to={ROUTES.CLIENT_REGISTER} className="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm 
            onSubmit={handleSubmit} 
            isLoading={loginMutation.isPending} 
            error={errorMsg}
            title=""
          />
          <div className="mt-4 text-center text-sm">
            <Link to={ROUTES.CLIENT_FORGOT_PASSWORD} className="font-medium text-blue-600 hover:text-blue-500">
              Quên mật khẩu?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
