import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roleApi from '../../../api/roleApi';
import Table from '../../../components/common/Table';
import { ROUTES } from '../../../constants/routes';

const RoleListPage = () => {
  const queryClient = useQueryClient();

  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await roleApi.getAllRoles();
      return res.data || [];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => roleApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra hoặc vai trò đang được sử dụng!');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Tên Role', field: 'name', className: 'font-bold text-gray-900' },
    { header: 'Mô tả', field: 'description' },
    {
      header: 'Thao tác',
      render: (row) => (
        <div className="flex space-x-3">
          <Link to={`/admin/roles/${row.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Sửa</Link>
          <button onClick={() => handleDelete(row.id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 font-medium text-sm">Xóa</button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Phân quyền (Roles)</h1>
        <Link 
          to={ROUTES.ADMIN_ROLE_CREATE} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow text-sm font-medium"
        >
          Thêm Role
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4 border-l-4 border-yellow-400 text-yellow-800">
        Lưu ý: Các vai trò cơ bản (ADMIN, STAFF, CUSTOMER) là cố định của hệ thống. Hạn chế thay đổi để tránh lỗi phân quyền.
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns} 
          data={roles || []} 
          isLoading={isLoading} 
          emptyMessage="Không có Role nào" 
        />
      </div>
    </div>
  );
};

export default RoleListPage;
