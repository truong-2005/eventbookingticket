import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '../../../api/userApi';
import UserForm from '../../../components/users/UserForm';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';

const UserCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload) => userApi.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate(ROUTES.ADMIN_USERS);
    }
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm người dùng mới</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_USERS)}>Quay lại</Button>
      </div>
      
      {createMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {createMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi tạo người dùng.'}
        </div>
      )}
      
      <UserForm 
        onSubmit={onSubmit} 
        isLoading={createMutation.isPending} 
        submitText="Tạo người dùng" 
      />
    </div>
  );
};

export default UserCreatePage;
