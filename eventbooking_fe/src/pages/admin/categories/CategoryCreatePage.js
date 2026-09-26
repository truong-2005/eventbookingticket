import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import categoryApi from '../../../api/categoryApi';
import CategoryForm from '../../../components/categories/CategoryForm';
import { ROUTES } from '../../../constants/routes';
import Button from '../../../components/common/Button';

const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload) => categoryApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate(ROUTES.ADMIN_CATEGORIES);
    }
  });

  const onSubmit = (formData) => {
    createMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm Danh Mục Mới</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_CATEGORIES)}>Quay lại</Button>
      </div>
      
      {createMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {createMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục.'}
        </div>
      )}
      
      <CategoryForm 
        onSubmit={onSubmit} 
        isLoading={createMutation.isPending} 
        submitText="Tạo danh mục" 
      />
    </div>
  );
};

export default CategoryCreatePage;
