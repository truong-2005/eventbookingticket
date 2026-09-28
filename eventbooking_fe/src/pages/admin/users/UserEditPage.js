import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '../../../api/userApi';
import UserForm from '../../../components/users/UserForm';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isFetching, error: queryError } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const res = await userApi.getUserById(id);
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      await userApi.updateUser(id, {
        email: payload.email,
        fullName: payload.fullName,
        phone: payload.phone
      });
      
      // If a new password is provided, reset it
      if (payload.newPassword && payload.newPassword.trim() !== '') {
        await userApi.adminResetPassword(id, payload.newPassword);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate(ROUTES.ADMIN_USERS);
    }
  });

  const onSubmit = (formData) => {
    const payload = {
      ...formData,
      phone: formData.phone === '' ? null : formData.phone,
    };
    updateMutation.mutate(payload);
  };

  if (isFetching) return <div className="text-center p-10">Đang tải...</div>;
  if (queryError) return <div className="text-center p-10 text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sửa thông tin người dùng</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_USERS)}>Quay lại</Button>
      </div>
      
      {updateMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {updateMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.'}
        </div>
      )}
      
      <UserForm 
        initialData={user}
        onSubmit={onSubmit} 
        isLoading={updateMutation.isPending} 
        isEdit={true}
        submitText="Lưu thay đổi" 
      />
    </div>
  );
};

export default UserEditPage;
