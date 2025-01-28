import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from "./admin";

export interface TableAllFilterConfig {
  filterIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  filterLabel: string;
  filterValue: string;
  filterApplied: boolean;
  filterKey: string;
  handleFilterClick?: () => void;
  filterType: FilterType;
}

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
  DateRange = "dateRange",
  IntentScore = 'intentScore',
  Location = 'location',
  MeetingBooked = 'meetingBooked',
  ProductOfInterest = 'productOfInterest',
  AllFilters = 'allFilters',
}

export interface FilterValues {
  presetDate: string;
  dateRange?: DateRangeProp;
  intentScore: string[];
  location: string[];
  productOfInterest: string[];
  meetingBooked?: string;
}
export const InitialFilterValues: FilterValues = {
  presetDate: PresetDateLabel.CustomRange,
  dateRange: undefined,
  intentScore: [],
  location: [],
  productOfInterest: [],
  meetingBooked: undefined,
};

export interface AllFilterState {
  leads: FilterValues;
  conversations: FilterValues;
  setFilter: (
    page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE,
    key: keyof FilterValues,
    value: DateRangeProp | string | string[] | undefined,
  ) => void;
  resetPageFilters: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE) => void;
}
