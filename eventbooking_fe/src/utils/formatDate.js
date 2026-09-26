/**
 * Format ISO date string thành định dạng dễ đọc tiếng Việt
 */

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDateTimeInput = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatRelative = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Đã qua';
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Ngày mai';
  if (diffDays < 7) return `${diffDays} ngày nữa`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần nữa`;
  return formatDate(dateStr);
};

export const formatShortDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};
