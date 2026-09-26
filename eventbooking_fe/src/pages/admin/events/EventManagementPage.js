import React, { useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminToastContext } from '../../../layouts/AdminLayout';
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
  { value: '', label: 'Tất cả' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'ONGOING', label: 'Đang diễn ra' },
  { value: 'COMPLETED', label: 'Đã kết thúc' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const EventListPage = () => {
  const toast = useContext(AdminToastContext);
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '0', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);
  const keyword = searchParams.get('keyword') || '';
  const status = searchParams.get('status') || '';
  const categoryId = searchParams.get('categoryId') || '';

  const [searchVal, setSearchVal] = useState(keyword);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const { data: categories } = useQuery({
    queryKey: ['categoriesAll'],
    queryFn: async () => {
      const res = await categoryApi.getAllCategories({ page: 0, size: 100 });
      return res.data?.content || [];
    }
  });

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events', page, size, keyword, status, categoryId],
    queryFn: async () => {
      const res = await eventApi.getAllEvents({
        page,
        size,
        ...(keyword && { title: keyword }),
        ...(status && { status }),
        ...(categoryId && { categoryId: Number(categoryId) }),
      });
      return res.data;
    },
    keepPreviousData: true
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => eventApi.deleteEvent(id),
    onSuccess: () => {
      toast?.success('Đã xóa sự kiện');
      setDeleteModal({ open: false, id: null, title: '' });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err) => {
      toast?.error(err.response?.data?.message || 'Xóa thất bại (còn vé đã đặt)');
      setDeleteModal({ open: false, id: null, title: '' });
    }
  });

  const handleParamChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0'); // reset page on filter change
    setSearchParams(newParams);
  };

  const goToPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const setSize = (newSize) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('size', newSize.toString());
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchVal('');
    setSearchParams({ page: '0', size: size.toString() });
  };

  const events = eventsData?.content || [];
  const totalPages = eventsData?.totalPages || 0;
  const totalElements = eventsData?.totalElements || 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="section-title">Quản lý sự kiện</h1>
          <p className="text-gray-500 text-sm mt-1">{totalElements} sự kiện</p>
        </div>
        <Link to={ROUTES.ADMIN_EVENT_CREATE} className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo sự kiện
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <SearchBar value={searchVal} onChange={setSearchVal} onSearch={(v) => handleParamChange('keyword', v)} placeholder="Tìm tiêu đề..." />
        <select value={status} onChange={(e) => handleParamChange('status', e.target.value)} className="form-select w-auto">
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={categoryId} onChange={(e) => handleParamChange('categoryId', e.target.value)} className="form-select w-auto">
          <option value="">Tất cả danh mục</option>
          {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {(keyword || status || categoryId) && (
          <button onClick={clearFilters} className="btn-ghost btn-sm">Xóa lọc</button>
        )}
      </div>

      <div className="card">
        {isLoading ? <div className="py-16"><PageSpinner /></div> : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Sự kiện</th>
                    <th>Danh mục</th>
                    <th>Ngày</th>
                    <th>Giá vé</th>
                    <th>Vé còn</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-gray-400">Không có sự kiện nào</td></tr>
                  ) : events.map((ev) => (
                    <tr key={ev.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img 
                            src={ev.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'} 
                            alt={ev.title} 
                            className="w-12 h-12 rounded object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-medium text-gray-900 max-w-[200px] truncate">{ev.title}</p>
                            <p className="text-xs text-gray-400 max-w-[200px] truncate">{ev.location}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge-blue">{ev.categoryName}</span></td>
                      <td className="text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span><span className="text-gray-500">Từ:</span> {formatDateTime(ev.eventDate)}</span>
                          <span><span className="text-gray-500">Đến:</span> {formatDateTime(ev.endTime)}</span>
                        </div>
                      </td>
                      <td className="font-medium">{formatCurrency(ev.ticketPrice)}</td>
                      <td>
                        <span className={`font-medium text-sm ${ev.availableTickets === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {ev.availableTickets}/{ev.totalTickets}
                        </span>
                      </td>
                      <td><StatusBadge status={ev.status} /></td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link to={buildPath(ROUTES.ADMIN_EVENT_EDIT, { id: ev.id })} className="btn-secondary btn-sm">Sửa</Link>
                          <button
                            onClick={() => setDeleteModal({ open: true, id: ev.id, title: ev.title })}
                            className="btn-danger btn-sm"
                          >Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4">
              <Pagination page={page} totalPages={totalPages} totalElements={totalElements} size={size} onPageChange={goToPage} onSizeChange={setSize} />
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        onConfirm={() => deleteMutation.mutate(deleteModal.id)}
        title="Xóa sự kiện"
        message={`Bạn có chắc muốn xóa sự kiện "${deleteModal.title}"? Thao tác không thể hoàn tác.`}
        confirmText="Xóa"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EventListPage;
