import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';

const HighlightEventCard = ({ event }) => {
  // Mocking an original price to show the strikethrough discount (like the image)
  const originalPrice = event.ticketPrice * 1.2;

  return (
    <Link 
      to={`/events/${event.id}`}
      className="group relative block w-full h-64 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Background Image */}
      <img 
        src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'} 
        alt={event.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient Overlay for bottom text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      {/* Content at the bottom */}
      <div className="absolute bottom-0 left-0 p-4 w-full text-white">
        <h3 className="text-xl font-bold mb-1 truncate shadow-sm">
          {event.title}
        </h3>
        <div className="flex items-center text-sm">
          <span className="font-semibold mr-2">
            Từ {formatCurrency(event.ticketPrice)}
          </span>
          <span className="text-gray-300 line-through text-xs">
            {formatCurrency(originalPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HighlightEventCard;
