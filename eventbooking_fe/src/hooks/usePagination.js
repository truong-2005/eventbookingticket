import { useState, useCallback } from 'react';

const usePagination = (initialPage = 0, initialSize = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const goToPage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const goToFirst = useCallback(() => setPage(0), []);
  const goToLast = useCallback(() => setPage(totalPages - 1), [totalPages]);
  const goToPrev = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
  const goToNext = useCallback(
    () => setPage((p) => Math.min(totalPages - 1, p + 1)),
    [totalPages]
  );

  const setPageInfo = useCallback((data) => {
    setTotalPages(data.totalPages ?? 0);
    setTotalElements(data.totalElements ?? 0);
  }, []);

  const reset = useCallback(() => {
    setPage(0);
  }, []);

  const pageable = { page, size, sort: [] };

  return {
    page,
    size,
    totalPages,
    totalElements,
    pageable,
    setSize,
    goToPage,
    goToFirst,
    goToLast,
    goToPrev,
    goToNext,
    setPageInfo,
    reset,
  };
};

export default usePagination;
