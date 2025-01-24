import { AuthResponse } from '@meaku/core/types/admin/auth';
import { SortFilterConfig } from '@meaku/core/types/admin/sort';
import { FilterType, PresetDateLabel, TableAllFilterConfig } from '@meaku/core/types/admin/filters';
import FilterProductOfInterestIcon from '@breakout/design-system/components/icons/filter-productofinterest-icon';
import FilterLocationIcon from '@breakout/design-system/components/icons/filter-location-icon';
// import FilterMeetingBookedIcon from '@breakout/design-system/components/icons/filter-meetingbooked-icon';
// import FilterIntentScoreIcon from '@breakout/design-system/components/icons/filter-intentscore-icon';
import FilterDateIcon from '@breakout/design-system/components/icons/filter-date-icon';

const {
  DateRange,
  IntentScore,
  // MeetingBooked,
  Location,
  ProductOfInterest,
} = FilterType;
const { Today, Yesterday, Last7Days, Last30Days, CustomRange } = PresetDateLabel;

// Authentication

export const ACCESS_TOKEN_EXPIRATION_TIME = 24 * 60 * 60; // SECONDS ( 30 Days * 60 )
export const REFRESH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60; // SECONDS ( 30 Days * 60 )
export const DefaultAuthResponse: AuthResponse = {
  id: 0,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  is_active: false,
  is_staff: false,
  date_joined: '',
  last_login: '',
  organizations: [], // Assuming an empty array as the default for organizations
};

// Pagination
export const PAGINATION_PER_PAGE_OPTIONS = ['10', '25', '50', '75', '100'];

// ICON Props

export const COMMON_SMALL_ICON_PROPS = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  color: 'rgb(var(--primary))',
};

export const PAGE_HEADER_TITLE_ICON_PROPS = COMMON_SMALL_ICON_PROPS;

export const COMMON_ICON_PROPS = {
  width: '24',
  height: '25',
  viewBox: '0 0 24 25',
  color: 'rgb(var(--primary))',
};

export const PAGINATION_ARROW_ICONS = COMMON_SMALL_ICON_PROPS;
export const DROPDOWN_ARROW_ICONS = COMMON_ICON_PROPS;
export const ALL_FILTERS_ICONS = COMMON_ICON_PROPS;

export const DEFAULT_USERNAME = 'Kymberly Abestango';
export const ADMIN_DASHBOARD_COMPANY_NAME = 'Breakout Admin';
export const LOGOUT_BUTTON_TITLE = 'Logout';
export const EXPORT_DOWNLOAD_LABEL = 'Download';

// EXPORT DOWNLOAD FEATURE SUPPORT VARIABLES
export enum ExportFormat {
  XSLS = 'XSLS',
  CSV = 'CSV',
}

export const EXPORT_DOWNLOAD_RADIO_OPTIONS = [
  { value: ExportFormat.XSLS, label: 'Export to XSLS' },
  { value: ExportFormat.CSV, label: 'Export to CSV' },
];

// SORTING FEATURE SUPPORT VARIABLES
export enum SortByTimestamp {
  NEWEST_FIRST = 'newest',
  OLDEST_FIRST = 'oldest',
}

export const SORT_BY_TIMESTAMP_RADIO_OPTIONS = [
  { value: SortByTimestamp.NEWEST_FIRST, label: 'Newest first' },
  { value: SortByTimestamp.OLDEST_FIRST, label: 'Oldest first' },
];

export enum SortBySessionLength {
  LONG_FIRST = 'long',
  SHORT_FIRST = 'short',
}

export const SORT_BY_SESSION_LENGTH_RADIO_OPTIONS = [
  { value: SortBySessionLength.LONG_FIRST, label: 'Longest sessions first' },
  { value: SortBySessionLength.SHORT_FIRST, label: 'Shortest sessions first' },
];

export enum SortByIntentScore {
  HIGHEST_FIRST = 'lead',
  LOWEST_FIRST = 'low',
}

export const SORT_BY_INTENT_SCORE_RADIO_OPTIONS = [
  { value: SortByIntentScore.HIGHEST_FIRST, label: 'Highest intent first' },
  { value: SortByIntentScore.LOWEST_FIRST, label: 'Lowest intent first' },
];

export const SORT_FILTER_CONFIG: SortFilterConfig[] = [
  {
    headerLabel: 'By Timestamp:',
    radioOptions: SORT_BY_TIMESTAMP_RADIO_OPTIONS,
    category: 'timestamp' as const,
    stateKey: 'timestampSort',
  },
  {
    headerLabel: 'By Session Length:',
    radioOptions: SORT_BY_SESSION_LENGTH_RADIO_OPTIONS,
    category: 'sessionLength' as const,
    stateKey: 'sessionLengthSort',
  },
  {
    headerLabel: 'By Intent Score:',
    radioOptions: SORT_BY_INTENT_SCORE_RADIO_OPTIONS,
    category: 'intentScore' as const,
    stateKey: 'intentScoreSort',
  },
];

// ALL FILTERS FEATURE SUPPORT VARIABLES

