import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventApi from '../../../api/eventApi';
import categoryApi from '../../../api/categoryApi';
import EventForm from '../../../components/events/EventForm';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';
import { format } from 'date-fns';

const StaffEventEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading: isFetching, error: queryError } = useQuery({
    queryKey: ['staffEventEdit', id],
    queryFn: async () => {
      const [catsRes, eventRes] = await Promise.all([
        categoryApi.getAllCategories({ size: 100 }),
        eventApi.getEventById(id)
      ]);
      return {
        categories: catsRes.data.content || [],
        event: eventRes.data
      };
    }
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => eventApi.updateEvent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffEvents'] });
      queryClient.invalidateQueries({ queryKey: ['staffEventEdit', id] });
      navigate(ROUTES.STAFF_EVENTS);
    }
  });

  const onSubmit = (formData) => {
    const payload = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      eventDate: formData.startTime ? format(formData.startTime, "yyyy-MM-dd'T'HH:mm:ss") : null,
      endTime: formData.endTime ? format(formData.endTime, "yyyy-MM-dd'T'HH:mm:ss") : null,
      ticketPrice: parseFloat(formData.price),
      totalTickets: parseInt(formData.totalTickets),
      categoryId: parseInt(formData.categoryId),
      status: formData.status
    };
    updateMutation.mutate(payload);
  };

  if (isFetching) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  if (queryError) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  const { categories = [], event: evt } = data || {};
  
  // Transform event data for form
  const initialData = {
    ...evt,
    price: evt.ticketPrice,
    startTime: evt.eventDate ? new Date(evt.eventDate) : null,
    endTime: evt.endTime ? new Date(evt.endTime) : null,
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sửa Sự Kiện</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.STAFF_EVENTS)}>Quay lại</Button>
      </div>
      
      {updateMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {updateMutation.error?.response?.data?.message || updateMutation.error?.response?.data?.errors?.join(', ') || 'Có lỗi xảy ra khi cập nhật.'}
        </div>
      )}
      
      <EventForm 
        initialData={initialData}
        onSubmit={onSubmit} 
        isLoading={updateMutation.isPending} 
        categories={categories}
        submitText="Lưu thay đổi"
        isEdit={true}
      />
    </div>
  );
};

export default StaffEventEditPage;
