import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const EventCard = ({ event }) => {
  const isUpcoming = event.status === 'UPCOMING';
  const isOngoing = event.status === 'ONGOING';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
            isUpcoming ? 'bg-blue-100 text-blue-800' :
            isOngoing ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {isUpcoming ? 'Sắp diễn ra' : isOngoing ? 'Đang diễn ra' : 'Đã kết thúc'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="font-medium text-blue-600">{event.categoryName}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="text-sm text-gray-600 mb-4 flex-grow">
          <div className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.eventDate)}
          </div>
          <div className="flex items-start">
            <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">{event.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Giá vé từ</p>
            <span className="text-xl font-bold text-blue-600">{formatCurrency(event.ticketPrice)}</span>
          </div>
          <Link 
            to={`/events/${event.id}`}
            className="px-4 py-2 bg-gray-50 text-blue-600 border border-blue-100 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
