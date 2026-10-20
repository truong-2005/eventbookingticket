import { useEffect, useMemo, useState } from 'react';

const MAX_TIMEOUT = 2_147_000_000;

const getEndTime = (event) => {
  if (!event?.endTime) return null;

  const endTime = new Date(event.endTime).getTime();
  return Number.isNaN(endTime) ? null : endTime;
};

const isCompleted = (event) => event?.status?.toUpperCase() === 'COMPLETED';

const useActiveEvents = (events = []) => {
  const [now, setNow] = useState(() => Date.now());

  const activeEvents = useMemo(
    () => events.filter((event) => {
      if (isCompleted(event)) return false;

      const endTime = getEndTime(event);
      return endTime === null || endTime > now;
    }),
    [events, now]
  );

  useEffect(() => {
    const nextEndTime = events
      .filter((event) => !isCompleted(event))
      .map(getEndTime)
      .filter((endTime) => endTime !== null && endTime > now)
      .sort((a, b) => a - b)[0];

    if (nextEndTime === undefined) return undefined;

    const timeout = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(nextEndTime - now + 1, MAX_TIMEOUT)
    );

    return () => window.clearTimeout(timeout);
  }, [events, now]);

  return activeEvents;
};

export default useActiveEvents;
