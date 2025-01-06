import { ConversationsTableViewProps, LeadsTableViewProps } from '@meaku/core/types/admin/admin-table';
import { AuthResponse } from '@meaku/core/types/admin/auth';
import { getDefaultDataForLeadsPage } from './common';

// Authentication

export const ACCESS_TOKEN_EXPIRATION_TIME = 1; // MINUTES
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
export const PAGINATION_PER_PAGE_OPTIONS = ['10', '20', '50'];
export const PAGINATION_DEFAULT_ITEMS_PER_PAGE = 50;

// ICON Props

export const NAV_LINK_ICON_PROPS = {
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
  color: 'rgb(var(--primary))',
};

export const PAGE_HEADER_TITLE_ICON_PROPS = {
  width: '24',
  height: '25',
  viewBox: '0 0 24 25',
  color: 'rgb(var(--primary))',
};

export const DOWNLOAD_ITEM_EXPORT_XSLS_LABEL = 'Export to XSLS';
export const DOWNLOAD_ITEM_EXPORT_CSV_LABEL = 'Export to CSV';
export const XSLS_LABEL = 'XSLS';
export const CSV_LABEL = 'CSV';

export const TABLE_SORT_ICON_PROPS = NAV_LINK_ICON_PROPS;
export const PAGINATION_ARROW_ICONS = NAV_LINK_ICON_PROPS;
export const DROPDOWN_ARROW_ICONS = PAGE_HEADER_TITLE_ICON_PROPS;
export const EXPORT_DOWNLOAD_ICONS = PAGE_HEADER_TITLE_ICON_PROPS;
export const ALL_FILTERS_ICONS = PAGE_HEADER_TITLE_ICON_PROPS;
export const SORT_FILTER_ICON = PAGE_HEADER_TITLE_ICON_PROPS;

export const DEFAULT_USERNAME = 'Kymberly Abestango';
export const ADMIN_DASHBOARD_COMPANY_NAME = 'Breakout Admin';
export const LOGOUT_BUTTON_TITLE = 'Logout';
export const EXPORT_DOWNLOAD_LABEL = 'Download';

// Routes

export enum AppRoutesEnum {
  LEADS = 'leads',
  LOGIN = 'login',
  CONVERSATIONS = 'conversations',
  PLAYGROUND = 'playground',
}

export enum SidebarNavItemsEnum {
  LEADS_LABEL = 'Leads',
  CONVERSATIONS_LABEL = 'Conversations',
  PLAYGROUND_LABEL = 'Playground',
}

// TABLE Wrapper variables

export const LEADS_TABLE_MOCK_DATA: LeadsTableViewProps[] = [
  {
    email: 'carlos.lopez@globals.com',
    name: 'Carlos Lopez',
    role: 'IT Director',
    company: 'Global Solutions',
    location: '🇪🇸 Madrid, Spain',
    timestamp: '2024-12-08 16:45:00',
    product_of_interest: 'Cloud Integration',
  },
  {
    email: 'emma.jones@techworld.com',
    name: 'Emma Jones',
    role: 'Product Manager',
    company: 'TechWorld',
    location: '🇺🇸 New York, USA',
    timestamp: '2024-12-08 17:00:00',
    product_of_interest: 'AI Solutions',
  },
  {
    email: 'lucas.miller@futuregen.com',
    name: 'Lucas Miller',
    role: 'Lead Developer',
    company: 'FutureGen',
    location: '🇬🇧 London, UK',
    timestamp: '2024-12-08 17:15:00',
    product_of_interest: 'Blockchain Technology',
  },
  {
    email: 'isabella.davis@globalnet.com',
    name: 'Isabella Davis',
    role: 'CEO',
    company: 'GlobalNet',
    location: '🇨🇦 Toronto, Canada',
    timestamp: '2024-12-08 17:30:00',
    product_of_interest: 'Global Connectivity',
  },
  {
    email: 'oliver.smith@cloudworks.com',
    name: 'Oliver Smith',
    role: 'CTO',
    company: 'CloudWorks',
    location: '🇩🇪 Berlin, Germany',
    timestamp: '2024-12-08 17:45:00',
    product_of_interest: 'Cloud Computing',
  },
  {
    email: 'sophia.wilson@dataexperts.com',
    name: 'Sophia Wilson',
    role: 'Data Analyst',
    company: 'DataExperts',
    location: '🇦🇺 Sydney, Australia',
    timestamp: '2024-12-08 18:00:00',
    product_of_interest: 'Big Data Analytics',
  },
  {
    email: 'jackson.brown@innovatech.com',
    name: 'Jackson Brown',
    role: 'Product Manager',
    company: 'InnoVatech',
    location: '🇨🇭 Zurich, Switzerland',
    timestamp: '2024-12-08 18:15:00',
    product_of_interest: 'Tech Innovations',
  },
  {
    email: 'maria.taylor@smartsolutions.com',
    name: 'Maria Taylor',
    role: 'Marketing Lead',
    company: 'SmartSolutions',
    location: '🇪🇸 Barcelona, Spain',
    timestamp: '2024-12-08 18:30:00',
    product_of_interest: 'Smart Devices',
  },
  {
    email: 'daniel.martinez@ecomverse.com',
    name: 'Daniel Martinez',
    role: 'Sales Director',
    company: 'Ecomverse',
    location: '🇫🇷 Paris, France',
    timestamp: '2024-12-08 18:45:00',
    product_of_interest: 'E-commerce Solutions',
  },
  {
    email: 'lily.harris@nextgen.co',
    name: 'Lily Harris',
    role: 'HR Specialist',
    company: 'NextGen Co',
    location: '🇯🇵 Tokyo, Japan',
    timestamp: '2024-12-08 19:00:00',
    product_of_interest: 'Talent Management Software',
  },
];

