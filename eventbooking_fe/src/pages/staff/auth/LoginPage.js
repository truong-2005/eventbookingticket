import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import LoginForm from '../../../components/auth/LoginForm';
import { ROUTES } from '../../../constants/routes';

const StaffLoginPage = () => {
  const navigate = useNavigate();
  const { loginAsStaff } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials) => loginAsStaff(credentials),
    onSuccess: () => {
      navigate(ROUTES.STAFF_DASHBOARD);
    }
  });

  const handleSubmit = (formData) => {
    loginMutation.mutate(formData);
  };

  const errorMsg = loginMutation.isError 
    ? (loginMutation.error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.') 
    : null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập Nhân viên (Staff)
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-blue-500">
          <LoginForm 
            onSubmit={handleSubmit} 
            isLoading={loginMutation.isPending} 
            error={errorMsg}
            title=""
          />
        </div>
      </div>
    </div>
  );
};

export default StaffLoginPage;
