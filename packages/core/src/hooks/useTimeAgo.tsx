import { Timeout } from 'ahooks/lib/useRequest/src/types';
import { useState, useEffect, useRef } from 'react';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const getTimeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diff = now.getTime() - targetDate.getTime();
  const absDiff = Math.abs(diff);

  if (absDiff < MINUTE) {
    return 'just now';
  } else if (absDiff < HOUR) {
    const minutes = Math.floor(diff / MINUTE);
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  } else if (absDiff < DAY) {
    const hours = Math.floor(diff / HOUR);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (absDiff < WEEK) {
    const days = Math.floor(diff / DAY);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (absDiff < MONTH) {
    const weeks = Math.floor(diff / WEEK);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (absDiff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(diff / YEAR);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
};

export const useTimeAgo = (date: Date | string | number, updateInterval = 30000): string | null => {
  const [timeAgo, setTimeAgo] = useState<string>(() => getTimeAgo(date));
  const intervalRef = useRef<Timeout | null>(null);
  const dateRef = useRef<Date | string | number>(date);

  useEffect(() => {
    if (date !== dateRef.current) {
      dateRef.current = date;
      setTimeAgo(getTimeAgo(date));
    }

    const targetDate = new Date(date);
    const isRecent = Date.now() - targetDate.getTime() < DAY;

    if (isRecent) {
      intervalRef.current = setInterval(() => {
        setTimeAgo(getTimeAgo(dateRef.current));
      }, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [date, updateInterval]);

  return date ? timeAgo : null;
};

export default useTimeAgo;
