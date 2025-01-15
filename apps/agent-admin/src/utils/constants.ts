import { AuthResponse } from '@meaku/core/types/admin/auth';

// Authentication

export const ACCESS_TOKEN_EXPIRATION_TIME = 300; // SECONDS ( 5 Minutes * 60 )
export const REFRESH_TOKEN_EXPIRATION_TIME = 1800; // SECONDS ( 30 Minutes * 60 )
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
export const PAGINATION_DEFAULT_ITEMS_PER_PAGE = 50;

// ICON Props

export const NAV_LINK_ICON_PROPS = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  color: 'rgb(var(--primary))',
};

export const PAGE_HEADER_TITLE_ICON_PROPS = NAV_LINK_ICON_PROPS;

export const COMMON_ICON_PROPS = {
  width: '24',
  height: '25',
  viewBox: '0 0 24 25',
  color: 'rgb(var(--primary))',
};

export const DOWNLOAD_ITEM_EXPORT_XSLS_LABEL = 'Export to XSLS';
export const DOWNLOAD_ITEM_EXPORT_CSV_LABEL = 'Export to CSV';
export const XSLS_LABEL = 'XSLS';
export const CSV_LABEL = 'CSV';

export const PAGINATION_ARROW_ICONS = NAV_LINK_ICON_PROPS;
export const DROPDOWN_ARROW_ICONS = COMMON_ICON_PROPS;
export const EXPORT_DOWNLOAD_ICONS = COMMON_ICON_PROPS;
export const ALL_FILTERS_ICONS = COMMON_ICON_PROPS;
export const SORT_FILTER_ICON = COMMON_ICON_PROPS;

export const DEFAULT_USERNAME = 'Kymberly Abestango';
export const ADMIN_DASHBOARD_COMPANY_NAME = 'Breakout Admin';
export const LOGOUT_BUTTON_TITLE = 'Logout';
export const EXPORT_DOWNLOAD_LABEL = 'Download';

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
  'bant_analysis',
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
