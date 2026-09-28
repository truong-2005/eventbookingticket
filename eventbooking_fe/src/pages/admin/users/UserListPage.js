import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '../../../api/userApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import { ROUTES } from '../../../constants/routes';

const UserListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: async () => {
      const res = await userApi.getAllUsers({ page: currentPage, size: 10 });
      return res.data;
    },
    keepPreviousData: true
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => userApi.changeStatus(id, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra hoặc người dùng đang được sử dụng!');
    }
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleToggleStatus = (id, currentStatus) => {
    if (window.confirm(`Bạn có chắc chắn muốn ${currentStatus === 'ACTIVE' ? 'khóa' : 'mở khóa'} người dùng này?`)) {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      statusMutation.mutate({ id, newStatus });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteMutation.mutate(id);
    }
  };

  const users = data?.content || [];
  const pageable = data?.pageable || { pageNumber: currentPage };
  const totalPages = data?.totalPages || 0;

  const columns = [
    { header: 'ID', field: 'id' },
    { header: 'Tên đăng nhập', field: 'username' },
    { header: 'Họ và tên', field: 'fullName' },
    { header: 'Email', field: 'email' },
    { 
      header: 'Vai trò', 
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles?.map(role => (
            <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {role}
            </span>
          ))}
        </div>
      )
    },
    { 
      header: 'Trạng thái', 
      render: (row) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
        </span>
      ) 
    },
    {
      header: 'Thao tác',
      render: (row) => (
        <div className="flex space-x-2">
          <Link to={`/admin/users/${row.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Sửa</Link>
          <button 
            onClick={() => handleToggleStatus(row.id, row.status)}
            disabled={statusMutation.isPending}
            className={`font-medium text-sm ${row.status === 'ACTIVE' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
          >
            {row.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            disabled={deleteMutation.isPending}
            className="text-red-600 hover:text-red-900 font-medium text-sm"
          >
            Xóa
          </button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
        <Button onClick={() => navigate(ROUTES.ADMIN_USER_CREATE)}>
          + Thêm người dùng
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns} 
          data={users} 
          isLoading={isLoading} 
          emptyMessage="Không có người dùng nào" 
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

export default UserListPage;
