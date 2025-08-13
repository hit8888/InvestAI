import { useLocation } from 'react-router-dom';
import { CalendarTabsEnum, getTabFromPath } from './utils';

export const useCalendarTab = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const settingsIndex = pathSegments.findIndex((segment) => segment === 'settings');
  if (settingsIndex === -1) {
    return CalendarTabsEnum.CREATE_CALENDAR;
  }

  const calendarSegments = pathSegments.slice(settingsIndex + 1);
  const calendarPath = calendarSegments.join('/');

  return getTabFromPath(calendarPath);
};
