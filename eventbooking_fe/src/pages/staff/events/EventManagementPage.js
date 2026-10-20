import React, { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StaffToastContext } from '../../../layouts/StaffLayout';
import eventApi from '../../../api/eventApi';
import categoryApi from '../../../api/categoryApi';
import StatusBadge from '../../../components/common/StatusBadge';
import Pagination from '../../../components/common/Pagination';
import SearchBar from '../../../components/common/SearchBar';
import { ConfirmModal } from '../../../components/common/Modal';
import { PageSpinner } from '../../../components/common/Loading';
import { formatDateTime } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';
import { ROUTES, buildPath } from '../../../constants/routes';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'ONGOING', label: 'Đang diễn ra' },
  { value: 'COMPLETED', label: 'Đã kết thúc' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const StaffEventManagementPage = () => {
  const toast = useContext(StaffToastContext);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number.parseInt(searchParams.get('page') || '0', 10);
  const size = Number.parseInt(searchParams.get('size') || '10', 10);
  const keyword = searchParams.get('keyword') || '';
  const status = searchParams.get('status') || '';
  const categoryId = searchParams.get('categoryId') || '';

  const [searchValue, setSearchValue] = useState(keyword);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const { data: categories = [] } = useQuery({
    queryKey: ['categoriesAll'],
    queryFn: async () => {
      const response = await categoryApi.getAllCategories({ page: 0, size: 100 });
      return response.data?.content || [];
    },
  });

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['staffEvents', page, size, keyword, status, categoryId],
    queryFn: async () => {
      const response = await eventApi.getAllEvents({
        page,
        size,
        ...(keyword && { title: keyword }),
        ...(status && { status }),
        ...(categoryId && { categoryId: Number(categoryId) }),
      });
      return response.data;
    },
    refetchInterval: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventApi.deleteEvent(id),
    onSuccess: () => {
      toast?.success('Đã xóa sự kiện.');
      setDeleteModal({ open: false, id: null, title: '' });
      queryClient.invalidateQueries({ queryKey: ['staffEvents'] });
    },
    onError: (requestError) => {
      toast?.error(requestError.response?.data?.message || 'Không thể xóa sự kiện.');
      setDeleteModal({ open: false, id: null, title: '' });
    },
  });

  const updateQueryParam = (key, value, resetPage = true) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    if (resetPage) nextParams.set('page', '0');
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setSearchValue('');
    setSearchParams({ page: '0', size: String(size) });
  };

  const events = eventsData?.content || [];
  const totalPages = eventsData?.totalPages || 0;
  const totalElements = eventsData?.totalElements || 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">Quản lý sự kiện</h1>
          <p className="mt-1 text-sm text-gray-500">{totalElements} sự kiện</p>
        </div>
        <Link to={ROUTES.STAFF_EVENT_CREATE} className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo sự kiện
        </Link>
      </div>

      <div className="card flex flex-wrap gap-3 p-4">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSearch={(value) => updateQueryParam('keyword', value.trim())}
          placeholder="Tìm tên sự kiện..."
          className="min-w-[220px]"
        />
        <select
          value={status}
          onChange={(event) => updateQueryParam('status', event.target.value)}
          className="form-select w-auto"
          aria-label="Lọc theo trạng thái"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={categoryId}
          onChange={(event) => updateQueryParam('categoryId', event.target.value)}
          className="form-select w-auto"
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          value={size}
          onChange={(event) => updateQueryParam('size', event.target.value)}
          className="form-select w-auto"
          aria-label="Số sự kiện mỗi trang"
        >
          {[10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>{pageSize} / trang</option>
          ))}
        </select>
        {(keyword || status || categoryId) && (
          <button type="button" onClick={clearFilters} className="btn-ghost btn-sm">
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="card">
        {error ? (
          <div className="p-10 text-center text-red-500">
            {error.response?.data?.message || 'Không tải được danh sách sự kiện.'}
          </div>
        ) : isLoading ? (
          <div className="py-16"><PageSpinner /></div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sự kiện</th>
                    <th>Danh mục</th>
                    <th>Thời gian</th>
                    <th>Giá vé</th>
                    <th>Vé còn</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={7} className="py-10 text-center text-gray-400">Không có sự kiện nào</td></tr>
                  ) : events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'}
                            alt={event.title}
                            className="h-12 w-12 rounded border border-gray-200 object-cover"
                          />
                          <div>
                            <p className="max-w-[200px] truncate font-medium text-gray-900">{event.title}</p>
                            <p className="max-w-[200px] truncate text-xs text-gray-400">{event.location}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge-blue">{event.categoryName}</span></td>
                      <td className="whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <span><span className="text-gray-500">Từ:</span> {formatDateTime(event.eventDate)}</span>
                          <span><span className="text-gray-500">Đến:</span> {formatDateTime(event.endTime)}</span>
                        </div>
                      </td>
                      <td className="font-medium">{formatCurrency(event.ticketPrice)}</td>
                      <td>
                        <span className={`text-sm font-medium ${event.availableTickets === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {event.availableTickets}/{event.totalTickets}
                        </span>
                      </td>
                      <td><StatusBadge status={event.status} /></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link
                            to={buildPath(ROUTES.STAFF_EVENT_EDIT, { id: event.id })}
                            className="btn-secondary btn-sm"
                          >
                            Sửa
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ open: true, id: event.id, title: event.title })}
                            className="btn-danger btn-sm"
                            disabled={deleteMutation.isPending}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-500">Tổng cộng {totalElements} sự kiện</span>
              <Pagination
                pageable={{ pageNumber: page }}
                totalPages={totalPages}
                onPageChange={(nextPage) => updateQueryParam('page', String(nextPage), false)}
              />
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Xóa sự kiện"
        message={`Bạn có chắc muốn xóa sự kiện "${deleteModal.title}"? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa"
        isLoading={deleteMutation.isPending}
        isDestructive
      />
    </div>
  );
};

export default StaffEventManagementPage;
