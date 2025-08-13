import { AppRoutesEnum } from '../../utils/constants';

export enum CalendarTabsEnum {
  ADD_CALENDAR = 'add-calendar',
  CREATE_CALENDAR = 'create-calendar',
}

export type CalendarManagementProps = {
  title: string;
  description: string;
};

export const CALENDAR_MANAGEMENT_DESCRIPTION =
  'Manage your calendar integrations by either connecting your existing calendar or using Breakout’s managed calendar system. This allows you to schedule meetings and manage availability seamlessly.';

export const CALENDAR_TYPES = [
  { value: 'CALENDLY', label: 'Calendly' },
  { value: 'CAL_COM', label: 'Cal.com' },
  { value: 'IFRAME', label: 'Other' },
];

// Common timezone options - browser timezone will be default
export const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'ET', label: 'America/New_York' },
  { value: 'CT', label: 'America/Chicago' },
  { value: 'MT', label: 'America/Denver' },
  { value: 'PT', label: 'America/Los_Angeles' },
  { value: 'GMT', label: 'Europe/London' },
  { value: 'CET', label: 'Europe/Paris' },
  { value: 'CEST', label: 'Europe/Berlin' },
  { value: 'JST', label: 'Asia/Tokyo' },
  { value: 'CST', label: 'Asia/Shanghai' },
  { value: 'IST', label: 'Asia/Calcutta' },
  { value: 'AEST', label: 'Australia/Sydney' },
];

export const getBrowserTimezone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone;
};

// Mapping between URL paths and CalendarTabsEnum
export const TAB_TO_PATH_MAP: Record<CalendarTabsEnum, string> = {
  [CalendarTabsEnum.ADD_CALENDAR]: AppRoutesEnum.ADD_CALENDAR,
  [CalendarTabsEnum.CREATE_CALENDAR]: AppRoutesEnum.CALENDAR,
};

export const PATH_TO_TAB_MAP: Record<string, CalendarTabsEnum> = {
  [AppRoutesEnum.ADD_CALENDAR]: CalendarTabsEnum.ADD_CALENDAR,
  [AppRoutesEnum.CALENDAR]: CalendarTabsEnum.CREATE_CALENDAR,
};

// Helper functions to normalize path segments
export const normalizePathSegment = (path: string): string => {
  // Normalize the path by removing trailing slashes and trimming whitespace
  return path?.trim().replace(/\/+$/, '') || '';
};

export const getTabFromPath = (path: string): CalendarTabsEnum => {
  const normalizedPath = normalizePathSegment(path);

  // Handle empty path or root path - default to CREATE_CALENDAR (base calendar page)
  if (!normalizedPath || normalizedPath === '/' || normalizedPath === 'calendar') {
    return CalendarTabsEnum.CREATE_CALENDAR;
  }

  // Check for specific paths
  if (normalizedPath === AppRoutesEnum.ADD_CALENDAR) {
    return CalendarTabsEnum.ADD_CALENDAR;
  }

  // Default to CREATE_CALENDAR for unknown paths
  return CalendarTabsEnum.CREATE_CALENDAR;
};

export const getPathFromTab = (tab: CalendarTabsEnum): string => {
  return TAB_TO_PATH_MAP[tab];
};

// Helper function to build navigation path for calendar tabs
export const buildNavigationPath = (currentPath: string, newSegment: string): string => {
  // Remove trailing slash and get path segments
  const cleanPath = currentPath.replace(/\/+$/, '');
  const pathSegments = cleanPath.split('/').filter(Boolean);

  // Find the settings index to build the base path correctly
  const settingsIndex = pathSegments.findIndex((segment) => segment === AppRoutesEnum.SETTINGS);

  if (settingsIndex >= 0) {
    // Use everything up to and including 'settings'
    const basePath = `/${pathSegments.slice(0, settingsIndex + 1).join('/')}`;
    return `${basePath}/${newSegment}`;
  } else {
    // Fallback: assume we need to add settings
    const tenantIndex = pathSegments.findIndex(
      (segment) =>
        ![AppRoutesEnum.SETTINGS, AppRoutesEnum.CALENDAR, AppRoutesEnum.ADD_CALENDAR].includes(
          segment as AppRoutesEnum,
        ),
    );
    const basePath = tenantIndex >= 0 ? `/${pathSegments.slice(0, tenantIndex + 1).join('/')}/settings` : '/settings';
    return `${basePath}/${newSegment}`;
  }
};