export const CONVERSATIONS_TABLE_FILTERS_CONFIG: TableAllFilterConfig[] = [
  {
    filterIcon: FilterDateIcon,
    filterLabel: 'By date range',
    filterValue: 'Nov 21 - Nov 29, 2024',
    filterApplied: true,
    filterKey: DateRange,
    filterType: DateRange,
  },
  // {
  //   filterIcon: FilterIntentScoreIcon,
  //   filterLabel: 'By intent score range',
  //   filterValue: '',
  //   filterApplied: false,
  //   filterKey: IntentScore,
  //   filterType: IntentScore,
  // },
  {
    filterIcon: FilterLocationIcon,
    filterLabel: 'By location',
    filterValue: '',
    filterApplied: false,
    filterKey: Location,
    filterType: Location,
  },
  // {
  //   filterIcon: FilterMeetingBookedIcon,
  //   filterLabel: 'Meeting booked',
  //   filterValue: '',
  //   filterApplied: false,
  //   filterKey: MeetingBooked,
  //   filterType: MeetingBooked,
  // },
  {
    filterIcon: FilterProductOfInterestIcon,
    filterLabel: 'Product of Interest',
    filterValue: '',
    filterApplied: false,
    filterKey: ProductOfInterest,
    filterType: ProductOfInterest,
  },
];

export enum FilterByMeetingBooked {
  ALL = 'All',
  YES = 'yes',
  NO = 'no',
}

export const FILTER_BY_MEETING_BOOKED_RADIO_OPTIONS = [
  { value: FilterByMeetingBooked.ALL, label: 'All' },
  { value: FilterByMeetingBooked.YES, label: 'Yes' },
  { value: FilterByMeetingBooked.NO, label: 'No' },
];

export enum FilterByIntentScore {
  LEAD = 'lead',
  MEDIUM = 'medium',
  LOW = 'low',
}

export const FILTER_BY_INTENT_SCORE_CHECKBOX_OPTIONS = [
  { value: FilterByIntentScore.LEAD, label: 'Lead' },
  { value: FilterByIntentScore.MEDIUM, label: 'Medium' },
  { value: FilterByIntentScore.LOW, label: 'Low' },
];

export const DATE_RANGE_PRESET_OPTIONS = [
  { value: '0', label: Today },
  { value: '-1', label: Yesterday },
  { value: '-7', label: Last7Days },
  { value: '-30', label: Last30Days },
  { value: '0', label: CustomRange },
];

export const LEADS_TABLE_FILTERS_CONFIG = CONVERSATIONS_TABLE_FILTERS_CONFIG.slice(0, 3).filter(
  (item) => item.filterType !== IntentScore,
);

// Routes

export enum AppRoutesEnum {
  LEADS = '/leads',
  LOGIN = '/login',
  CONVERSATIONS = '/conversations',
  PLAYGROUND = '/playground',
}

export enum SidebarNavItemsEnum {
  LEADS_LABEL = 'Leads',
  CONVERSATIONS_LABEL = 'Conversations',
  PLAYGROUND_LABEL = 'Playground',
}

// LEADS Page

export const LEADS_PAGE_COLUMN_LISTS = [
  'email',
  'name',
  'company',
  'role',
  'product_of_interest',
  'timestamp',
  'location',
];

// CONVERSATION PAGE

export enum ConversationChipLabelEnum {
  TOTAL_TRAFFIC = 'TOTAL_TRAFFIC',
  TOTAL_CONVERSATIONS = 'TOTAL_CONVERSATIONS',
  HIGH_INTENT_CONVERSATIONS = 'HIGH_INTENT_CONVERSATIONS',
  LEAD_GENERATED = 'LEAD_GENERATED',
}

export enum ConversationDetailsTabsValueEnum {
  LOG_TAB = 'log',
  SUMMARY_TAB = 'summary',
  ACTIVITY_TAB = 'activity',
}

export enum ConversationDetailsTabsLabelEnum {
  LOG_TAB_LABEL = 'Log',
  SUMMARY_TAB_LABEL = 'Summary',
  ACTIVITY_TAB_LABEL = 'Activity',
}

export const CONVERSATIONS_PAGE_COLUMN_LISTS = [
  'company',
  'name',
  'email',
  'timestamp',
  'conversation_preview',
  'location',
  'buyer_intent',
  // 'bant_analysis', // TODO: Once its decided to show this column
  'number_of_user_messages',
  'meeting_status',
  'product_of_interest',
  'ip_address',
  'session_id',
];

export const UPPERCASE_COLUMN_WORDS = ['bant', 'ip', 'id'];
export const CONVERSATIONS_PINNED_COLUMNS = ['company', 'name'];

export interface FunnelData {
  funnelChipType: string;
  funnelChipLabel: string;
  funnelNumericLabel: string;
  funnelKey: string;
}

// Filters
export const FILTER_DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

export const BY_INTENT_SCORE_FILTER_LABEL = 'By intent score';
export const BY_DATE_RANGE_FILTER_LABEL = 'By date range';
export const BY_LOCATION_FILTER_LABEL = 'By location';
