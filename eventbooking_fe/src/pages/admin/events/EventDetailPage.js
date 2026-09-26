import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import eventApi from '../../../api/eventApi';
import Button from '../../../components/common/Button';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const res = await eventApi.getEventById(id);
      return res.data;
    }
  });

  if (isLoading) return <div className="text-center p-10">Đang tải chi tiết sự kiện...</div>;
  if (error || !event) return <div className="text-center p-10 text-red-500">Sự kiện không tồn tại hoặc có lỗi xảy ra!</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium">{event.categoryName || 'Sự kiện'}</span>
            <span>Trạng thái: <b className={event.status === 'UPCOMING' ? 'text-blue-600' : 'text-green-600'}>{event.status}</b></span>
          </div>
        </div>
        <Button onClick={() => navigate(-1)} variant="secondary">Quay lại</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin chung</h3>
          <ul className="space-y-3">
            <li><span className="font-medium text-gray-600">Địa điểm:</span> {event.location}</li>
            <li><span className="font-medium text-gray-600">Thời gian:</span> {formatDate(event.eventDate || event.startTime)}</li>
            <li><span className="font-medium text-gray-600">Kết thúc:</span> {formatDate(event.endTime)}</li>
            <li><span className="font-medium text-gray-600">Mô tả:</span> <p className="mt-1 text-gray-700 whitespace-pre-wrap">{event.description}</p></li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Thông tin vé</h3>
          <ul className="space-y-3 text-lg">
            <li><span className="font-medium text-gray-600">Giá vé:</span> <span className="font-bold text-indigo-600">{formatCurrency(event.ticketPrice || event.price)}</span></li>
            <li><span className="font-medium text-gray-600">Tổng số vé:</span> {event.totalTickets}</li>
            <li><span className="font-medium text-gray-600">Đã đặt:</span> {event.ticketsSold || 0} vé</li>
            <li><span className="font-medium text-gray-600">Còn lại:</span> {event.totalTickets - (event.ticketsSold || 0)} vé</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
