import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data }) => {
  // data có thể có định dạng: [{ month: 'Tháng 1', revenue: 10000000 }, ...]
  
  const chartData = {
    labels: data.map(item => item.label || item.month),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(item => item.revenue || item.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
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
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (value >= 1000000) {
              return (value / 1000000) + 'tr';
            } else if (value >= 1000) {
              return (value / 1000) + 'k';
            }
            return value;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Biểu đồ doanh thu</h3>
      <div className="h-72 w-full">
        {data && data.length > 0 ? (
          <Line options={options} data={chartData} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Chưa có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
