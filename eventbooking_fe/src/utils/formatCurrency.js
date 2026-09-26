/**
 * Format số tiền theo định dạng tiền Việt Nam Đồng
 */

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('vi-VN').format(num);
};

export const formatCompactNumber = (num) => {
  if (!num) return '0';
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};