export const CONVERSATIONS_TABLE_MOCK_DATA: ConversationsTableViewProps[] = [
  {
    company: 'Global Solutions',
    name: 'Carlos Lopez',
    email: 'carlos.lopez@globals.com',
    timestamp: '2024-12-08 16:45:00',
    conversation_preview:
      'Interested in pricing details, including the enterprise plans and volume discounts for larger teams',
    location: '🇪🇸 Madrid, Spain',
    buyer_intent: 'lead',
    bant_analysis: 'Approved, Decision Maker, Confirmed, Q1 2024',
    number_of_user_messages: '45',
    meeting_status: 'Booked',
    product_of_interest: 'Cloud Integration',
    ip_address: '192.168.0.1',
    session_id: '12345ABCDEF',
  },
  {
    company: 'Innovative Tech',
    name: 'Emily Davis',
    email: 'emily.davis@innotech.com',
    timestamp: '2024-11-30 14:30:00',
    conversation_preview:
      'Can we schedule a demo to walk through the key features and understand how it fits our workflow',
    location: '🇺🇸 New York, USA',
    buyer_intent: 'medium',
    bant_analysis: 'Pending, Researcher, Potential, Q2 2024',
    number_of_user_messages: '32',
    meeting_status: 'Not Booked',
    product_of_interest: 'AI Analytics',
    ip_address: 'IP Hidden',
    session_id: '78910XYZ987',
  },
  {
    company: 'Tech Pioneers',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@techpioneers.io',
    timestamp: '2024-10-15 09:15:00',
    conversation_preview: 'How does the AI handle multilingual conversations or queries from non-English speakers',
    location: '🇮🇳 Bangalore, India',
    buyer_intent: 'low',
    bant_analysis: 'Unknown, Influencer, Unclear, Immediate',
    number_of_user_messages: '27',
    meeting_status: 'Booked',
    product_of_interest: 'Enterprise SaaS',
    ip_address: '203.120.45.78',
    session_id: '56789QWERTY',
  },
  {
    company: 'NextGen Enterprises',
    name: 'Sophia Liu',
    email: 'sophia.liu@nextgen.com',
    timestamp: '2024-09-25 12:00:00',
    conversation_preview:
      'Need technical support guidance for resolving API connection issues and configuring workflows',
    location: '🇨🇳 Shanghai, China',
    buyer_intent: 'medium',
    bant_analysis: 'Approved, Decision Maker, Confirmed, Q3 2024',
    number_of_user_messages: '56',
    meeting_status: 'Not Booked',
    product_of_interest: 'API Integration Suite',
    ip_address: 'IP Hidden',
    session_id: '24680ZXCVBN',
  },
  {
    company: 'Venture Horizons',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@venturehorizons.org',
    timestamp: '2024-12-01 10:00:00',
    conversation_preview: 'Looking for an overview of the product roadmap and future updates',
    location: '🇦🇪 Dubai, UAE',
    buyer_intent: 'lead',
    bant_analysis: 'Pending, Researcher, Potential, Q4 2024',
    number_of_user_messages: '40',
    meeting_status: 'Not Booked',
    product_of_interest: 'Cloud Storage Solutions',
    ip_address: '123.45.67.89',
    session_id: '11122KLOP34',
  },
  {
    company: 'Bright Horizons',
    name: 'John Smith',
    email: 'john.smith@bright.com',
    timestamp: '2024-11-20 18:15:00',
    conversation_preview: 'What security protocols are in place to protect sensitive customer data?',
    location: '🇨🇦 Toronto, Canada',
    buyer_intent: 'low',
    bant_analysis: 'Unknown, Influencer, Unclear, Immediate',
    number_of_user_messages: '18',
    meeting_status: 'Booked',
    product_of_interest: 'Data Security Tools',
    ip_address: 'IP Hidden',
    session_id: '90876UIOP12',
  },
  {
    company: 'EcoTech',
    name: 'Li Wei',
    email: 'li.wei@ecotech.cn',
    timestamp: '2024-10-05 09:30:00',
    conversation_preview: 'Can your software integrate with renewable energy monitoring systems?',
    location: '🇨🇳 Beijing, China',
    buyer_intent: 'medium',
    bant_analysis: 'Approved, Decision Maker, Confirmed, Q3 2024',
    number_of_user_messages: '38',
    meeting_status: 'Not Booked',
    product_of_interest: 'Energy Management Software',
    ip_address: '10.0.0.2',
    session_id: '56321MNOP34',
  },
  {
    company: 'Urban Networks',
    name: 'Alice Brown',
    email: 'alice.brown@urbanetworks.net',
    timestamp: '2024-12-12 14:00:00',
    conversation_preview: 'What is the SLA for support tickets and issue resolution timelines?',
    location: '🇬🇧 London, UK',
    buyer_intent: 'lead',
    bant_analysis: 'Pending, Researcher, Potential, Q1 2025',
    number_of_user_messages: '50',
    meeting_status: 'Booked',
    product_of_interest: 'Network Optimization Suite',
    ip_address: '172.16.254.1',
    session_id: '33445RSTUV',
  },
  {
    company: 'Tech Innovators',
    name: 'Mike Johnson',
    email: 'mike.johnson@techinnovators.io',
    timestamp: '2024-11-18 11:45:00',
    conversation_preview: 'Do you offer customization options for enterprise clients?',
    location: '🇦🇺 Sydney, Australia',
    buyer_intent: 'medium',
    bant_analysis: 'Approved, Decision Maker, Confirmed, Q4 2024',
    number_of_user_messages: '36',
    meeting_status: 'Not Booked',
    product_of_interest: 'Custom SaaS Solutions',
    ip_address: '192.0.2.1',
    session_id: '54321XYZ987',
  },
  {
    company: 'Global Reach',
    name: 'Linda Thompson',
    email: 'linda.thompson@globalreach.com',
    timestamp: '2024-12-20 13:25:00',
    conversation_preview: 'Does your system support real-time analytics and reporting?',
    location: '🇩🇪 Berlin, Germany',
    buyer_intent: 'lead',
    bant_analysis: 'Pending, Researcher, Potential, Q2 2025',
    number_of_user_messages: '29',
    meeting_status: 'Booked',
    product_of_interest: 'Analytics Platform',
    ip_address: 'IP Hidden',
    session_id: '67890ABCDE',
  },
];

