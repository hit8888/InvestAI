import { AuthResponse } from '@meaku/core/types/admin/auth';
import { SortFilterConfig } from '@meaku/core/types/admin/sort';
import { FilterType, PresetDateLabel, TableAllFilterConfig } from '@meaku/core/types/admin/filters';
import FilterProductOfInterestIcon from '@breakout/design-system/components/icons/filter-productofinterest-icon';
import FilterLocationIcon from '@breakout/design-system/components/icons/filter-location-icon';
import FilterMeetingBookedIcon from '@breakout/design-system/components/icons/filter-meetingbooked-icon';
import FilterIntentScoreIcon from '@breakout/design-system/components/icons/filter-intentscore-icon';
import FilterDateIcon from '@breakout/design-system/components/icons/filter-date-icon';
import FilterCompanyIcon from '@breakout/design-system/components/icons/filter-company-icon';
import FilterUserMessagesCountIcon from '@breakout/design-system/components/icons/filter-message-count-icon';
import SummaryConversationIcon from '@breakout/design-system/components/icons/summary-conv-icon';
import SummaryBantAnalysisIcon from '@breakout/design-system/components/icons/summary-bant-icon';
import SummarySessionDurationIcon from '@breakout/design-system/components/icons/summary-sessionduration-icon';
// import SummaryEntryPointIcon from '@breakout/design-system/components/icons/summary-entrypoint-icon';
import SummaryProductOfInterestIcon from '@breakout/design-system/components/icons/summary-product-icon';
import SummaryIntentScoreIcon from '@breakout/design-system/components/icons/summary-intentscore-icon';
import SummaryLengthOfConvIcon from '@breakout/design-system/components/icons/summary-lengthofconv-icon';
import SummaryIpAddressIcon from '@breakout/design-system/components/icons/summary-ipaddress-icon';
import ProspectNameIcon from '@breakout/design-system/components/icons/prospect-name-icon';
import ProspectEmailIcon from '@breakout/design-system/components/icons/prospect-email-icon';
import LocationSmallIcon from '@breakout/design-system/components/icons/location-icon';
import CompanyNameIcon from '@breakout/design-system/components/icons/company-name-icon';
import CompanyDomainIcon from '@breakout/design-system/components/icons/company-domain-icon';
import CompanyFoundationDate from '@breakout/design-system/components/icons/company-foundation-date';
import CompanyNumberOfEmployeesIcon from '@breakout/design-system/components/icons/company-numberofemployees-icon';
import CompanyRevenueIcon from '@breakout/design-system/components/icons/company-revenue-icon';
import { ConversationRightSideDetailsType } from './admin-types';

const { DateRange, IntentScore, MeetingBooked, Location, ProductOfInterest, Company, UserMessagesCount } = FilterType;
const { Today, Yesterday, Last7Days, Last30Days, CustomRange } = PresetDateLabel;

export const USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD = 100;

// Authentication

export const ACCESS_TOKEN_EXPIRATION_TIME = 5 * 60; // SECONDS ( 30 Days * 60 )
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

export enum COPIED_FIELD_TEXTS {
  EMAIL = 'Email Copied',
  SESSION_ID = 'Session ID Copied',
}

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

