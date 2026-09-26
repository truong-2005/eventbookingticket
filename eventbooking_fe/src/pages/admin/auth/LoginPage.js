import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import LoginForm from '../../../components/auth/LoginForm';
import { ROUTES } from '../../../constants/routes';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials) => loginAsAdmin(credentials),
    onSuccess: () => {
      navigate(ROUTES.ADMIN_DASHBOARD);
    }
  });

  const handleSubmit = (formData) => {
    loginMutation.mutate(formData);
  };

  const errorMsg = loginMutation.isError 
    ? (loginMutation.error?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.') 
    : null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
          Quản trị hệ thống (Admin)
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10 border border-slate-700">
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

export default AdminLoginPage;
