import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatNumber } from '../../utils/formatCurrency';

const TopEventsTable = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
        Không có dữ liệu
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = Math.round((item.revenue / maxRevenue) * 100);
        const medals = ['🥇', '🥈', '🥉'];

        return (
          <div key={item.eventId} className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
              {index < 3 ? (
                <span className="text-lg">{medals[index]}</span>
              ) : (
                <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-800 truncate">{item.eventTitle}</p>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="text-xs text-gray-500">{formatNumber(item.bookingCount)} vé</span>
                  <span className="text-sm font-bold text-primary-600">{formatCurrency(item.revenue)}</span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TopEventsTable;
