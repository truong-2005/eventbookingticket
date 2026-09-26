import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventApi from '../../../api/eventApi';
import categoryApi from '../../../api/categoryApi';
import EventForm from '../../../components/events/EventForm';
import Button from '../../../components/common/Button';
import { ROUTES } from '../../../constants/routes';
import { format } from 'date-fns';

const AdminEventCreatePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categoriesAll'],
    queryFn: async () => {
      const res = await categoryApi.getAllCategories({ size: 100 });
      return res.data.content || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: (payload) => eventApi.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate(ROUTES.ADMIN_EVENTS);
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
      imageUrl: formData.imageUrl
    };
    createMutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo Sự Kiện Mới</h1>
        <Button variant="secondary" onClick={() => navigate(ROUTES.ADMIN_EVENTS)}>Quay lại</Button>
      </div>
      
      {createMutation.isError && (
        <div className="mb-4 bg-red-50 text-red-500 p-3 rounded text-sm">
          {createMutation.error?.response?.data?.message || createMutation.error?.response?.data?.errors?.join(', ') || 'Có lỗi xảy ra khi tạo sự kiện.'}
        </div>
      )}
      
      {!isCategoriesLoading && (
        <EventForm 
          onSubmit={onSubmit} 
          isLoading={createMutation.isPending} 
          categories={categories}
          submitText="Lưu sự kiện"
        />
      )}
    </div>
  );
};

export default AdminEventCreatePage;
