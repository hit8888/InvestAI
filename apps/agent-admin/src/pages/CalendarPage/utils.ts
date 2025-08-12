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
  [CalendarTabsEnum.ADD_CALENDAR]: 'calendar',
  [CalendarTabsEnum.CREATE_CALENDAR]: 'managed-calendar',
};

export const PATH_TO_TAB_MAP: Record<string, CalendarTabsEnum> = {
  calendar: CalendarTabsEnum.ADD_CALENDAR,
  'managed-calendar': CalendarTabsEnum.CREATE_CALENDAR,
};

// Helper functions
export const getTabFromPath = (path: string): CalendarTabsEnum => {
  return PATH_TO_TAB_MAP[path] || CalendarTabsEnum.ADD_CALENDAR;
};

export const getPathFromTab = (tab: CalendarTabsEnum): string => {
  return TAB_TO_PATH_MAP[tab];
};
