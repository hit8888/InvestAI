import { PaginationPageType } from './admin';
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
  page: PaginationPageType;
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
  Sources = 'sources',
  FileType = 'fileType',
  UsageCount = 'usageCount',
  Duration = 'duration',
  SearchTableContent = 'searchTableContent',
  AllFilters = 'allFilters',
  Company = 'company',
  UserMessagesCount = 'userMessagesCount',
  Status = 'status',
  TestConversationIncluded = 'testConversationsIncluded',
}

export interface userMessagesCountFilterValues {
  minCount: number;
  maxCount: number;
}

export interface usageCountFilterValues {
  minCount: number;
  maxCount: number;
}

export interface durationFilterValues {
  minDuration: number;
  maxDuration: number;
}

export interface FilterValues {
  presetDate: string;
  dateRange?: DateRangeProp;
  intentScore: string[];
  location: string[];
  company: string[];
  productOfInterest: string[];
  sources: string[];
  status: string[];
  fileType: string[];
  meetingBooked?: string;
  usageCount: usageCountFilterValues;
  duration: durationFilterValues;
  searchTableContent: string;
  userMessagesCount: userMessagesCountFilterValues;
  presetFilters: FilterItem[];
  testConversationsIncluded: boolean;
}
export const InitialFilterValues: FilterValues = {
  presetDate: PresetDateLabel.CustomRange,
  dateRange: undefined,
  intentScore: [],
  location: [],
  company: [],
  productOfInterest: [],
  sources: [],
  status: [],
  fileType: [],
  meetingBooked: undefined,
  usageCount: {
    minCount: 0,
    maxCount: 100,
  },
  duration: {
    minDuration: 0,
    maxDuration: 100,
  },
  searchTableContent: '',
  userMessagesCount: {
    minCount: 0,
    maxCount: 100,
  },
  presetFilters: [],
  testConversationsIncluded: false,
};

export type FilterValueTypes =
  | DateRangeProp
  | string
  | string[]
  | number
  | userMessagesCountFilterValues
  | durationFilterValues
  | boolean
  | undefined;

export interface AllFilterState {
  leads: FilterValues;
  conversations: FilterValues;
  webpages: FilterValues;
  documents: FilterValues;
  videos: FilterValues;
  slides: FilterValues;
  setFilter: (page: PaginationPageType, key: keyof FilterValues, value: FilterValueTypes) => void;
  resetPageFilters: (page: PaginationPageType) => void;
  initializeFilterValues: (page: PaginationPageType, filters: FilterItem[]) => void;
}

export type ResultantOption = {
  value: string;
  label: string;
};
