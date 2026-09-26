import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import EventCard from '../../../components/client/EventCard';
import Pagination from '../../../components/common/Pagination';
import eventApi from '../../../api/eventApi';

const EventListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const searchQuery = searchParams.get('search') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['clientEvents', currentPage, searchQuery],
    queryFn: async () => {
      const params = { page: currentPage, size: 9 };
      if (searchQuery) params.title = searchQuery;
      const res = await eventApi.getAllEvents(params);
      return res.data;
    },
    keepPreviousData: true
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSearchTerm = formData.get('search')?.toString().trim();
    
    if (newSearchTerm) {
      setSearchParams({ search: newSearchTerm, page: '0' });
    } else {
      searchParams.delete('search');
      searchParams.set('page', '0');
      setSearchParams(searchParams);
    }
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  const events = data?.content || [];
  const pageable = data?.pageable || { pageNumber: currentPage };
  const totalPages = data?.totalPages || 0;

  if (error) {
    return <div className="text-center py-20 text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại sau.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
              Khám phá Sự kiện
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <form onSubmit={handleSearch} className="flex w-full md:max-w-sm">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Tìm kiếm sự kiện..."
                className="flex-1 min-w-0 block w-full px-4 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <Pagination 
              pageable={pageable} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Không tìm thấy sự kiện nào</h3>
            <p>Vui lòng thử lại với từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListPage;