export const DEFAULT_DATA_FOR_LEADS_PAGE = getDefaultDataForLeadsPage(15, LEADS_TABLE_MOCK_DATA);

export const DEFAULT_DATA_FOR_CONVERSATIONS_PAGE = getDefaultDataForLeadsPage(15, CONVERSATIONS_TABLE_MOCK_DATA);

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

export const CONVERSATIONS_PAGE_FUNNEL_DATA: FunnelData[] = [
  {
    funnelChipType: ConversationChipLabelEnum.TOTAL_TRAFFIC,
    funnelChipLabel: 'Total traffic',
    funnelNumericLabel: '1,256',
    funnelKey: ConversationChipLabelEnum.TOTAL_TRAFFIC,
  },
  {
    funnelChipType: ConversationChipLabelEnum.TOTAL_CONVERSATIONS,
    funnelChipLabel: 'Total Conversations',
    funnelNumericLabel: '1,256',
    funnelKey: ConversationChipLabelEnum.TOTAL_CONVERSATIONS,
  },
  {
    funnelChipType: ConversationChipLabelEnum.HIGH_INTENT_CONVERSATIONS,
    funnelChipLabel: 'High-Intent Conversations',
    funnelNumericLabel: '803',
    funnelKey: ConversationChipLabelEnum.HIGH_INTENT_CONVERSATIONS,
  },
  {
    funnelChipType: ConversationChipLabelEnum.LEAD_GENERATED,
    funnelChipLabel: 'Lead generated',
    funnelNumericLabel: '432',
    funnelKey: ConversationChipLabelEnum.LEAD_GENERATED,
  },
];

// Filters
export const FILTER_DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

export const BY_INTENT_SCORE_FILTER_LABEL = 'By intent score';
export const BY_DATE_RANGE_FILTER_LABEL = 'By date range';
export const BY_LOCATION_FILTER_LABEL = 'By location';