export const TABLE_FILTERS_CONFIG: TableAllFilterConfig[] = [
  {
    filterIcon: FilterDateIcon,
    filterLabel: 'Date Range',
    filterValue: 'Nov 21 - Nov 29, 2024',
    filterApplied: true,
    filterKey: DateRange,
    filterType: DateRange,
  },
  {
    filterIcon: FilterIntentScoreIcon,
    filterLabel: 'Buyer Intent',
    filterValue: '',
    filterApplied: false,
    filterKey: IntentScore,
    filterType: IntentScore,
  },
  {
    filterIcon: FilterLocationIcon,
    filterLabel: 'Location',
    filterValue: '',
    filterApplied: false,
    filterKey: Location,
    filterType: Location,
  },
  {
    filterIcon: FilterMeetingBookedIcon,
    filterLabel: 'Meeting booked',
    filterValue: '',
    filterApplied: false,
    filterKey: MeetingBooked,
    filterType: MeetingBooked,
  },
  {
    filterIcon: FilterProductOfInterestIcon,
    filterLabel: 'Product of Interest',
    filterValue: '',
    filterApplied: false,
    filterKey: ProductOfInterest,
    filterType: ProductOfInterest,
  },
  {
    filterIcon: FilterCompanyIcon,
    filterLabel: 'Company',
    filterValue: '',
    filterApplied: false,
    filterKey: Company,
    filterType: Company,
  },
  {
    filterIcon: FilterUserMessagesCountIcon,
    filterLabel: 'User messages count',
    filterValue: '',
    filterApplied: false,
    filterKey: UserMessagesCount,
    filterType: UserMessagesCount,
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
  LEAD = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export const FILTER_BY_INTENT_SCORE_CHECKBOX_OPTIONS = [
  { value: FilterByIntentScore.LOW, label: 'Low' },
  { value: FilterByIntentScore.MEDIUM, label: 'Medium' },
  { value: FilterByIntentScore.LEAD, label: 'High' },
];

export const DATE_RANGE_PRESET_OPTIONS = [
  { value: '0', label: Today },
  { value: '-1', label: Yesterday },
  { value: '-7', label: Last7Days },
  { value: '-30', label: Last30Days },
  { value: '0', label: CustomRange },
];

export const LEADS_TABLE_FILTERS_CONFIG = TABLE_FILTERS_CONFIG.slice(0, 3).filter(
  (item) => item.filterType !== IntentScore,
);

export const CONVERSATIONS_TABLE_FILTERS_CONFIG = TABLE_FILTERS_CONFIG.filter(
  (item) => ![IntentScore, MeetingBooked].includes(item.filterType),
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

export const COLUMN_HEADER_LABEL_MAPPING: Record<string, string> = {
  timestamp: 'Date',
  number_of_user_messages: 'User Messages',
  email: 'Email',
  name: 'Name',
  company: 'Company',
  product_of_interest: 'Product Of Interest',
  location: 'Location',
  role: 'Role',
  conversation_preview: 'Conversation Preview',
  buyer_intent: 'Buyer Intent',
  bant_analysis: 'BANT Analysis',
  meeting_status: 'Meeting Status',
  ip_address: 'IP Address',
  session_id: 'Session ID',
};

// LEADS Page

export const LEADS_PAGE_COLUMN_LISTS = [
  'email',
  'name',
  'company',
  'product_of_interest',
  'timestamp',
  'location',
  'role',
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
  'conversation_preview',
  'location',
  'timestamp',
  'product_of_interest',
  'buyer_intent',
  // 'bant_analysis',
  'number_of_user_messages',
  'company',
  'email',
  'name',
  // 'meeting_status',
  'ip_address',
  'session_id',
];

export const CONVERSATIONS_PINNED_COLUMNS = ['conversation_preview', 'location'];
export const LEADS_PINNED_COLUMNS = ['email', 'name'];
export const SHADOW_PINNED_COLUMNS = ['name', 'location'];

export interface FunnelData {
  funnelChipType: string;
  funnelChipLabel: string;
  funnelNumericLabel: string;
  funnelKey: string;
}

export interface SummaryTabContentList {
  listKey: string;
  listLabel: string;
  listIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  listValue: string | number | BANTItem[];
}

export interface BANTItem {
  itemKey: string;
  itemLabel: string;
  itemIcon: string;
  itemValue: string | number;
}

export const CONVERSATION_DETAILS_PAGESUMMARY_TAB_CONTENT_LIST: SummaryTabContentList[] = [
  {
    listKey: 'summary',
    listLabel: 'Summary of the conversation:',
    listIcon: SummaryConversationIcon,
    listValue: '',
  },
  {
    listKey: 'intentScore',
    listLabel: 'Intent Score:',
    listIcon: SummaryIntentScoreIcon,
    listValue: 0,
  },
  {
    listKey: 'bantAnalysis',
    listLabel: 'BANT Analysis:',
    listIcon: SummaryBantAnalysisIcon,
    listValue: [
      {
        itemKey: 'budget',
        itemLabel: 'Budget:',
        itemIcon: '💰',
        itemValue: '',
      },
      {
        itemKey: 'authority',
        itemLabel: 'Authority:',
        itemIcon: '👨‍💼',
        itemValue: '',
      },
      {
        itemKey: 'need',
        itemLabel: 'Need:',
        itemIcon: '🤲',
        itemValue: '',
      },
      {
        itemKey: 'timeline',
        itemLabel: 'Timeline:',
        itemIcon: '⏱️',
        itemValue: '',
      },
    ],
  },
  {
    listKey: 'productOfInterest',
    listLabel: 'Product of Interest:',
    listIcon: SummaryProductOfInterestIcon,
    listValue: '',
  },
  {
    listKey: 'lengthOfConversation',
    listLabel: 'Length of conversation:',
    listIcon: SummaryLengthOfConvIcon,
    listValue: '',
  },
  // {
  //   listKey: 'entryPoint',
  //   listLabel: 'Entry Point:',
  //   listIcon: SummaryEntryPointIcon,
  //   listValue: 'www.example.com/products/ai',
  // },
  {
    listKey: 'ipAddress',
    listLabel: 'IP Address:',
    listIcon: SummaryIpAddressIcon,
    listValue: '',
  },
  {
    listKey: 'sessionDuration',
    listLabel: 'Session Duration:',
    listIcon: SummarySessionDurationIcon,
    listValue: '',
  },
];

export const DEFAULT_LABEL_FOR_SUMMARY_ITEM = '*No information provided';

export enum CONV_RIGHTSIDE_DETAILS_DATA_ITEMS {
  NAME = 'Name:',
  LOCATION = 'Location:',
  EMAIL = 'Email:',
  REVENUE = 'Revenue:',
  NUMBER_OF_EMPLOYEES = 'Number of employees:',
  DOMAIN = 'Domain:',
  FOUNDATION_DATE = 'Foundation Date:',
}

const { NAME, LOCATION, EMAIL, REVENUE, NUMBER_OF_EMPLOYEES, DOMAIN, FOUNDATION_DATE } =
  CONV_RIGHTSIDE_DETAILS_DATA_ITEMS;

export const PROSPECT_DETAILS_DATA_ITEMS: ConversationRightSideDetailsType[] = [
  {
    itemLabel: NAME,
    itemKey: 'name',
    ItemIcon: ProspectNameIcon,
  },
  {
    itemLabel: EMAIL,
    itemKey: 'email',
    ItemIcon: ProspectEmailIcon,
  },
  {
    itemLabel: LOCATION,
    itemKey: 'location',
    ItemIcon: LocationSmallIcon,
  },
];

export const COMPANY_DETAILS_DATA_ITEMS: ConversationRightSideDetailsType[] = [
  {
    itemLabel: NAME,
    itemKey: 'name',
    ItemIcon: CompanyNameIcon,
  },
  {
    itemLabel: LOCATION,
    itemKey: 'location',
    ItemIcon: LocationSmallIcon,
  },
  {
    itemLabel: REVENUE,
    itemKey: 'revenue',
    ItemIcon: CompanyRevenueIcon,
  },
  {
    itemLabel: NUMBER_OF_EMPLOYEES,
    itemKey: 'employees',
    ItemIcon: CompanyNumberOfEmployeesIcon,
  },
  {
    itemLabel: DOMAIN,
    itemKey: 'domain',
    ItemIcon: CompanyDomainIcon,
  },
  {
    itemLabel: FOUNDATION_DATE,
    itemKey: 'foundationDate',
    ItemIcon: CompanyFoundationDate,
  },
];
