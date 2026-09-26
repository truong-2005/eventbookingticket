import React from 'react';

const StatCard = ({ title, value, icon, color = 'indigo', change, suffix = '' }) => {
  const colors = {
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'bg-indigo-600 text-white',
      text: 'text-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-600 text-white',
      text: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-500 text-white',
      text: 'text-amber-600',
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'bg-rose-600 text-white',
      text: 'text-rose-600',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-600 text-white',
      text: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-600 text-white',
      text: 'text-purple-600',
    },
  };

  const c = colors[color] || colors.indigo;

  return (
    <div className={`card p-6 animate-fade-in ${c.bg} border-0`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${c.icon} flex items-center justify-center shadow-sm`}>
          {icon}
        </div>
        {change !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${c.text}`}>
        {value}
        {suffix && <span className="text-base font-normal text-gray-400 ml-1">{suffix}</span>}
      </p>
    </div>
  );
};

export default StatCard;
