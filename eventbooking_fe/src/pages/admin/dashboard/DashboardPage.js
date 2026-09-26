import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../../../components/admin/StatCard';
import RevenueChart from '../../../components/admin/RevenueChart';
import TopEventsChart from '../../../components/admin/TopEventsChart';
import dashboardApi from '../../../api/dashboardApi';

const DashboardPage = () => {

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      const res = await dashboardApi.getSummary();
      return res.data;
    }
  });

  const { data: revenue = [], isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['dashboardRevenue'],
    queryFn: async () => {
      const res = await dashboardApi.getRevenue();
      return res.data || [];
    }
  });

  const { data: topEvents = [], isLoading: isLoadingTopEvents } = useQuery({
    queryKey: ['dashboardTopEvents'],
    queryFn: async () => {
      const res = await dashboardApi.getTopEvents();
      return res.data || [];
    }
  });

  const isLoading = isLoadingSummary || isLoadingRevenue || isLoadingTopEvents;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Tổng Sự kiện" 
          value={summary?.totalEvents || 0} 
          color="blue"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
        />
        <StatCard 
          title="Tổng Người dùng" 
          value={summary?.totalUsers || 0} 
          color="green"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard 
          title="Tổng Vé Bán Ra" 
          value={summary?.totalBookings || 0} 
          color="yellow"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
        />
        <StatCard 
          title="Tổng Doanh Thu" 
          value={(summary?.totalRevenue || 0).toLocaleString() + ' ₫'} 
          color="indigo"
          icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart data={revenue} />
        <TopEventsChart data={topEvents} />
      </div>
    </div>
  );
};

export default DashboardPage;
