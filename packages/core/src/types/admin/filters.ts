import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from './admin';
import { FilterItem } from './api.ts';

export interface TableAllFilterConfig {
  filterIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  filterLabel: string;
  filterValue: string;
  filterApplied: boolean;
  filterKey: string;
  handleFilterClick?: () => void;
  filterType: FilterType;
}

export type PageTypeProps = {
  page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE;
};

export type CommonFilterContentProps = PageTypeProps & {
  filterState: FilterType;
  handleClosePopover: () => void;
};

export type CommonFilterContentPropsWithoutFilterState = Omit<CommonFilterContentProps, 'filterState'>;

export type DateRangeProp = {
  startDate: Date | undefined;
  endDate?: Date | undefined;
};

export type DateRangePickerProps = {
  date: DateRangeProp | undefined;
  onDateChange: (dateRange: DateRangeProp | undefined) => void;
  isCustomRange: boolean;
};

export enum PresetDateLabel {
  Today = 'Today',
  Yesterday = 'Yesterday',
  Last7Days = 'Last 7 days',
  Last30Days = 'Last 30 days',
  CustomRange = 'Custom Range',
}

export enum FilterType {
  PresetDate = 'presetDate',
  DateRange = 'dateRange',
  IntentScore = 'intentScore',
  Location = 'location',
  MeetingBooked = 'meetingBooked',
  ProductOfInterest = 'productOfInterest',
  AllFilters = 'allFilters',
  Company = 'company',
  UserMessagesCount = 'userMessagesCount',
}

export interface userMessagesCountFilterValues {
  minCount: number;
  maxCount: number;
}

export interface FilterValues {
  presetDate: string;
  dateRange?: DateRangeProp;
  intentScore: string[];
  location: string[];
  company: string[];
  productOfInterest: string[];
  meetingBooked?: string;
  userMessagesCount: userMessagesCountFilterValues;
  presetFilters: FilterItem[];
}
export const InitialFilterValues: FilterValues = {
  presetDate: PresetDateLabel.CustomRange,
  dateRange: undefined,
  intentScore: [],
  location: [],
  company: [],
  productOfInterest: [],
  meetingBooked: undefined,
  userMessagesCount: {
    minCount: 0,
    maxCount: 100,
  },
  presetFilters: [],
};

export interface AllFilterState {
  leads: FilterValues;
  conversations: FilterValues;
  setFilter: (
    page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE,
    key: keyof FilterValues,
    value: DateRangeProp | string | string[] | number | userMessagesCountFilterValues | undefined,
  ) => void;
  resetPageFilters: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE) => void;
  initializeFilterValues: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE, filters: FilterItem[]) => void;
}
