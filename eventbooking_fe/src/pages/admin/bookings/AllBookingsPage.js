import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bookingApi from '../../../api/bookingApi';
import Table from '../../../components/common/Table';
import Pagination from '../../../components/common/Pagination';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

const BookingListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const currentPage = parseInt(searchParams.get('page') || '0', 10);

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', currentPage],
    queryFn: async () => {
      const res = await bookingApi.getAllBookings({ page: currentPage, size: 10 });
      return res.data;
    },
    keepPreviousData: true
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => bookingApi.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => bookingApi.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => {
      alert('Có lỗi xảy ra khi xóa!');
    }
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleChangeStatus = (id, currentStatus) => {
    const newStatus = window.prompt("Nhập trạng thái mới (CONFIRMED, CANCELLED):", currentStatus);
    if (newStatus && ['CONFIRMED', 'CANCELLED'].includes(newStatus.toUpperCase())) {
      statusMutation.mutate({ id, status: newStatus.toUpperCase() });
    } else if (newStatus) {
      alert("Trạng thái không hợp lệ! Chỉ chấp nhận: CONFIRMED, CANCELLED");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa booking này?')) {
      deleteMutation.mutate(id);
    }
  };

  const bookings = data?.content || [];
  const pageable = data?.pageable || { pageNumber: currentPage };
  const totalPages = data?.totalPages || 0;

  const columns = [
    { header: 'Mã vé', field: 'bookingCode', className: 'font-semibold' },
    { header: 'Khách hàng', field: 'customerName' },
    { header: 'Sự kiện', field: 'eventTitle' },
    { header: 'Số lượng', field: 'quantity' },
    { 
      header: 'Tổng tiền', 
      render: (row) => <span className="font-medium text-blue-600">{formatCurrency(row.totalAmount)}</span>
    },
    { 
      header: 'Trạng thái', 
      render: (row) => {
        const bg = row.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bg}`}>{row.status}</span>;
      }
    },
    { 
      header: 'Ngày đặt', 
      render: (row) => <span>{formatDate(row.createdAt)}</span>
    },
    {
      header: 'Thao tác',
      render: (row) => (
        <div className="flex space-x-3">
          <Link to={`/admin/bookings/${row.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Chi tiết</Link>
          <button 
            onClick={() => handleChangeStatus(row.id, row.status)} 
            disabled={statusMutation.isPending}
            className="text-yellow-600 hover:text-yellow-900 font-medium text-sm"
          >
            Đổi TT
          </button>
          <button onClick={() => handleDelete(row.id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-900 font-medium text-sm">Xóa</button>
        </div>
      )
    }
  ];

  if (error) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đặt vé (Bookings)</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table 
          columns={columns} 
          data={bookings} 
          isLoading={isLoading} 
          emptyMessage="Không có đơn đặt vé nào" 
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

export default BookingListPage;
