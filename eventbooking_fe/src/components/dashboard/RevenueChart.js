import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatCurrency';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data = [] }) => {
  const labels = data.map((d) => d.day);
  const revenues = data.map((d) => d.revenue);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: revenues,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#94a3b8',
        bodyColor: '#f1f5f9',
        padding: 12,
        callbacks: {
          label: (context) => ` ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 12 } },
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (value) =>
            value >= 1_000_000
              ? `${(value / 1_000_000).toFixed(0)}M`
              : value >= 1_000
              ? `${(value / 1_000).toFixed(0)}K`
              : value,
        },
      },
    },
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        Không có dữ liệu doanh thu
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
