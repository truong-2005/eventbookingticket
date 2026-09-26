import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import axiosClient from '../../../api/axiosClient';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';

const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: {
      fullName: user?.fullName || '',
      phone: user?.phone || ''
    }
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => axiosClient.put(`/api/users/${user.id}`, payload),
    onSuccess: (_, variables) => {
      // Update local storage user info
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        storedUser.fullName = variables.fullName;
        storedUser.phone = variables.phone;
        localStorage.setItem('user', JSON.stringify(storedUser));
      }
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const onSubmit = (formData) => {
    updateMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Hồ sơ cá nhân</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Thông tin cơ bản</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {updateMutation.isSuccess && <div className="mb-4 bg-green-50 text-green-600 p-3 rounded">Cập nhật thông tin thành công!</div>}
          {updateMutation.isError && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded">{updateMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.'}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500 font-medium">
                {user?.username}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                {user?.email}
              </div>
            </div>

            <Input 
              id="fullName" 
              label="Họ và tên" 
              {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
              error={errors.fullName?.message}
            />
            
            <Input 
              id="phone" 
              label="Số điện thoại" 
              {...register('phone')}
            />
            
            <div>
              <Button type="submit" isLoading={updateMutation.isPending}>Lưu thay đổi</Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Bảo mật</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500 mb-4">Bạn nên cập nhật mật khẩu thường xuyên để bảo vệ tài khoản.</p>
          <Link 
            to={ROUTES.CHANGE_PASSWORD} 
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Đổi mật khẩu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
