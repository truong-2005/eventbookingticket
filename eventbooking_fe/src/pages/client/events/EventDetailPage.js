import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import eventApi from '../../../api/eventApi';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import Button from '../../../components/common/Button';
import useAuth from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants/routes';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await eventApi.getEventById(id);
      return response.data;
    }
  });

  const handleBookTicket = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.CLIENT_LOGIN);
      return;
    }
    navigate(`/events/${id}/book`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center text-red-500 text-xl font-semibold">
          Không thể tải thông tin sự kiện.
        </div>
      </div>
    );
  }

  const isUpcoming = event.status === 'UPCOMING';

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 md:w-1/2">
              <img 
                className="h-full w-full object-cover md:h-full" 
                src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'} 
                alt={event.title} 
              />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
                  {event.categoryName}
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${isUpcoming ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {event.status}
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {event.title}
              </h1>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-start text-gray-600 text-lg">
                  <svg className="w-6 h-6 mr-3 text-blue-500 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-lg">
                  <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Số lượng vé: {event.totalTickets} vé</span>
                </div>
              </div>
              
              <div className="mt-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Giới thiệu sự kiện</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Giá vé</p>
                  <p className="text-3xl font-extrabold text-blue-600">{formatCurrency(event.ticketPrice)}</p>
                </div>
                <Button 
                  onClick={handleBookTicket} 
                  disabled={!isUpcoming}
                  className="px-8 py-3 text-lg"
                >
                  {isUpcoming ? 'Mua Vé Ngay' : 'Đã Đóng Đăng Ký'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
