import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleApi from '../../../api/roleApi';
import RoleForm from '../../../components/roles/RoleForm';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';

const RoleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: role, isLoading: isFetching, error: queryError } = useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const res = await roleApi.getRoleById(id);
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => roleApi.updateRole(id, { ...payload, name: payload.name.toUpperCase().trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', id] });
      navigate(ROUTES.ADMIN_ROLES);
    }
  });

  const onSubmit = (formData) => {
    updateMutation.mutate(formData);
  };

  if (isFetching) return <div className="text-center p-10">Đang tải...</div>;
  if (queryError) return <div className="text-center p-10 text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sửa Vai Trò</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_ROLES)}>Quay lại</Button>
      </div>
      
      {updateMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {updateMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.'}
        </div>
      )}
      
      <RoleForm 
        initialData={role}
        onSubmit={onSubmit} 
        isLoading={updateMutation.isPending} 
        submitText="Lưu thay đổi" 
      />
    </div>
  );
};

export default RoleEditPage;
