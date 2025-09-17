import { AuthResponse } from '@meaku/core/types/admin/auth';
import { FilterType, PresetDateLabel, TableAllFilterConfig } from '@meaku/core/types/admin/filters';
import FilterProductOfInterestIcon from '@breakout/design-system/components/icons/filter-productofinterest-icon';
import FilterAssignedUserEmailIcon from '@breakout/design-system/components/icons/filter-assigneduseremail-icon';
import FilterLocationIcon from '@breakout/design-system/components/icons/filter-location-icon';
import FilterMeetingBookedIcon from '@breakout/design-system/components/icons/filter-meetingbooked-icon';
import FilterIntentScoreIcon from '@breakout/design-system/components/icons/filter-intentscore-icon';
import FilterStatusIcon from '@breakout/design-system/components/icons/filter-intentscore-icon';
import FilterDateIcon from '@breakout/design-system/components/icons/filter-date-icon';
import FilterCompanyIcon from '@breakout/design-system/components/icons/filter-company-icon';
import FilterSourcesIcon from '@breakout/design-system/components/icons/filter-sources-icon';
import FilterFileTypeIcon from '@breakout/design-system/components/icons/filter-filetype-icon';
import FilterDurationIcon from '@breakout/design-system/components/icons/filter-duration-icon';
import FilterUsageCountIcon from '@breakout/design-system/components/icons/filter-usage-count-icon';
import FilterUserMessagesCountIcon from '@breakout/design-system/components/icons/filter-message-count-icon';
import SummaryConversationIcon from '@breakout/design-system/components/icons/summary-conv-icon';
// import SummaryBantAnalysisIcon from '@breakout/design-system/components/icons/summary-bant-icon';
import SummarySessionDurationIcon from '@breakout/design-system/components/icons/summary-sessionduration-icon';
import SummaryEntryPointIcon from '@breakout/design-system/components/icons/summary-entrypoint-icon';
import SummaryProductOfInterestIcon from '@breakout/design-system/components/icons/summary-product-icon';
import SummaryIntentScoreIcon from '@breakout/design-system/components/icons/summary-intentscore-icon';
import SummaryLengthOfConvIcon from '@breakout/design-system/components/icons/summary-lengthofconv-icon';
import SummaryIpAddressIcon from '@breakout/design-system/components/icons/summary-ipaddress-icon';
import ProspectNameIcon from '@breakout/design-system/components/icons/person-icon';
import ProspectEmailIcon from '@breakout/design-system/components/icons/email-icon';
import LocationSmallIcon from '@breakout/design-system/components/icons/location-icon';
import LinkedInIcon from '@breakout/design-system/components/icons/linkedin-icon';
import CompanyNameIcon from '@breakout/design-system/components/icons/company-name-icon';
import CompanyIndustryIcon from '@breakout/design-system/components/icons/company-industry-icon';
import CompanyDomainIcon from '@breakout/design-system/components/icons/company-domain-icon';
import CompanyFoundationDate from '@breakout/design-system/components/icons/company-foundation-date';
import CompanyNumberOfEmployeesIcon from '@breakout/design-system/components/icons/company-numberofemployees-icon';
import CompanyRevenueIcon from '@breakout/design-system/components/icons/company-revenue-icon';
import { ConversationRightSideDetailsType, NavLinkItem } from './admin-types';
import { ExportFormat, type SdrAssignment } from '@meaku/core/types/admin/api';
import PanelConversationIcon from '@breakout/design-system/components/icons/panel-conversation-icon';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import PanelAgentActiveIcon from '@breakout/design-system/components/icons/panel-agent-active-icon';
import PanelAgentIcon from '@breakout/design-system/components/icons/panel-agent-icon';
import PanelTrainingActiveIcon from '@breakout/design-system/components/icons/panel-training-active-icon';
import PanelTrainingIcon from '@breakout/design-system/components/icons/panel-training-icon';
import PanelInsightsIcon from '@breakout/design-system/components/icons/panel-insights-icon';
import PanelProfileIcon from '@breakout/design-system/components/icons/panel-profile-icon';
import PanelProfileActiveIcon from '@breakout/design-system/components/icons/panel-profile-active-icon';
import PanelInsightsActiveIcon from '@breakout/design-system/components/icons/panel-insights-active-icon';
import PanelIntegrationsIcon from '@breakout/design-system/components/icons/panel-integrations-icon';
import PanelIntegrationsActiveIcon from '@breakout/design-system/components/icons/panel-integrations-active-icon';
import CalendarIcon from '@breakout/design-system/components/icons/panel-calendar-icon';
import CalendarActiveIcon from '@breakout/design-system/components/icons/panel-calendar-active-icon';
import { ExternalLink, History, Link, MonitorSmartphone, User } from 'lucide-react';
import { ArtifactsSortValues, DocumentsSortValues, SortValues, WebpagesSortValues } from '@meaku/core/types/admin/sort';
import { AgentResponseWordCountEnum, PlaygroundView } from '@meaku/core/types/common';

