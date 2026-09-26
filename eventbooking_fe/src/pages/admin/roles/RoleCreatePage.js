import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import roleApi from '../../../api/roleApi';
import RoleForm from '../../../components/roles/RoleForm';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';

const RoleCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload) => roleApi.createRole({ ...payload, name: payload.name.toUpperCase().trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      navigate(ROUTES.ADMIN_ROLES);
    }
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm Vai Trò (Role)</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_ROLES)}>Quay lại</Button>
      </div>
      
      {createMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {createMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi tạo Role.'}
        </div>
      )}
      
      <RoleForm 
        onSubmit={onSubmit} 
        isLoading={createMutation.isPending} 
        submitText="Tạo Role" 
      />
    </div>
  );
};

export default RoleCreatePage;
