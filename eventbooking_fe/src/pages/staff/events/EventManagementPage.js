import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventApi from '../../../api/eventApi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Pagination from '../../../components/common/Pagination';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';

const StaffEventListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['staffEvents', currentPage],
    queryFn: async () => {
      const res = await eventApi.getAllEvents({ page: currentPage, size: 10 });
      return res.data;
    },
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffEvents'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra hoặc sự kiện đã có người đặt vé!');
    }
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.')) {
      deleteMutation.mutate(id);
    }
  };

  const events = data?.content || [];
  const pageable = data?.pageable || { pageNumber: currentPage };
  const totalPages = data?.totalPages || 0;

  const columns = [
    { header: 'ID', field: 'id' },
    { 
      header: 'Tên sự kiện', 
      render: (row) => <div className="font-medium text-gray-900">{row.title}</div>
    },
    { header: 'Danh mục', field: 'categoryName' },
    { 
      header: 'Thời gian', 
      render: (row) => <span>{formatDate(row.eventDate)}</span>
    },
    { 
      header: 'Trạng thái', 
      render: (row) => {
        const bg = row.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' : row.status === 'ONGOING' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bg}`}>{row.status}</span>;
      }
    },
    {
      header: 'Thao tác',
      render: (row) => (
        <div className="flex space-x-3">
          <Link to={`/staff/events/${row.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Sửa</Link>
          <button onClick={() => handleDelete(row.id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 font-medium text-sm">Xóa</button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Sự kiện</h1>
        <Button onClick={() => navigate(ROUTES.STAFF_EVENT_CREATE)}>
          + Tạo sự kiện mới
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns} 
          data={events} 
          isLoading={isLoading} 
          emptyMessage="Không có sự kiện nào" 
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

export default StaffEventListPage;