// Use this Website to get the logo: https://brandfetch.com/
export const ROUTING_TYPE_LOGO_MAP = {
  BREAKOUT:
    'https://cdn.brandfetch.io/idF2B6m6e_/w/150/h/150/theme/light/logo.png?c=1bxid64Mup7aczewSAYMX&t=1750437867259',
  SALESFORCE: 'https://cdn.brandfetch.io/idVE84WdIN/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667559911541',
  HUBSPOT: 'https://cdn.brandfetch.io/idRt0LuzRf/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1668515570889',
  ATTIO: 'https://cdn.brandfetch.io/idZA7HYRWK/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1695805844509',
};

const {
  DateRange,
  IntentScore,
  MeetingBooked,
  Location,
  ProductOfInterest,
  Company,
  UserMessagesCount,
  UsageCount,
  // SearchTableContent,
  Duration,
  Sources,
  Status,
  FileType,
  ProductInterest,
  SdrAssignment,
} = FilterType;
const { Today, Yesterday, Last7Days, Last30Days, Last90Days, CustomRange } = PresetDateLabel;

export const CONVERSATION_LABEL_UPPERCASE = 'CONVERSATION';
export const LEAD_LABEL_UPPERCASE = 'LEAD';
export const INSIGHT_LABEL = 'INSIGHT';
export const VISITOR_LABEL_UPPERCASE = 'PROSPECT';

export const TABLE_COLUMN_WIDTH_SIZE = 200;

export const USER_MESSAGES_COUNT_FILTER_MAX_THRESHOLD = 100;

export const TOP_HEADER_CONTAINER_HEIGHT_WITH_PADDING = 58;
export const CONVERSATION_DETAILS_BREADCRUMB_HEIGHT = 50;
export const CONVERSATION_DETAILS_NAVIGATION_HEADER_HEIGHT = 81;
export const STICKY_TOP_VALUE_CONVERSATION_DETAILS_PAGE =
  CONVERSATION_DETAILS_BREADCRUMB_HEIGHT + CONVERSATION_DETAILS_NAVIGATION_HEADER_HEIGHT;

export const DefaultAuthResponse: AuthResponse = {
  id: 0,
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  profile_picture: '',
  is_active: false,
  is_staff: false,
  date_joined: '',
  last_login: '',
  designation: '',
  department: '',
  organizations: [], // Assuming an empty array as the default for organizations
};

// Pagination
export const PAGINATION_PER_PAGE_OPTIONS_FOR_LEADS_TABLE = ['10', '25', '50', '75', '100'];
export const PAGINATION_PER_PAGE_OPTIONS_FOR_CONVERSATIONS_TABLE = ['100', '200', '500'];
export const PAGINATION_PER_PAGE_OPTIONS_FOR_DATA_SOURCE_TABLE = ['50', '100', '200', '500'];
export const PAGINATION_PER_PAGE_OPTIONS_FOR_VISITORS_TABLE = ['100', '200', '500'];

// ICON Props

export const COMMON_SMALL_ICON_PROPS = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  color: 'rgb(var(--primary))',
};

export const COMMON_ICON_PROPS = {
  width: '24',
  height: '25',
  viewBox: '0 0 24 25',
  color: 'rgb(var(--primary))',
};

