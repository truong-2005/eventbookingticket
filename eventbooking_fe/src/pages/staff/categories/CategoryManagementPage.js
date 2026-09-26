import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryApi from '../../../api/categoryApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import { ROUTES } from '../../../constants/routes';

const StaffCategoryManagementPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['staffCategories', currentPage],
    queryFn: async () => {
      const res = await categoryApi.getAllCategories({ page: currentPage, size: 10 });
      return res.data;
    },
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffCategories'] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Có lỗi xảy ra hoặc danh mục đang được sử dụng!');
    }
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Các sự kiện thuộc danh mục này có thể bị ảnh hưởng.')) {
      deleteMutation.mutate(id);
    }
  };

  const categories = data?.content || [];
  const pageable = data?.pageable || { pageNumber: currentPage };
  const totalPages = data?.totalPages || 0;

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Tên danh mục', field: 'name', className: 'font-semibold' },
    { header: 'Mô tả', field: 'description' },
    {
      header: 'Thao tác',
      render: (row) => (
        <div className="flex space-x-3">
          <Link to={`/staff/categories/${row.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Sửa</Link>
          <button onClick={() => handleDelete(row.id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 font-medium text-sm">Xóa</button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
        <Button onClick={() => navigate(ROUTES.STAFF_CATEGORY_CREATE)}>
          + Thêm danh mục
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns} 
          data={categories} 
          isLoading={isLoading} 
          emptyMessage="Không có danh mục nào" 
        />
        <Pagination 
          pageable={pageable} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
};

export default StaffCategoryManagementPage;
