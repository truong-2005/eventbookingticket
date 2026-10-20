export const getEventStatusForSchedule = (startTime, endTime, currentStatus, now = new Date()) => {
  if (currentStatus === 'CANCELLED') return 'CANCELLED';

  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return currentStatus || 'UPCOMING';
  }

  if (now < start) return 'UPCOMING';
  if (now < end) return 'ONGOING';
  return 'COMPLETED';
};