export const DEFAULT_SUMMARY_VALUE =
  'The user inquired about integrating the AI tool into their e-commerce website. The AI provided detailed steps for implementation and highlighted potential benefits, such as increased customer engagement and automated query handling. The user expressed interest in testing the tool and asked about available subscription plans. The AI shared pricing information and offered to schedule a demo. The conversation concluded with the user agreeing to explore the demo option.';

export const PAGINATION_ARROW_ICONS = COMMON_SMALL_ICON_PROPS;
export const DROPDOWN_ARROW_ICONS = COMMON_ICON_PROPS;

export const DEFAULT_USERNAME = 'Kymberly Abestango';
export const ADMIN_DASHBOARD_COMPANY_NAME = 'Breakout Admin';
export const LOGOUT_BUTTON_TITLE = 'Logout';
export const EXPORT_DOWNLOAD_LABEL = 'Download';

export const MULTI_VALUE_FILTER_TYPES = [
  Location,
  ProductOfInterest,
  ProductInterest,
  Company,
  Status,
  Sources,
  SdrAssignment,
];

export enum COPIED_FIELD_TEXTS {
  EMAIL = 'Email Copied',
  SESSION_ID = 'Session ID Copied',
}

export const EXPORT_DOWNLOAD_RADIO_OPTIONS = [
  { value: ExportFormat.XLSX, label: 'Export to XLSX' },
  { value: ExportFormat.CSV, label: 'Export to CSV' },
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
    filterIcon: FilterAssignedUserEmailIcon,
    filterLabel: 'Assigned Rep',
    filterValue: '',
    filterApplied: false,
    filterKey: SdrAssignment,
    filterType: SdrAssignment,
  },
  {
    filterIcon: FilterProductOfInterestIcon,
    filterLabel: 'Product Interest',
    filterValue: '',
    filterApplied: false,
    filterKey: ProductInterest,
    filterType: ProductInterest,
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

const DATA_SOURCES_TABLE_FILTERS_CONFIG = [
  {
    filterIcon: FilterDateIcon,
    filterLabel: 'Date Range',
    filterValue: 'Nov 21 - Nov 29, 2024',
    filterApplied: true,
    filterKey: DateRange,
    filterType: DateRange,
  },
  {
    filterIcon: FilterStatusIcon,
    filterLabel: 'Status',
    filterValue: '',
    filterApplied: false,
    filterKey: Status,
    filterType: Status,
  },
  {
    filterIcon: FilterSourcesIcon,
    filterLabel: 'Sources',
    filterValue: '',
    filterApplied: false,
    filterKey: Sources,
    filterType: Sources,
  },
  {
    filterIcon: FilterUsageCountIcon,
    filterLabel: 'Usage Count',
    filterValue: '',
    filterApplied: false,
    filterKey: UsageCount,
    filterType: UsageCount,
  },
  {
    filterIcon: FilterDurationIcon,
    filterLabel: 'Duration',
    filterValue: '',
    filterApplied: false,
    filterKey: Duration,
    filterType: Duration,
  },
  {
    filterIcon: FilterFileTypeIcon,
    filterLabel: 'File Type',
    filterValue: '',
    filterApplied: false,
    filterKey: FileType,
    filterType: FileType,
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

export const INSIGHTS_DATE_RANGE_PRESET_OPTIONS = [
  { value: '-7', label: Last7Days },
  { value: '-30', label: Last30Days },
  { value: '-90', label: Last90Days },
  { value: '0', label: CustomRange },
];

const LEADS_TABLE_EXCLUDE_FILTERS = [MeetingBooked, IntentScore, UserMessagesCount, ProductOfInterest, SdrAssignment];
const CONVERSATIONS_TABLE_EXCLUDE_FILTERS = [MeetingBooked, ProductInterest, SdrAssignment];
const VISITORS_TABLE_EXCLUDE_FILTERS = [
  MeetingBooked, // TODO: remove this when nested filter is implemented
  ProductInterest,
  ProductOfInterest,
  UserMessagesCount,
  IntentScore,
];
const DATA_SOURCES_TABLE_EXCLUDE_FILTERS = [Duration, UsageCount];
const WEBPAGES_TABLE_EXCLUDE_FILTERS = [...DATA_SOURCES_TABLE_EXCLUDE_FILTERS, FileType];
const DOCUMENTS_TABLE_EXCLUDE_FILTERS = [...DATA_SOURCES_TABLE_EXCLUDE_FILTERS, Sources];
const VIDEO_SLIDES_TABLE_EXCLUDE_FILTERS = [Duration, Sources, UsageCount, FileType];

export const LEADS_TABLE_FILTERS_CONFIG = TABLE_FILTERS_CONFIG.filter(
  (item) => !LEADS_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

export const LINK_CLICKS_TABLE_FILTERS_CONFIG = TABLE_FILTERS_CONFIG.filter(
  (item) => !LEADS_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

export const CONVERSATIONS_TABLE_FILTERS_CONFIG = TABLE_FILTERS_CONFIG.filter(
  (item) => !CONVERSATIONS_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

export const VISITORS_TABLE_FILTERS_CONFIG = TABLE_FILTERS_CONFIG.filter(
  (item) => !VISITORS_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

// Not Showing Usage Count for now
export const WEBPAGES_TABLE_FILTERS_CONFIG = DATA_SOURCES_TABLE_FILTERS_CONFIG.filter(
  (item) => !WEBPAGES_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

// Not Showing Usage Count for now
export const DOCUMENTS_TABLE_FILTERS_CONFIG = DATA_SOURCES_TABLE_FILTERS_CONFIG.filter(
  (item) => !DOCUMENTS_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

// Not Showing Usage Count for now
export const VIDEOS_TABLE_FILTERS_CONFIG = DATA_SOURCES_TABLE_FILTERS_CONFIG.filter(
  (item) => !VIDEO_SLIDES_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

// Not Showing Usage Count for now
export const SLIDE_TABLE_FILTERS_CONFIG = DATA_SOURCES_TABLE_FILTERS_CONFIG.filter(
  (item) => !VIDEO_SLIDES_TABLE_EXCLUDE_FILTERS.includes(item.filterType),
);

// Routes

export enum AppRoutesEnum {
  LOGIN = 'login',
  GOOGLE_SSO_CALLBACK = 'auth/google/callback',
  INTEGRATIONS_OAUTH_CALLBACK = 'tenant/integration/oauth2/callback',
  CONVERSATIONS = 'conversations',
  ACTIVE_LEADS = 'conversations/leads',
  LINK_CLICKS = 'conversations/link-clicks',
  ACTIVE_CONVERSATIONS = 'active-conversations',
  AGENT = 'agent',
  AGENT_DATA_SOURCES = 'agent/data-sources',
  AGENT_WORKFLOW = 'agent/workflow',
  AGENT_BRANDING = 'agent/branding',
  AGENT_ENTRYPOINTS = 'agent/entrypoints',
  AGENT_CONTROLS = 'agent/controls',
  TRAINING = 'training',
  TRAINING_PLAYGROUND = 'training/playground',
  INSIGHTS = 'insights',
  SETTINGS = 'settings',
  CALENDAR = 'calendar',
  ADD_CALENDAR = 'calendar/add-calendar',
  INTEGRATIONS = 'integrations',
  PROFILE = 'profile',
  VISITORS = 'prospects',
}

export enum SidebarNavItemsEnum {
  CONVERSATIONS_LABEL = 'Visitors',
  ACTIVE_CONVERSATIONS_LABEL = 'Live Visitors',
  VISITORS_LABEL = 'Visitor List',
  AGENT_LABEL = 'Agent',
  AGENT_DATA_SOURCES_LABEL = 'Data Sources',
  AGENT_BRANDING_LABEL = 'Branding',
  AGENT_WORKFLOW_LABEL = 'Workflow',
  AGENT_ENTRYPOINTS_LABEL = 'Entry Points',
  AGENT_CONTROLS_LABEL = 'Controls',
  AGENT_CALENDAR_LABEL = 'Calendar',
  TRAINING_LABEL = 'Training',
  TRAINING_PLAYGROUND_LABEL = 'Playground',
  INSIGHT_LABEL = 'Insights',
  INTEGRATIONS_LABEL = 'Integrations',
  PROFILE_LABEL = 'Profile',
}

export const OAUTH_CALLBACK_PAGES = [AppRoutesEnum.GOOGLE_SSO_CALLBACK, AppRoutesEnum.INTEGRATIONS_OAUTH_CALLBACK];

export const DEFAULT_ROUTE = 'conversations';

// TODO: Hardcoded values for now, will be removed once we have a proper way to get the column list for link clicks page
// - Need to add another entity type for this in the server backend
export const LINK_CLICKS_PAGE_COLUMN_LISTS = [
  'timeline',
  'country',
  'lead_type',
  'product_interest',
  'buyer_intent',
  'company',
  'name',
];

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

export interface FunnelData {
  funnelChipType: string;
  funnelChipLabel: string;
  funnelNumericLabel: string;
  funnelKey: string;
}

export interface SummaryTabContentList {
  listKey: string;
  listLabel: string;
  listIcon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  listValue: string | number | BANTItem[] | ParentUrlItem | SdrAssignment;
}

export interface BANTItem {
  itemKey: string;
  itemLabel: string;
  itemIcon: string;
  itemValue: string | number;
}

export interface ParentUrlItem {
  itemLabel: string;
  itemValue: string;
}

export const CONVERSATION_DETAILS_PAGESUMMARY_TAB_CONTENT_LIST: SummaryTabContentList[] = [
  {
    listKey: 'summary',
    listLabel: 'Summary of the conversation:',
    listIcon: SummaryConversationIcon,
    listValue: '',
  },
  // {
  //   listKey: 'reachoutEmail',
  //   listLabel: '',
  //   listIcon: null,
  //   listValue: '',
  // },
  {
    listKey: 'assignRep',
    listLabel: 'Assign Rep:',
    listIcon: User,
    listValue: '',
  },
  {
    listKey: 'browsingHistorySummary',
    listLabel: "User's Browsing History Summary:",
    listIcon: History,
    listValue: '',
  },
  {
    listKey: 'intentScore',
    listLabel: 'Intent Score:',
    listIcon: SummaryIntentScoreIcon,
    listValue: 0,
  },
  // {
  //   listKey: 'bantAnalysis',
  //   listLabel: 'BANT Analysis:',
  //   listIcon: SummaryBantAnalysisIcon,
  //   listValue: [
  //     {
  //       itemKey: 'budget',
  //       itemLabel: 'Budget:',
  //       itemIcon: '💰',
  //       itemValue: '',
  //     },
  //     {
  //       itemKey: 'authority',
  //       itemLabel: 'Authority:',
  //       itemIcon: '👨‍💼',
  //       itemValue: '',
  //     },
  //     {
  //       itemKey: 'need',
  //       itemLabel: 'Need:',
  //       itemIcon: '🤲',
  //       itemValue: '',
  //     },
  //     {
  //       itemKey: 'timeline',
  //       itemLabel: 'Timeline:',
  //       itemIcon: '⏱️',
  //       itemValue: '',
  //     },
  //   ],
  // },
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
  {
    listKey: 'parentUrl',
    listLabel: 'Webpage where conversation started:',
    listIcon: Link,
    listValue: '',
  },
  {
    listKey: 'entryPoint',
    listLabel: 'Entry point for conversation:',
    listIcon: SummaryEntryPointIcon,
    listValue: '',
  },
  {
    listKey: 'deviceType',
    listLabel: 'Device Type:',
    listIcon: MonitorSmartphone,
    listValue: '',
  },
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
  {
    listKey: 'trafficSource',
    listLabel: 'Traffic Source:',
    listIcon: ExternalLink,
    listValue: '',
  },
];

export const NO_INFORMATION_PROVIDED_LABEL = 'information has not been provided.';

export enum CONV_RIGHTSIDE_DETAILS_DATA_ITEMS {
  NAME = 'Name:',
  LOCATION = 'Location:',
  EMAIL = 'Email:',
  REVENUE = 'Revenue:',
  NUMBER_OF_EMPLOYEES = 'Number of employees:',
  DOMAIN = 'Domain:',
  INDUSTRY = 'Industry:',
  FOUNDATION_DATE = 'Foundation Date:',
  LINKED_IN = 'LinkedIn:',
}

const { NAME, LOCATION, EMAIL, REVENUE, NUMBER_OF_EMPLOYEES, INDUSTRY, DOMAIN, FOUNDATION_DATE, LINKED_IN } =
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
  {
    itemLabel: LINKED_IN,
    itemKey: 'linkedInUrl',
    ItemIcon: LinkedInIcon,
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
    itemLabel: INDUSTRY,
    itemKey: 'industry',
    ItemIcon: CompanyIndustryIcon,
  },
  {
    itemLabel: DOMAIN,
    itemKey: 'domain',
    ItemIcon: CompanyDomainIcon,
  },
  {
    itemLabel: LINKED_IN,
    itemKey: 'linkedInUrl',
    ItemIcon: LinkedInIcon,
  },
  {
    itemLabel: FOUNDATION_DATE,
    itemKey: 'foundationDate',
    ItemIcon: CompanyFoundationDate,
  },
];

export const CHAT_SUMMARY_TRIM_LENGTH = 100;
export const DATA_SOURCE_DESCRIPTION_TRIM_LENGTH = 300;
// FRAMER MOTION PROPS

export const SIDEBAR_TEXTUAL_CONTENT_ANIMATION_PROPS = {
  initial: { opacity: 0, width: 0 },
  animate: { opacity: 1, width: 'auto' },
  exit: { opacity: 0, width: 0 },
  transition: {
    duration: 0.2,
    ease: 'easeInOut',
    opacity: {
      duration: 0.1,
      ease: 'easeInOut',
      delay: 0.1, // slight delay to wait for container expansion
    },
  },
};

// Agent Configs Constants Variables
export const FULL_LOGO_TITLE = 'Full Logo';
export const SQUARE_LOGO_TITLE = 'Favicon';
export const NAME_TITLE = 'Name:';
export const FULL_LOGO_SUBTITLE = 'Recommended size: 240x60px (or a similar aspect ratio)';
export const SQUARE_LOGO_SUBTITLE = 'Recommended size: 60x60px (or a square aspect ratio)';
export const NAME_SUBTITLE = 'Name your agent to match your brand.';

export const COLOR_PRIMARY_TITLE = 'Primary';
export const COLOR_SECONDARY_TITLE = 'Secondary';
export const COLOR_PRIMARY_SUBTITLE =
  'This is your primary brand color and it will be used for the primary call to action on the interface.';
export const COLOR_SECONDARY_SUBTITLE =
  'This is your accent color used for support visuals like dynamically generated slides.';

export const ORB_DESCRIPTION =
  'The orb in the conversation interface is based on the primary color. You can either use the standard orb or replace it with your favicon logo.';

export const FONT_STYLE_SUBTITLE = 'Choose a font to match your assistant’s UI with your brand and boost readability.';

export const CUSTOM_DOCUMENT_DEFAULT_TITLE = '';
export const CUSTOM_DOCUMENT_DEFAULT_DESCRIPTION = '';

// Default values when no source is selected
export const CUSTOM_DOCUMENT_DEFAULT_SOURCE = {
  id: 0,
  title: CUSTOM_DOCUMENT_DEFAULT_TITLE,
  data: CUSTOM_DOCUMENT_DEFAULT_DESCRIPTION,
  relevant_queries: [],
};

// Sidebar Navigation Configs
export enum SideNavView {
  MAIN = 'MAIN',
  SETTINGS = 'SETTINGS',
}

export enum NavigationGroup {
  ACCOUNT_SETTINGS = 'Account Settings',
  WORKSPACE_SETTINGS = 'Workspace Settings',
}

export const MAIN_LINK_ITEMS: NavLinkItem[] = [
  {
    navUrl: `/${AppRoutesEnum.ACTIVE_CONVERSATIONS}`,
    navItem: SidebarNavItemsEnum.ACTIVE_CONVERSATIONS_LABEL,
    icon: PanelConversationIcon,
    activeIcon: PanelConversationActiveIcon,
    requiredFeatureFlag: 'active_conversations_enabled',
  },
  {
    navUrl: `/${AppRoutesEnum.CONVERSATIONS}`,
    navItem: SidebarNavItemsEnum.CONVERSATIONS_LABEL,
    icon: PanelConversationIcon,
    activeIcon: PanelConversationActiveIcon,
  },
  {
    navUrl: `/${AppRoutesEnum.AGENT}`,
    navItem: SidebarNavItemsEnum.AGENT_LABEL,
    icon: PanelAgentIcon,
    activeIcon: PanelAgentActiveIcon,
    children: [
      {
        navUrl: `/${AppRoutesEnum.AGENT_DATA_SOURCES}`,
        navItem: SidebarNavItemsEnum.AGENT_DATA_SOURCES_LABEL,
      },
      {
        navUrl: `/${AppRoutesEnum.AGENT_BRANDING}`,
        navItem: SidebarNavItemsEnum.AGENT_BRANDING_LABEL,
      },
      {
        navUrl: `/${AppRoutesEnum.AGENT_ENTRYPOINTS}`,
        navItem: SidebarNavItemsEnum.AGENT_ENTRYPOINTS_LABEL,
      },
      {
        navUrl: `/${AppRoutesEnum.AGENT_CONTROLS}`,
        navItem: SidebarNavItemsEnum.AGENT_CONTROLS_LABEL,
      },
    ],
  },
  {
    navUrl: `/${AppRoutesEnum.TRAINING}`,
    navItem: SidebarNavItemsEnum.TRAINING_LABEL,
    icon: PanelTrainingIcon,
    activeIcon: PanelTrainingActiveIcon,
    children: [
      {
        navUrl: `/${AppRoutesEnum.TRAINING_PLAYGROUND}`,
        navItem: SidebarNavItemsEnum.TRAINING_PLAYGROUND_LABEL,
      },
    ],
  },
  {
    navUrl: `/${AppRoutesEnum.INSIGHTS}`,
    navItem: SidebarNavItemsEnum.INSIGHT_LABEL,
    icon: PanelInsightsIcon,
    activeIcon: PanelInsightsActiveIcon,
  },
];

export const SETTINGS_LINK_ITEMS: NavLinkItem[] = [
  // All Workspace Settings - write in order
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.INTEGRATIONS}`,
    navItem: SidebarNavItemsEnum.INTEGRATIONS_LABEL,
    icon: PanelIntegrationsIcon,
    activeIcon: PanelIntegrationsActiveIcon,
    group: NavigationGroup.WORKSPACE_SETTINGS,
  },
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.CALENDAR}`,
    navItem: SidebarNavItemsEnum.AGENT_CALENDAR_LABEL,
    icon: CalendarIcon,
    activeIcon: CalendarActiveIcon,
    group: NavigationGroup.WORKSPACE_SETTINGS,
  },
  // All Account Settings - write below in order
  {
    navUrl: `/${AppRoutesEnum.SETTINGS}/${AppRoutesEnum.PROFILE}`,
    navItem: SidebarNavItemsEnum.PROFILE_LABEL,
    icon: PanelProfileIcon,
    activeIcon: PanelProfileActiveIcon,
    group: NavigationGroup.ACCOUNT_SETTINGS,
  },
];

export const SIDE_NAV_VIEW_TO_ITEMS = {
  [SideNavView.MAIN]: MAIN_LINK_ITEMS,
  [SideNavView.SETTINGS]: SETTINGS_LINK_ITEMS,
};

export const INITIAL_SORT_VALUES: SortValues = {
  timestampSort: null,
  timelineSort: null,
  user_message_countSort: null,
  buyer_intentSort: null,
  session_idSort: null,
  nameSort: null,
  emailSort: null,
  roleSort: null,
  countrySort: null,
  companySort: null,
  product_interestSort: null,
  product_of_interestSort: null,
  ip_addressSort: null,
  lead_typeSort: null,
  sdr_assignmentSort: null,
  updated_onSort: null,
};

export const FIELD_TO_SORT_KEY_MAP: Record<string, keyof SortValues> = {
  created_on: 'timestampSort',
  timestamp: 'timestampSort',
  user_message_count: 'user_message_countSort',
  buyer_intent: 'buyer_intentSort',
  timeline: 'timelineSort',
  session_id: 'session_idSort',
  name: 'nameSort',
  email: 'emailSort',
  role: 'roleSort',
  country: 'countrySort',
  company: 'companySort',
  product_interest: 'product_interestSort',
  product_of_interest: 'product_of_interestSort',
  ip_address: 'ip_addressSort',
  lead_type: 'lead_typeSort',
  sdr_assignment: 'sdr_assignmentSort',
  updated_on: 'updated_onSort',
};

export const SORT_KEY_TO_FIELD_MAP: Record<keyof SortValues, string> = {
  timestampSort: 'timestamp',
  user_message_countSort: 'user_message_count',
  buyer_intentSort: 'buyer_intent',
  timelineSort: 'timeline',
  session_idSort: 'session_id',
  nameSort: 'name',
  emailSort: 'email',
  roleSort: 'role',
  countrySort: 'country',
  companySort: 'company',
  product_interestSort: 'product_interest',
  product_of_interestSort: 'product_of_interest',
  ip_addressSort: 'ip_address',
  lead_typeSort: 'lead_type',
  sdr_assignmentSort: 'sdr_assignment',
  updated_onSort: 'updated_on',
};

export const WEBPAGES_SORT_KEY_TO_FIELD_MAP: Record<keyof WebpagesSortValues, string> = {
  updated_onSort: 'updated_on',
  statusSort: 'status',
  titleSort: 'title',
  urlSort: 'url',
};

export const DOCUMENTS_SORT_KEY_TO_FIELD_MAP: Record<keyof DocumentsSortValues, string> = {
  updated_onSort: 'updated_on',
  statusSort: 'status',
  source_nameSort: 'source_name',
  data_source_typeSort: 'data_source_type',
  descriptionSort: 'description',
};

export const ARTIFACTS_SORT_KEY_TO_FIELD_MAP: Record<keyof ArtifactsSortValues, string> = {
  updated_onSort: 'updated_on',
  statusSort: 'status',
  assetSort: 'asset',
  descriptionSort: 'description',
};

export const PLAYGROUND_VIEW_TAB_ITEMS = [
  {
    itemKey: 'user',
    itemTitle: 'User Preview',
    itemValue: PlaygroundView.USER_PREVIEW,
  },
  {
    itemKey: 'admin',
    itemTitle: 'Admin View',
    itemValue: PlaygroundView.ADMIN_VIEW,
  },
];

export const AGENT_RESPONSE_IDEAL_LENGTH_TAB_ITEMS = [
  {
    itemKey: 'brief',
    itemTitle: 'Brief',
    itemInfoTitle: 'Brief:',
    itemDescription: 'Short responses - optimized for quick conversations.',
    itemValue: AgentResponseWordCountEnum.BRIEF,
  },
  {
    itemKey: 'standard',
    itemTitle: 'Standard',
    itemInfoTitle: 'Standard:',
    itemDescription: 'Balanced length - clear and informative without being too long.',
    itemValue: AgentResponseWordCountEnum.STANDARD,
  },
  {
    itemKey: 'detailed',
    itemTitle: 'Detailed',
    itemInfoTitle: 'Detailed:',
    itemDescription:
      'Descriptive responses - when the focus is to educate the visitor, ideal for documentation pages and learning content.',
    itemValue: AgentResponseWordCountEnum.DETAILED,
  },
];

export const CREATE_CALENDAR_TAB_ITEMS_VALUES = {
  AVAILABILITY: 'availability',
  EVENT_TYPES: 'event-types',
};

export const CREATE_CALENDAR_TAB_ITEMS = [
  {
    itemKey: 'availability',
    itemTitle: 'Availability',
    itemDescription: 'Manage your availability and schedule',
    itemValue: CREATE_CALENDAR_TAB_ITEMS_VALUES.AVAILABILITY,
  },
  {
    itemKey: 'event-types',
    itemTitle: 'Event Types',
    itemDescription:
      'Create and manage your event types - enables a user to create events that others can use to book them',
    itemValue: CREATE_CALENDAR_TAB_ITEMS_VALUES.EVENT_TYPES,
  },
];
