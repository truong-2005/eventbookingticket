import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryApi from '../../../api/categoryApi';
import CategoryForm from '../../../components/categories/CategoryForm';
import { ROUTES } from '../../../constants/routes';
import Button from '../../../components/common/Button';

const CategoryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: category, isLoading: isFetching, error: queryError } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const res = await categoryApi.getCategoryById(id);
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => categoryApi.updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffCategories'] });
      queryClient.invalidateQueries({ queryKey: ['category', id] });
      navigate(ROUTES.STAFF_CATEGORIES);
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
        <h1 className="text-2xl font-bold text-gray-900">Sửa Danh Mục</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.STAFF_CATEGORIES)}>Quay lại</Button>
      </div>
      
      {updateMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {updateMutation.error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.'}
        </div>
      )}
      
      <CategoryForm 
        initialData={category}
        onSubmit={onSubmit} 
        isLoading={updateMutation.isPending} 
        submitText="Lưu cập nhật" 
      />
    </div>
  );
};

export default CategoryEditPage;
