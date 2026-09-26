import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopEventsChart = ({ data }) => {
  // data: [{ title: 'Event A', ticketsSold: 120 }, ...]
  
  const chartData = {
    labels: data.map(item => {
      // Rút gọn tên sự kiện nếu quá dài
      const title = item.title || item.eventName || item.eventTitle || 'Không tên';
      return title.length > 15 ? title.substring(0, 15) + '...' : title;
    }),
    datasets: [
      {
        label: 'Vé đã bán',
        data: data.map(item => item.ticketsSold || item.soldCount || item.bookingCount || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            // Hiển thị tên đầy đủ khi hover
            const idx = context[0].dataIndex;
            return data[idx].title || data[idx].eventName || data[idx].eventTitle || 'Không tên';
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Sự kiện bán chạy nhất</h3>
      <div className="h-72 w-full">
        {data && data.length > 0 ? (
          <Bar options={options} data={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export default TopEventsChart;
