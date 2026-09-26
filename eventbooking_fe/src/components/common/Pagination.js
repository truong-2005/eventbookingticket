import React from 'react';
import Button from './Button';

const Pagination = ({ pageable, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const currentPage = pageable?.pageNumber || 0;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} variant="secondary">Trang trước</Button>
        <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1} variant="secondary">Trang sau</Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Đang xem trang <span className="font-medium">{currentPage + 1}</span> / <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span>Trước</span>
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  i === currentPage
                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span>Sau</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
